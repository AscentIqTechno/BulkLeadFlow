const db = require("../models");
const SmtpConfig = db.smtp;

// ➤ CREATE SMTP
exports.createSmtp = async (req, res) => {
  try {
    const smtp = new SmtpConfig({
      userId: req.userId,
      host: req.body.host,
      port: req.body.port,
      username: req.body.username,
      password: req.body.password,
      fromEmail: req.body.fromEmail,
      secure: req.body.secure || false
    });

    await smtp.save();
    return res.status(201).send({ message: "SMTP saved successfully", smtp });
  } catch (err) {
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
exports.updateSmtp = async (req, res) => {
  try {
    const updated = await SmtpConfig.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).send({ message: "SMTP not found" });
    }

    res.status(200).send({ message: "Updated successfully", smtp: updated });
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
