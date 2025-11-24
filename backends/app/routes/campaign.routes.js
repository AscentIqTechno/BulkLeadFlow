const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaign.controller");
const { verifyToken } = require("../middlewares/authJwt");
const planUsageMiddleware = require("../middlewares/planUsage.middleware");
const multer = require("multer");

// Memory storage for attachments
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create and send campaign → check plan usage
router.post(
  "/campaign",
  verifyToken,
  planUsageMiddleware,
  upload.array("attachments"),
  campaignController.createAndSendCampaign
);

// Get campaigns
router.get("/campaign", verifyToken, campaignController.getMyCampaigns);

// Delete campaign
router.delete("/campaign/:id", verifyToken, campaignController.deleteCampaign);

module.exports = router;
