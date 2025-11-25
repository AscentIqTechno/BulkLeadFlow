const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone: String,
    
    // Add profile image field
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

    resetPasswordOtp: String,
    resetPasswordOtpExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    lastLogin: Date,
    isActive: { type: Boolean, default: true },
    profileCompleted: { type: Boolean, default: false }

  }, { timestamps: true })
);

module.exports = User;