const db = require("../models");
const SmsCampaign = db.smsCampaign;
const SmsGatewayConfig = db.SmsGatewayConfig;
const axios = require("axios");
const Subscription = db.subscription;

exports.sendBulkSms = async (req, res) => {
  try {
    const { gatewayId, numbers, message, title } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(400).json({ success: false, error: "userId is required" });
    if (!Array.isArray(numbers) || numbers.length === 0)
      return res.status(400).json({ success: false, error: "numbers array is required" });

    const gateway = await SmsGatewayConfig.findById(gatewayId);
    if (!gateway) return res.status(404).json({ success: false, error: "Gateway not found" });

    // ------------ TEST GATEWAY CONNECTION BEFORE PROCEEDING -------------
    try {
      const ping = await axios.get(`http://${gateway.ip}:${gateway.port}/status`, { timeout: 10000 });
      console.log("Ping response:", ping.data);

      if (!ping.data || ping.data.status !== "online") {
        return res.status(400).json({
          success: false,
          message: "Gateway is not running or offline.",
        });
      }
    } catch (err) {
      console.error("Ping failed:", err.message);
      return res.status(400).json({
        success: false,
        message: "Cannot connect to SMS Gateway. Invalid IP, port, or device offline.",
      });
    }


    // --------------------------------------------------------------------

    // Fetch subscription
    const subscription = await Subscription.findOne({ user: userId, isActive: true });
    const planUsage = subscription?.planUsage;
    const planLimits = subscription?.planLimits;

    const remainingQuota =
      planLimits?.smsPerMonth === -1
        ? numbers.length
        : (planLimits?.smsPerMonth || 0) - (planUsage?.smsSent || 0);

    if (remainingQuota <= 0) {
      return res.status(403).json({
        success: false,
        message: "SMS limit reached — cannot send any more messages this month"
      });
    }

    const numbersToSend = numbers.slice(0, remainingQuota);
    const blockedNumbers = numbers.slice(remainingQuota);

    // ------------------- ONLY CREATE CAMPAIGN NOW --------------------
    const campaign = await SmsCampaign.create({
      userId,
      gatewayId,
      smsTitle: title,
      message,
      selectedNumbers: numbers,
      totalContacts: numbers.length,
      sentCount: 0,
      failedCount: 0,
      status: "processing",
    });

    let sentCount = 0;
    let failedCount = 0;
    const results = [];
    const SMS_ENDPOINT = "/send-sms";

    // Send SMS
    for (const num of numbersToSend) {
      try {
        const resp = await axios.post(`http://${gateway.ip}:${gateway.port}${SMS_ENDPOINT}`, {
          phone: num,
          message,
        });

        const status = resp?.data?.status ||
          (resp.status >= 200 && resp.status < 300 ? "sent" : "failed");

        if (status === "sent" || status === "delivered") sentCount++;
        else failedCount++;

        results.push({ number: num, status });
      } catch (err) {
        failedCount++;
        results.push({ number: num, status: "failed" });
      }
    }

    for (const num of blockedNumbers) {
      results.push({ number: num, status: "blocked", reason: "SMS limit reached" });
      failedCount++;
    }

    const finalStatus = failedCount === 0 ? "sent" :
      sentCount === 0 ? "failed" : "partial";

    const updatedCampaign = await SmsCampaign.findByIdAndUpdate(
      campaign._id,
      { sentCount, failedCount, status: finalStatus, results },
      { new: true, runValidators: true }
    ).lean();

    if (subscription && planUsage) {
      planUsage.smsSent = (planUsage.smsSent || 0) + sentCount;
      subscription.markModified("planUsage");
      await subscription.save();
    }

    res.json({
      success: true,
      campaignId: updatedCampaign._id,
      total: numbers.length,
      sent: sentCount,
      failed: failedCount,
      results,
      campaign: updatedCampaign,
    });

  } catch (e) {
    console.error("SEND BULK SMS ERROR:", e);
    res.status(500).json({ success: false, error: e.message });
  }
};


// ------------------ GET ALL CAMPAIGNS ------------------
exports.getSMScompain = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) return res.status(400).json({ success: false, error: "userId is required" });

    // Fetch campaigns with selected fields for safety
    const records = await SmsCampaign.find({ userId })
      .sort({ createdAt: -1 })
      .select(
        "_id userId smsTitle gatewayId selectedNumbers message totalContacts sentCount failedCount status createdAt updatedAt"
      )
      .lean(); // returns plain JS objects

    res.json({ success: true, records });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// ------------------ GET CAMPAIGN BY ID ------------------
exports.getCampaignById = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (!userId) return res.status(400).json({ success: false, error: "userId is required" });

    const record = await SmsCampaign.findOne({ _id: id, userId }).lean();
    if (!record) return res.status(404).json({ success: false, error: "Campaign not found" });

    res.json({ success: true, record });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// ------------------ UPDATE CAMPAIGN ------------------
exports.updateSMScompain = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (!userId) return res.status(400).json({ success: false, error: "userId is required" });

    const updated = await SmsCampaign.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ success: false, error: "Campaign not found" });

    res.json({ success: true, updated });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// ------------------ DELETE CAMPAIGN ------------------
exports.deleteCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (!userId) return res.status(400).json({ success: false, error: "userId is required" });

    const record = await SmsCampaign.findOneAndDelete({ _id: id, userId });
    if (!record) return res.status(404).json({ success: false, error: "Campaign not found" });

    res.json({ success: true, message: "Campaign deleted" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
