const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone:Number,

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],

    // Points to the user's active subscription
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },

    // Points to selected plan (optional)
    currentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null
    },

    // Razorpay Customer ID
    razorpayCustomerId: String,

    // Billing address
    billingAddress: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: "India" },
      zipCode: String,
      phone: String
    },

    // Password reset
    resetPasswordOtp: String,
    resetPasswordOtpExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    lastLogin: Date,

    // Account status
    isActive: { type: Boolean, default: true },

    // Profile completion
    profileCompleted: { type: Boolean, default: false }

  }, { timestamps: true })
);

module.exports = User;
