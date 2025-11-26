const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: String,

    profileImage: {
      public_id: String,
      url: String
    },

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription"
    },

    currentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null
    },

    razorpayCustomerId: String,

    billingAddress: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: "India" },
      zipCode: String,
      phone: String
    },

    // 🔥 NEW FIELDS FOR SIGNUP OTP
    signupOtp: String,
    signupOtpExpires: Date,

    resetPasswordOtp: String,
    resetPasswordOtpExpires: Date,

    lastLogin: Date,
    isActive: { type: Boolean, default: false },   // 🔥 Default false (must verify OTP)
    profileCompleted: { type: Boolean, default: false }

  }, { timestamps: true })
);

module.exports = User;
