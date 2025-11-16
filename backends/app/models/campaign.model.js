const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CampaignSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    smtpId: {
      type: Schema.Types.ObjectId,
      ref: "SmtpConfig", // reference to SMTP configuration
      required: true,
    },
    recipients: {
      type: [String], // array of email addresses
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    attachments: [
      {
        filename: String,
        path: String, // file path or URL
        type: String, // photo/video/document
      },
    ],
    status: {
      type: String,
      enum: ["draft", "scheduled", "sent", "failed"],
      default: "draft",
    },
    scheduledAt: {
      type: Date, // optional: for scheduled campaigns
    },
  },
  { timestamps: true }
);

module.exports = model("Campaign", CampaignSchema);
