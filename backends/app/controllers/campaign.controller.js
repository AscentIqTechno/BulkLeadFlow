const db = require("../models");
const Campaign = db.campaign;
const SmtpConfig = db.smtp;
const nodemailer = require("nodemailer");
const extractNameFromEmail = require("../helpers/extractName.helper");
const EmailDirectory = db.emailDirectory;
/**
 * Send campaign emails and save the campaign
 */

function extractNameFromEmailJS(email) {
  if (!email) return "";

  // take part before @
  let name = email.split("@")[0];

  // remove numbers, dots, underscores, hyphens
  name = name.replace(/[0-9._-]/g, " ").trim();

  // take first word only
  name = name.split(" ")[0];

  // capitalize properly
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}



exports.createAndSendCampaign = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, subject, smtpId, recipients, message } = req.body;
    const attachments = req.files || [];

    let recipientList = [];
    if (recipients) {
      if (Array.isArray(recipients)) {
        recipientList = recipients;
      } else if (typeof recipients === "string") {
        recipientList = recipients.split(",").map((r) => r.trim()).filter(Boolean);
      }
    }

    if (!name || !subject || !smtpId || recipientList.length === 0 || !message) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // SMTP config
    const smtpConfig = await SmtpConfig.findOne({ _id: smtpId, userId });
    if (!smtpConfig) return res.status(400).json({ message: "SMTP configuration not found" });

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: { user: smtpConfig.username, pass: smtpConfig.password }
    });

    let sentCount = 0;
    const total = recipientList.length;

    for (const email of recipientList) {
      try {
        // 👉 JS-ONLY name extraction
        const extractedName = extractNameFromEmailJS(email);

        // 👉 Save extracted name in directory (but not used in message)
        await EmailDirectory.findOneAndUpdate(
          { userId, email },
          { name: extractedName, email, userId },
          { upsert: true }
        );

        // 👉 Send same message to everyone
        await transporter.sendMail({
          from: smtpConfig.fromEmail,
          to: email,
          subject,
          text: message,
          attachments: attachments.map((f) => ({
            filename: f.originalname,
            content: f.buffer
          }))
        });

        sentCount++;
        console.log(`Sent ${sentCount}/${total}`);

      } catch (err) {
        console.error(`Failed email ${email}:`, err.message);
      }
    }

    // Save campaign
    const campaign = new Campaign({
      userId,
      name,
      subject,
      smtpId,
      recipients: recipientList,
      message,
      status: "sent"
    });

    const savedCampaign = await campaign.save();

    res.status(201).json({
      message: "Campaign sent and saved successfully",
      campaign: savedCampaign,
      totalRecipients: total,
      sentCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending campaign", error: err.message });
  }
};

/**
 * Fetch campaigns for logged-in user
 */
exports.getMyCampaigns = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId,"working")
    const campaigns = await Campaign.find({ userId })
      .populate("smtpId", "host port username fromEmail secure")
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching campaigns", error: err.message });
  }
};

/**
 * Delete campaign
 */
exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const campaign = await Campaign.findOne({ _id: id, userId });
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    await Campaign.findByIdAndDelete(id);
    res.json({ message: "Campaign deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting campaign", error: err.message });
  }
};
