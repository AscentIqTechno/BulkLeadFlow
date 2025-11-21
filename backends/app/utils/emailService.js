// utils/emailService.js - Simple version
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate OTP email template
const generateOtpTemplate = (userName, otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1>LeadReachXpro</h1>
        <p>Password Reset Request</p>
      </div>
      <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e1e1e1;">
        <h2>Hello ${userName},</h2>
        <p style="color: #666; line-height: 1.6;">You requested to reset your password. Use the OTP below to verify your identity:</p>
        <div style="font-size: 32px; font-weight: bold; text-align: center; color: #f59e0b; margin: 20px 0; letter-spacing: 5px;">${otp}</div>
        <p style="color: #666; line-height: 1.6;">This OTP will expire in 10 minutes.</p>
        <p style="color: #666; line-height: 1.6;">If you didn't request this, please ignore this email.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
        <p>&copy; 2024 LeadReachXpro. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Send OTP email
const sendOtpEmail = async (email, otp, userName = 'User') => {
  // Development mode - log OTP to console
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('📧 [DEV MODE] Email details:');
    console.log('   To:', email);
    console.log('   OTP:', otp);
    console.log('   User:', userName);
    return true;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset OTP - LeadReachXpro',
    html: generateOtpTemplate(userName, otp),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    return false;
  }
};

// Verify SMTP connection
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection is ready');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return false;
  }
};

module.exports = {
  sendOtpEmail,
  verifyEmailConnection
};