const mongoose = require("mongoose");

const SmsCampaignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    smsTitle: {
      type: String,
      required: true,
      trim: true,
    },

    gatewayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SmsGatewayConfig",
      required: true,
    },

    selectedNumbers: [
      {
        type: String, // store phone numbers as strings
        required: true,
      },
    ],

    message: {
      type: String,
      required: true,
      trim: true,
    },

    totalContacts: {
      type: Number,
      default: 0,
    },

    sentCount: {
      type: Number,
      default: 0,
    },

    failedCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "sent", "failed", "partial"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SmsCampaign", SmsCampaignSchema);
