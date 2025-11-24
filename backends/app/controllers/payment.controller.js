const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require("../models");
const User = db.user;
const Plan = db.plan;
const Subscription = db.subscription;
const Payment = db.payment;

// Initialize Razorpay
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully');
  } else {
    console.warn('⚠️  Razorpay credentials missing. Payment features will be disabled.');
  }
} catch (error) {
  console.error('❌ Razorpay initialization failed:', error.message);
}

// Get all active plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error("Get plans error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans"
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    console.log("🔧 Creating Razorpay order...");

    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment gateway is not configured"
      });
    }

    const { planId } = req.body;
    const userId = req.userId;

    // Fetch real plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // Free plan handling
    if (plan.price === 0) {
      return await handleFreeSubscription(userId, planId, res);
    }

    const amount = plan.price * 100; // Razorpay requires paisa

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        planId,
        userId: userId.toString(),
        planName: plan.name
      }
    });

    console.log(`✅ Razorpay order created: ${order.id}`);

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: order
    });

  } catch (error) {
    console.error("❌ Create order error:", error);
    return res.status(500).json({ success: false, message: "Failed to create payment order" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId
    } = req.body;

    const userId = req.userId;

    // Validate signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)   // MUST MATCH .env
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Update payment
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
        paymentDate: new Date(),
      }
    );

    const plan = await Plan.findById(planId);
    if (!plan)
      return res.status(404).json({ success: false, message: "Plan not found" });

    const now = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + 1);

    const planLimits = {
         emailsPerMonth: plan.emailsPerMonth,
    smsPerMonth: plan.smsPerMonth,
    smtpConfigs: plan.smtpConfigs,
    androidGateways: plan.androidGateways
    };

    let subscription = await Subscription.findOne({ user: userId });

    if (subscription) {
      subscription.plan = planId;
      subscription.startDate = now;
      subscription.endDate = end;
      subscription.isActive = true;
      subscription.subscriptionStatus = "active";
      subscription.autoRenew = true;

      subscription.planUsage = {
        emailsSent: 0,
        smsSent: 0,
        smtpConfigsUsed: 0,
        androidGatewaysUsed: 0,
        lastResetDate: now
      };

      subscription.planLimits = planLimits;
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        user: userId,
        plan: planId,
        startDate: now,
        endDate: end,
        isActive: true,
        subscriptionStatus: "active",
        autoRenew: true,
        planLimits,
        planUsage: {
          emailsSent: 0,
          smsSent: 0,
          smtpConfigsUsed: 0,
          androidGatewaysUsed: 0,
          lastResetDate: now
        }
      });
    }

    await User.findByIdAndUpdate(userId, {
      subscription: subscription._id,
      currentPlan: planId
    });

    return res.json({
      success: true,
      message: "Payment verified & subscription activated",
      subscription
    });

  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};



// Handle free subscription
const handleFreeSubscription = async (userId, planId, res) => {
  try {
    const plan = await Plan.findById(planId);
    if (!plan || plan.price !== 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid free plan"
      });
    }

    // Create subscription for free plan
    const subscription = await createOrUpdateSubscription(userId, planId);

    // Create free payment record
    const paymentRecord = new Payment({
      user: userId,
      plan: planId,
      amount: 0,
      currency: 'INR',
      status: 'paid',
      paymentMethod: 'free'
    });
    await paymentRecord.save();

    console.log(`✅ Free subscription activated for user: ${userId}, Plan: ${plan.name}`);

    res.status(200).json({
      success: true,
      message: "Free subscription activated successfully!",
      data: {
        subscriptionId: subscription._id,
        plan: plan.name,
        isFree: true
      }
    });
  } catch (error) {
    console.error("Free subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to activate free subscription"
    });
  }
};

// Create or update subscription
const createOrUpdateSubscription = async (userId, planId) => {
  const now = new Date();
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1); // 1 month subscription

  // Check if user already has a subscription
  let subscription = await Subscription.findOne({ user: userId });

  if (subscription) {
    // Update existing subscription
    subscription.plan = planId;
    subscription.currentPeriodStart = now;
    subscription.currentPeriodEnd = periodEnd;
    subscription.status = 'active';
    subscription.cancelAtPeriodEnd = false;
  } else {
    // Create new subscription
    subscription = new Subscription({
      user: userId,
      plan: planId,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      status: 'active'
    });
  }

  await subscription.save();

  // Update user's current plan and subscription reference
  await User.findByIdAndUpdate(userId, {
    currentPlan: planId,
    subscription: subscription._id,
    subscriptionStatus: 'active'
  });

  return subscription;
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment gateway not configured"
      });
    }

    const payment = await razorpay.payments.fetch(paymentId);
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details"
    });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment gateway not configured"
      });
    }

    const refund = await razorpay.payments.refund(paymentId, {
      amount: req.body.amount // Optional: partial refund
    });

    // Update payment status in database
    await Payment.findOneAndUpdate(
      { razorpayPaymentId: paymentId },
      { status: 'refunded' }
    );

    res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      data: refund
    });
  } catch (error) {
    console.error("Refund payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process refund"
    });
  }
};

// Get user's current subscription
exports.getSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    
    const subscription = await Subscription.findOne({ user: userId })
      .populate('plan')
      .populate('user', 'username email');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found"
      });
    }

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription"
    });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.userId;
    
    const payments = await Payment.find({ user: userId })
      .populate('plan')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history"
    });
  }
};