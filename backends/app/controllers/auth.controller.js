const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Otp = db.otp; // Use the Otp model from db object
const { sendOtpEmail } = require("../utils/emailService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate random 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// SIGNUP
// SIGNUP WITH EMAIL OTP VERIFICATION
// STEP 1: SEND SIGNUP OTP
exports.sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ success: false, message: "Email is required" });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ success: false, message: "User already exists" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Save OTP in Otp collection
    await Otp.create({
      email,
      otp,
      type: "signup",
      expiresAt,
      used: false
    });

    await sendOtpEmail(email, otp, email); // Can customize name later

    res.status(200).send({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send signup OTP error:", err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// STEP 2: VERIFY OTP & SAVE USER DETAILS
exports.verifySignupAndSave = async (req, res) => {
  try {
    const { email, otp, username, password, phone, roles } = req.body;

    if (!email || !otp || !username || !password) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    // Check OTP
    const otpRecord = await Otp.findOne({
      email,
      otp,
      type: "signup",
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).send({ success: false, message: "Invalid or expired OTP" });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Check again if user exists (race condition)
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ success: false, message: "User already exists" });

    // Create user
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      isActive: true
    });

    // Assign roles
    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      user.roles = foundRoles.map((r) => r._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      user.roles = [defaultRole._id];
    }

    await user.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully!",
      userId: user._id,
      email: user.email
    });

  } catch (err) {
    console.error("Verify signup and save error:", err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};


// RESEND SIGNUP OTP FOR SIGNUP FLOW
exports.resendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("🔄 Resending signup OTP for:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user already exists (only allow OTP for new users)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Save OTP in DB
    await Otp.create({
      email,
      otp,
      type: "signup",
      expiresAt,
      used: false,
    });

    await sendOtpEmail(email, otp, email);

    console.log("✅ Signup OTP resent:", otp);

    res.status(200).json({
      success: true,
      message: "Signup OTP resent successfully!",
    });

  } catch (err) {
    console.error("🔥 Resend signup OTP error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// SIGNIN
exports.signin = async (req, res) => {
  try {
    const email = req.body.email || req.body.username;
    const password = req.body.password;

    console.log("Login body:", req.body);
    console.log("Extracted email:", email);

    if (!email || !password) {
      return res.status(400).send({ 
        success: false,
        message: "Email and password are required!" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ 
        success: false,
        message: "User not found!" 
      });
    }

    // Check password
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        success: false,
        accessToken: null,
        message: "Invalid password!",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      config.secret,
      { expiresIn: 86400 } // 24 hours
    );

    const authorities = user.roles.map((role) => role.name);

    // Response
    res.status(200).send({
      success: true,
      id: user._id,
      username: user.username,
      email: user.email,
      phone:user.phone,
      roles: authorities,
      photo:user.profileImage,
      accessToken: token,
    });

  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).send({ 
      success: false,
      message: err.message || "Signin failed" 
    });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("📧 Forgot password request for:", email);

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({
        success: false,
        message: "User with this email not found"
      });
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log("🔐 Generated OTP for", email, ":", otp);

    // Save OTP to database (using the correct Otp model)
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      type: 'password_reset',
      expiresAt
    });

    // Also save to user model for backup
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = expiresAt;
    await user.save();

    // Send OTP via email
    const emailSent = await sendOtpEmail(email, otp, user.username);

    if (!emailSent) {
      console.log("❌ Failed to send email to:", email);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again."
      });
    }

    console.log("✅ OTP sent successfully to:", email);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
      email: email
    });

  } catch (error) {
    console.error("🔥 Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("🔍 Verifying OTP for:", email, "OTP:", otp);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    // Find valid OTP (using the correct Otp model)
    const validOtp = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
      type: 'password_reset',
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!validOtp) {
      // Also check user model as backup
      const user = await User.findOne({
        email: email.toLowerCase(),
        resetPasswordOtp: otp,
        resetPasswordOtpExpires: { $gt: new Date() }
      });

      if (!user) {
        console.log("❌ Invalid OTP for:", email);
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP"
        });
      }
    }

    // Mark OTP as used
    if (validOtp) {
      validOtp.used = true;
      await validOtp.save();
    }

    // Clear OTP from user model
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { 
        $unset: { 
          resetPasswordOtp: 1, 
          resetPasswordOtpExpires: 1 
        } 
      }
    );

    console.log("✅ OTP verified successfully for:", email);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error("🔥 Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    console.log("🔄 Password reset request for:", email);

    // Validate input
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as old password"
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    
    // Clear any reset tokens/OTPs
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    console.log("✅ Password reset successfully for:", email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("🔥 Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("🔄 Resend OTP request for:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log("🔐 New OTP for", email, ":", otp);

    // Save new OTP
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      type: 'password_reset',
      expiresAt
    });

    // Update user model
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = expiresAt;
    await user.save();

    // Send new OTP via email
    const emailSent = await sendOtpEmail(email, otp, user.username);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email"
      });
    }

    console.log("✅ New OTP sent successfully to:", email);

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully"
    });

  } catch (error) {
    console.error("🔥 Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};