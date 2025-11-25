const mongoose = require("mongoose");

const RazorpayConfigSchema = new mongoose.Schema(
  {
    keyId: {
      type: String,
      required: true,
      unique: true,
    },

    keySecret: {
      type: String,
      required: true,
      select: false, // Do NOT return secret in API responses
    },

    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },

    label: {
      type: String,
      default: "Default Razorpay Account",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RazorpayConfig", RazorpayConfigSchema);
