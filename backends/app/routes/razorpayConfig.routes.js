const express = require("express");
const router = express.Router();

const controller = require("../controllers/razorpayConfig.controller");
const { authJwt } = require("../middlewares");

// ---------------------------
// CREATE Razorpay Config
// ---------------------------
router.post(
  "/config",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.createRazorpayConfig
);

// ---------------------------
// GET ALL Razorpay Configs
// ---------------------------
router.get(
  "/config",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getAllRazorpayConfigs
);

// ---------------------------
// GET Razorpay Config by ID
// ---------------------------
router.get(
  "/config/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getRazorpayConfigById
);

// ---------------------------
// UPDATE Razorpay Config
// ---------------------------
router.put(
  "/config/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.updateRazorpayConfig
);

// ---------------------------
// DELETE Razorpay Config
// ---------------------------
router.delete(
  "/config/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.deleteRazorpayConfig
);

// ---------------------------
// GET ACTIVE Razorpay Config (Internal - with keySecret)
// ---------------------------
router.get(
  "/config-active",
  [authJwt.verifyToken],
  controller.getActiveConfig
);

// ---------------------------
// GET ACTIVE Razorpay Public Config (Frontend - without keySecret)
// ---------------------------
router.get(
  "/config-active-public",
  [authJwt.verifyToken],
  controller.getActivePublicConfig
);

// ---------------------------
// TEST Razorpay Configuration
// ---------------------------
router.post(
  "/config/:id/test",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.testRazorpayConfig
);

// ---------------------------
// SET ACTIVE Razorpay Configuration
// ---------------------------
router.post(
  "/config/:id/activate",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.setActiveConfig
);

module.exports = router;