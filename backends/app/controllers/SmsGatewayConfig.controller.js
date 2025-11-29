const db = require("../models");
const SmsGatewayConfig = db.SmsGatewayConfig;

// ➤ TEST SMS GATEWAY CONNECTION (NO SAVE)
const axios = require("axios");

exports.testSmsGatewayConnection = async (req, res) => {
  try {
    const { ip, port = "8080" } = req.body;

    // ------------------------------
    // BASIC VALIDATION
    // ------------------------------
    if (!ip) {
      return res.status(400).json({
        success: false,
        message: "IP address is required.",
      });
    }

    const url = `http://${ip}:${port}/status`;

    console.log("Checking Gateway:", url);

    // ------------------------------
    // PING GATEWAY
    // ------------------------------
    try {
      const response = await axios.get(url, { timeout: 10000 });

      console.log("GATEWAY RESPONSE:", response.data);

      // If reachable but not 'online'
      if (!response.data || response.data.status !== "online") {
        return res.status(400).json({
          success: false,
          message: "Gateway reachable but not online.",
          instructions: [
            "1. Open SMS Gateway app on the device.",
            "2. Make sure the service is running.",
            "3. Restart the device or app if needed.",
          ],
          data: response.data,
        });
      }

      // SUCCESS
      return res.json({
        success: true,
        message: "Gateway is online and reachable.",
        data: response.data,
      });

    } catch (err) {
      console.error("TEST CONNECTION FAILED:", err.message);

      return res.status(400).json({
        success: false,
        message: "Cannot connect to SMS Gateway. Check IP, port, or app status.",
        instructions: [
          "1. Ensure device is connected to the same network.",
          "2. Check that the IP address is correct.",
          "3. Verify the port (default 8080) is open.",
          "4. Confirm the SMS Gateway app is running.",
        ],
      });
    }

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server Internal Error",
    });
  }
};



// ➤ CREATE SMS GATEWAY CONFIG
exports.createSmsGateway = async (req, res) => {
  try {
    const { subscription } = req;
    const { planLimits, planUsage } = subscription || {};

    // Check plan limit for Android Gateways
    if (subscription && planLimits && planUsage) {
      const gatewayLimit = planLimits.androidGateways;

      if (gatewayLimit !== -1 && planUsage.androidGatewaysUsed >= gatewayLimit) {
        return res.status(403).json({
          success: false,
          message: `Android Gateway limit reached — your plan allows only ${gatewayLimit} gateways`
        });
      }
    }

    // Create SMS Gateway config
    const smsConfig = new SmsGatewayConfig({
      userId: req.userId,
      username: req.body.username,
      contactNumber: req.body.contactNumber,
      ip: req.body.ip,
      port: req.body.port || "8080",
    });

    // Increment usage counter after passing the limit check
    if (subscription) {
      subscription.planUsage.androidGatewaysUsed =
        (subscription.planUsage.androidGatewaysUsed || 0) + 1;
      subscription.markModified("planUsage");
      await subscription.save();
    }

    await smsConfig.save();

    return res.status(201).json({
      success: true,
      message: "SMS Gateway config saved successfully",
      smsConfig
    });

  } catch (err) {
    console.error("SMS GATEWAY CREATE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ➤ READ (GET Logged-in User SMS Gateway Configs)
exports.getMySmsConfigs = async (req, res) => {
  try {
    const list = await SmsGatewayConfig.find({ userId: req.userId });
    return res.status(200).send(list);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// ➤ UPDATE SMS GATEWAY CONFIG
exports.updateSmsGateway = async (req, res) => {
  try {
    const updated = await SmsGatewayConfig.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).send({ message: "SMS Gateway config not found" });
    }

    return res.status(200).send({
      message: "Updated successfully",
      smsConfig: updated,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// ➤ DELETE SMS GATEWAY CONFIG
exports.deleteSmsGateway = async (req, res) => {
  try {
    const deleted = await SmsGatewayConfig.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).send({ message: "SMS Gateway config not found" });
    }

    return res.status(200).send({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
