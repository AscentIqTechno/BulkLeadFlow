const express = require("express");
const router = express.Router();

const { authJwt } = require("../middlewares");
const profileController = require("../controllers/profile.controller");
const upload = require("../middlewares/upload");

// Profile routes
router.get("/profile", [authJwt.verifyToken], profileController.getUserProfile);
router.put("/profile", [authJwt.verifyToken], profileController.updateProfile);
router.post("/profile/upload-image", [authJwt.verifyToken, upload.single("image")], profileController.uploadProfileImage);
router.put("/profile/change-password", [authJwt.verifyToken], profileController.changePassword);
router.get("/profile/subscription", [authJwt.verifyToken], profileController.getSubscriptionDetails);
router.put("/profile/billing-address", [authJwt.verifyToken], profileController.updateBillingAddress);

module.exports = router;