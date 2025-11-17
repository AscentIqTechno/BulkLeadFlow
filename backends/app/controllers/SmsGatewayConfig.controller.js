const db = require("../models");
const SmsGatewayConfig = db.SmsGatewayConfig;

// ➤ CREATE SMS GATEWAY CONFIG
exports.createSmsGateway = async (req, res) => {
  try {
    const smsConfig = new SmsGatewayConfig({
      userId: req.userId,
      username: req.body.username,
      contactNumber: req.body.contactNumber,
      ip: req.body.ip,
      port: req.body.port || "8080",
    });

    await smsConfig.save();
    return res.status(201).send({
      message: "SMS Gateway config saved successfully",
      smsConfig,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
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
