const express = require("express");
const router = express.Router();
const controller = require("../controllers/SmsGatewayConfig.controller");
const { verifyToken } = require("../middlewares/authJwt");

// ➤ CREATE SMS Gateway config
router.post("/sms_gateway_config", verifyToken, controller.createSmsGateway);

// ➤ GET all SMS Gateway configs for logged-in user
router.get("/sms_gateway_config", verifyToken, controller.getMySmsConfigs);

// ➤ UPDATE SMS Gateway config
router.put("/sms_gateway_config/:id", verifyToken, controller.updateSmsGateway);

// ➤ DELETE SMS Gateway config
router.delete("/sms_gateway_config/:id", verifyToken, controller.deleteSmsGateway);

module.exports = router;
