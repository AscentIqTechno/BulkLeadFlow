const express = require("express");
const router = express.Router();
const controller = require("../controllers/emailDirectory.controller");
const { authJwt } = require("../middlewares");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Logged-in user's own email list
router.get("/my", [authJwt.verifyToken], controller.getMyEmailList);

// Admin only: all email lists
router.get("/all", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllEmailList);

// Add single email
router.post("/add", [authJwt.verifyToken], controller.addEmail);

// Update email
router.put("/:id", [authJwt.verifyToken], controller.updateEmail);

// Delete email (Admin only)
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteEmail);

// Bulk upload CSV/Excel
router.post(
  "/bulk",
  [authJwt.verifyToken],
  upload.single("file"),
  controller.bulkImportEmail
);

module.exports = router;
