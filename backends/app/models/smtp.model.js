const mongoose = require("mongoose");

const SmtpConfig = mongoose.model(
  "SmtpConfig",
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      host: { type: String, required: true },
      port: { type: Number, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      fromEmail: { type: String, required: true },
      secure: { type: Boolean, default: false } // TLS / SSL
    },
    { timestamps: true }
  )
);

module.exports = SmtpConfig;
