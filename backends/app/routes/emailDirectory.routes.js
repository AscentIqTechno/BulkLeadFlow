const express = require("express");
const router = express.Router();
const controller = require("../controllers/emailDirectory.controller");
const { authJwt } = require("../middlewares");

// Logged-in user's own email list
router.get(
  "/my",
  [authJwt.verifyToken],
  controller.getMyEmailList
);

// Admin only: all email lists
router.get(
  "/all",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getAllEmailList
);

// Delete an email (Admin only)
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.deleteEmail
);

module.exports = router;
