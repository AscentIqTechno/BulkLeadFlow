const express = require("express");
const router = express.Router();

const { verifySignUp } = require("../middlewares");
const { signup, signin, forgotPassword, verifyOtp, resetPassword, resendOtp, changePassword } = require("../controllers/auth.controller");

// SIGNUP
router.post(
  "/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
  ],
  signup
);

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

// CHANGE PASSWORD (Protected - requires authentication)
// router.post("/change-password", authJwt.verifyToken, changePassword);

module.exports = router;