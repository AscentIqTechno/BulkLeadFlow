const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaign.controller");
const { verifyToken } = require("../middlewares/authJwt");
const multer = require("multer");

// Set memory storage for attachments
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create & send campaign with attachments
router.post("/", verifyToken, upload.array("attachments"), campaignController.createAndSendCampaign);

router.get("/", verifyToken, campaignController.getMyCampaigns);
router.delete("/:id", verifyToken, campaignController.deleteCampaign);

module.exports = router;
