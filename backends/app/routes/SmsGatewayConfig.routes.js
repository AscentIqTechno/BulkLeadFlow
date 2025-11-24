const express = require("express");
const router = express.Router();
const controller = require("../controllers/SmsGatewayConfig.controller");
const { verifyToken } = require("../middlewares/authJwt");
const planUsageMiddleware = require("../middlewares/planUsage.middleware");

// ➤ CREATE SMS Gateway config → consumes plan limit
router.post(
  "/sms_gateway_config",
  verifyToken,
  planUsageMiddleware,
  controller.createSmsGateway
);

// ➤ GET all SMS Gateway configs for logged-in user → no limit decrement
router.get("/sms_gateway_config", verifyToken, controller.getMySmsConfigs);

// ➤ UPDATE SMS Gateway config → optional: check if updating counts as usage
router.put("/sms_gateway_config/:id", verifyToken, controller.updateSmsGateway);

// ➤ DELETE SMS Gateway config → no limit decrement
router.delete("/sms_gateway_config/:id", verifyToken, controller.deleteSmsGateway);

module.exports = router;
