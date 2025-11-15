const express = require("express");
const router = express.Router();

const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

// SIGNUP
router.post(
  "/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
  ],
  controller.signup
);

// SIGNIN
router.post("/signin", controller.signin);

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ success: true, message: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});

module.exports = router;
