const db = require("../models");
const SmtpConfig = db.smtp;

// ➤ CREATE SMTP
exports.createSmtp = async (req, res) => {
  try {
    const { subscription } = req;
    const { planLimits, planUsage } = subscription || {};

    // Check plan limit before creating
    if (subscription && planLimits && planUsage) {
      const smtpLimit = planLimits.smtpConfigs;

      // Unlimited plan = -1
      if (smtpLimit !== -1 && planUsage.smtpConfigsUsed >= smtpLimit) {
        return res.status(403).json({
          success: false,
          message: `SMTP Config limit reached — your plan allows only ${smtpLimit} configs`
        });
      }
    }

    // Create SMTP config
    const smtp = new SmtpConfig({
      userId: req.userId,
      host: req.body.host,
      port: req.body.port,
      username: req.body.username,
      password: req.body.password,
      fromEmail: req.body.fromEmail,
      secure: req.body.secure || false
    });

    // Increment counter AFTER passing the limit check
    if (subscription) {
      subscription.planUsage.smtpConfigsUsed =
        (subscription.planUsage.smtpConfigsUsed || 0) + 1;
      subscription.markModified("planUsage");
      await subscription.save();
    }

    await smtp.save();

    return res.status(201).json({
      success: true,
      message: "SMTP saved successfully",
      smtp
    });

  } catch (err) {
    console.error("SMTP CREATE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ➤ UPDATE SMTP (GUARANTEED WORKING)
exports.updateSmtp = async (req, res) => {
  try {
    const smtp = await SmtpConfig.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!smtp) {
      return res.status(404).send({ message: "SMTP not found" });
    }

    // Allowed updatable fields
    const fields = ["host", "port", "username", "password", "fromEmail", "secure"];

    fields.forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        smtp[key] = req.body[key];
      }
    });

    // Save document (always applies update)
    await smtp.save();

    return res.status(200).send({
      message: "SMTP updated successfully",
      smtp
    });
  } catch (err) {
    console.error("SMTP UPDATE ERROR:", err);
    res.status(500).send({ message: err.message });
  }
};

// ➤ READ (GET Logged-in User SMTP List)
exports.getMySmtps = async (req, res) => {
  try {
    const list = await SmtpConfig.find({ userId: req.userId });
    res.status(200).send(list);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ➤ UPDATE SMTP
// ➤ UPDATE SMTP
exports.updateSmtp = async (req, res) => {
  try {
    const smtp = await SmtpConfig.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!smtp) {
      return res.status(404).send({ message: "SMTP not found" });
    }

    // Allowed Fields
    const allowedFields = [
      "host",
      "port",
      "username",
      "password",
      "fromEmail",
      "secure"
    ];

    // Update only allowed fields & ignore empty fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        smtp[field] = req.body[field];
      }
    });

    // If password is empty → DO NOT overwrite existing password
    if (!req.body.password) {
      delete smtp.password; // prevents replacing with empty value
    }

    await smtp.save();

    res.status(200).send({
      message: "SMTP updated successfully",
      smtp
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


// ➤ DELETE SMTP
exports.deleteSmtp = async (req, res) => {
  try {
    const deleted = await SmtpConfig.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).send({ message: "SMTP not found" });
    }

    res.status(200).send({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
