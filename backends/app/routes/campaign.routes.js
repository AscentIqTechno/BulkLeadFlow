const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaign.controller");
const { verifyToken } = require("../middlewares/authJwt");
const multer = require("multer");

// Memory storage for attachments
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/campaign",
  verifyToken,
  upload.array("attachments"),
  campaignController.createAndSendCampaign
);

router.get("/campaign", verifyToken, campaignController.getMyCampaigns);

router.delete("/campaign/:id", verifyToken, campaignController.deleteCampaign);

module.exports = router;
