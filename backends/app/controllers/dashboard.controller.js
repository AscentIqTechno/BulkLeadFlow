const mongoose = require("mongoose");
const db = require("../models");
const EmailDirectory = db.emailDirectory;
const User = db.user;
const Subscription = db.subscription;
const Plan = db.plan;
const Payment = db.payment;
const SmtpConfig = db.smtp;
const SmsGatewayConfig = db.SmsGatewayConfig;
const SmsCampaign = db.smsCampaign;
const Campaign = db.campaign;
const NumberDirectory = db.numberDirectory;

/* ---------------------------------------------------------
    🚀 USER DASHBOARD (UNCHANGED WITH LAST 10 CAMPAIGNS)
--------------------------------------------------------- */
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate("subscription")
      .populate("currentPlan")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const subscription = user.subscription || {};
    const planLimits = subscription.planLimits || {};
    const planUsage = subscription.planUsage || {};

    const smsCampaignsCount = await SmsCampaign.countDocuments({ userId });
    const emailCampaignsCount = await Campaign.countDocuments({ userId });

    const lastSmsCampaigns = await SmsCampaign.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const lastEmailCampaigns = await Campaign.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const smtpConfigs = await SmtpConfig.countDocuments({ userId });
    const smsGateways = await SmsGatewayConfig.countDocuments({ userId });

    const numbers = await NumberDirectory.countDocuments({ userId });
    const emails = await EmailDirectory.countDocuments({ userId });

    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        profileCompleted: user.profileCompleted,
        subscription: {
          plan: user.currentPlan?.name || null,
          status: subscription.subscriptionStatus || null,
          startDate: subscription.startDate || null,
          endDate: subscription.endDate || null,
          limits: planLimits,
          usage: planUsage,
        },
      },
      stats: {
        smsCampaignsCount,
        emailCampaignsCount,
        smtpConfigs,
        smsGateways,
        totalNumbers: numbers,
        totalEmails: emails,
        totalPayments: totalPaid,
        lastSmsCampaigns,
        lastEmailCampaigns,
      },
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/* ---------------------------------------------------------
    👑 ADMIN DASHBOARD (NO LISTS — ONLY COUNTS)
--------------------------------------------------------- */
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: "active" });

    const totalRevenueAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const totalSmsCampaigns = await SmsCampaign.countDocuments();
    const totalEmailCampaigns = await Campaign.countDocuments();

    const totalSmtpConfigs = await SmtpConfig.countDocuments();
    const totalSmsGateways = await SmsGatewayConfig.countDocuments();

    // NEW → Count all user directories
    const totalNumberDirectory = await NumberDirectory.countDocuments();
    const totalEmailDirectory = await EmailDirectory.countDocuments();

    return res.json({
      success: true,
      stats: {
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        totalSmsCampaigns,
        totalEmailCampaigns,
        totalSmtpConfigs,
        totalSmsGateways,
        totalNumberDirectory,
        totalEmailDirectory,
      },
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};


