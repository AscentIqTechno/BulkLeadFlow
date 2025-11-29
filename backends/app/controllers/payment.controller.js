const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require("../models");
const User = db.user;
const Plan = db.plan;
const Subscription = db.subscription;
const Payment = db.payment;
const RazorpayConfig = require("../models/razorpayConfig.model");



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
    const { planId } = req.body;
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).send({ success: false, message: "Plan not found" });
    }

    const razorConfig = await RazorpayConfig.findOne({ isActive: true }).select("+keySecret");
    console.log(razorConfig)
    if (!razorConfig) {
      return res.status(400).send({ success: false, message: "Razorpay config missing" });
    }

    const razorpay = new Razorpay({
      key_id: razorConfig.keyId,
      key_secret: razorConfig.keySecret,
    });

    // 🔥 FIX RECEIPT HERE — short & safe (< 40 chars)
    const receipt = `rcpt_${Date.now().toString().slice(-10)}`;

    const options = {
      amount: plan.price * 100,
      currency: "INR",
      receipt,   // <-- FIXED HERE
      notes: {
        planId,
        userId: req.userId,
      }
    };

    console.log("🧾 Receipt Sent To Razorpay:", receipt);

    const order = await razorpay.orders.create(options);

    return res.send({
      success: true,
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorConfig.keyId,
      }
    });

  } catch (error) {
    console.log("❌ Create order error:", error);
    return res.status(400).send({
      success: false,
      message: error.error?.description || "Order creation failed",
    });
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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data"
      });
    }

    // Fetch active config
    const config = await RazorpayConfig.findOne({ isActive: true }).select("+keySecret");
    if (!config) {
      return res.status(503).json({ 
        success: false, 
        message: "Razorpay not configured" 
      });
    }

    // Validate signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", config.keySecret)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      console.error("❌ Signature verification failed");
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Update payment record
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
    if (!plan) {
      return res.status(404).json({ 
        success: false, 
        message: "Plan not found" 
      });
    }

    // Create or update subscription
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

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
      subscription.endDate = endDate;
      subscription.isActive = true;
      subscription.subscriptionStatus = "active";
      subscription.autoRenew = true;
      subscription.planLimits = planLimits;
      subscription.planUsage = {
        emailsSent: 0,
        smsSent: 0,
        smtpConfigsUsed: 0,
        androidGatewaysUsed: 0,
        lastResetDate: now
      };
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        user: userId,
        plan: planId,
        startDate: now,
        endDate: endDate,
        isActive: true,
        subscriptionStatus: "active",
        autoRenew: true,
        planLimits: planLimits,
        planUsage: {
          emailsSent: 0,
          smsSent: 0,
          smtpConfigsUsed: 0,
          androidGatewaysUsed: 0,
          lastResetDate: now
        }
      });
    }

    // Update user
    await User.findByIdAndUpdate(userId, {
      subscription: subscription._id,
      currentPlan: planId
    });

    return res.json({
      success: true,
      message: "Payment verified & subscription activated",
      data: {
        subscriptionId: subscription._id,
        plan: plan.name
      }
    });

  } catch (err) {
    console.error("❌ Payment verification error:", err);
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
    console.error("❌ Free subscription error:", error);
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
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  let subscription = await Subscription.findOne({ user: userId });

  if (subscription) {
    subscription.plan = planId;
    subscription.startDate = now;
    subscription.endDate = periodEnd;
    subscription.status = 'active';
    subscription.cancelAtPeriodEnd = false;
  } else {
    subscription = new Subscription({
      user: userId,
      plan: planId,
      startDate: now,
      endDate: periodEnd,
      status: 'active'
    });
  }

  await subscription.save();

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