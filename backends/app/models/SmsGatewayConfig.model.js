const mongoose = require("mongoose");

const SmsGatewayConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    ip: {
      type: String,
      required: true,
      trim: true,
    },

    port: {
      type: Number,
      default: 8080,
    },

    secure: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["connected", "disconnected"],
      default: "disconnected",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SmsGatewayConfig", SmsGatewayConfigSchema);
