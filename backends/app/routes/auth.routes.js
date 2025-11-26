const express = require("express");
const router = express.Router();

const { verifySignUp } = require("../middlewares");

const { 
  sendSignupOtp, 
  signin, 
  forgotPassword, 
  verifyOtp, 
  resetPassword, 
  resendOtp, 
  changePassword,
  
  // 👇 NEW CONTROLLERS ADDED
  verifySignupAndSave,
  resendSignupOtp

} = require("../controllers/auth.controller");


// SIGNUP (User will receive OTP email)
router.post(
  "/signup",
  sendSignupOtp
);

// SIGNUP OTP VERIFY (NEW)
router.post("/verify-signup-otp", verifySignupAndSave);

// RESEND SIGNUP OTP (NEW)
// router.post("/resend-signup-otp", resendSignupOtp);


// SIGNIN
router.post("/signin", signin);

// LOGOUT
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ success: true, message: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});


// PASSWORD RESET ROUTES
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);
// RESEND SIGNUP OTP (NEW)
router.post("/resend-signup-otp", resendSignupOtp);


// CHANGE PASSWORD (Optional Protected Route)
// router.post("/change-password", changePassword);


module.exports = router;
