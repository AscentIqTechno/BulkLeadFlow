const express = require("express");
const router = express.Router();

const controller = require("../controllers/sms_campaign.controller");
const authJwt = require("../middlewares/authJwt");
const planUsageMiddleware = require("../middlewares/planUsage.middleware");

// BULK SMS SEND → check plan usage
router.post("/", authJwt.verifyToken, planUsageMiddleware, controller.sendBulkSms);

// GET ALL CAMPAIGNS
router.get("/", authJwt.verifyToken, controller.getSMScompain);

// GET SINGLE CAMPAIGN BY ID
router.get("/:id", authJwt.verifyToken, controller.getCampaignById);

// UPDATE CAMPAIGN
router.put("/:id", authJwt.verifyToken, controller.updateSMScompain);

// DELETE CAMPAIGN
router.delete("/:id", authJwt.verifyToken, controller.deleteCampaign);

module.exports = router;
