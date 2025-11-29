const db = require("../models");
const Campaign = db.campaign;
const SmtpConfig = db.smtp;
const nodemailer = require("nodemailer");
const extractNameFromEmail = require("../helpers/extractName.helper");
const EmailDirectory = db.emailDirectory;
const Subscription = db.subscription;
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
      } else {
        recipientList = recipients.split(",").map(r => r.trim()).filter(Boolean);
      }
    }

    if (!name || !subject || !smtpId || recipientList.length === 0 || !message) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // ========== SMTP Config ==========
    const smtpConfig = await SmtpConfig.findOne({ _id: smtpId, userId });
    if (!smtpConfig) {
      return res.status(400).json({ message: "SMTP configuration not found" });
    }

    // ==================================================
    //   🔥 STEP 1 — VERIFY SMTP LOGIN BEFORE SENDING
    // ==================================================
    const testTransporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
    });

    try {
      await testTransporter.verify(); // check username/password are correct
    } catch (smtpErr) {
      console.error("SMTP LOGIN FAILED:", smtpErr.message);
      return res.status(400).json({
        success: false,
        message: "SMTP Login failed. Please check username/password.",
        smtpError: smtpErr.message,
      });
    }

    // ========== Subscription Usage (unchanged) ==========
    const subscription = await Subscription.findOne({ user: userId, isActive: true });
    const planUsage = subscription?.planUsage;
    const planLimits = subscription?.planLimits;

    const remainingQuota =
      planLimits?.emailsPerMonth === -1
        ? recipientList.length
        : (planLimits?.emailsPerMonth || 0) - (planUsage?.emailsSent || 0);

    if (remainingQuota <= 0) {
      return res.status(403).json({
        success: false,
        message: "Email limit reached — cannot send any more emails this month",
      });
    }

    const emailsToSend = recipientList.slice(0, remainingQuota);

    const transporter = testTransporter; // verified transporter

    let sentCount = 0;
    let insertedDirIds = [];

    // ==================================================
    //   🔥 STEP 2 — SEND EMAILS (STOP ON FIRST FAILURE)
    // ==================================================
    for (const email of emailsToSend) {
      try {
        const extractedName = extractNameFromEmailJS(email);

        const dirItem = await EmailDirectory.findOneAndUpdate(
          { userId, email },
          { userId, email, name: extractedName },
          { upsert: true, new: true }
        );

        insertedDirIds.push(dirItem._id);

        await transporter.sendMail({
          from: smtpConfig.fromEmail,
          to: email,
          subject,
          text: message,
          attachments: attachments.map(f => ({
            filename: f.originalname,
            content: f.buffer,
          })),
        });

        sentCount++;
      } catch (err) {
        console.error(`FAILED EMAIL ${email}:`, err.message);

        // Cleanup (Rollback Directory Insert)
        await EmailDirectory.deleteMany({ _id: { $in: insertedDirIds } });

        return res.status(400).json({
          success: false,
          message: "Email sending failed",
          failedEmail: email,
          error: err.message,
        });
      }
    }

    // ==================================================
    //   🔥 STEP 3 — SAVE CAMPAIGN ONLY IF ALL EMAILS SENT
    // ==================================================
    if (sentCount !== emailsToSend.length) {
      return res.status(400).json({
        success: false,
        message: "Some emails failed — campaign not created",
      });
    }

    const campaign = new Campaign({
      userId,
      name,
      subject,
      smtpId,
      recipients: recipientList,
      message,
      status: "sent",
    });

    const savedCampaign = await campaign.save();

    // ========== Subscription Update (unchanged) ==========
    if (subscription && planUsage) {
      planUsage.emailsSent = (planUsage.emailsSent || 0) + sentCount;
      subscription.markModified("planUsage");
      await subscription.save();
    }

    return res.status(201).json({
      success: true,
      message: "Campaign sent successfully",
      sentCount,
      campaign: savedCampaign,
    });

  } catch (err) {
    console.error("SEND CAMPAIGN ERROR:", err);
    res.status(500).json({
      message: "Error sending campaign",
      error: err.message,
    });
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
