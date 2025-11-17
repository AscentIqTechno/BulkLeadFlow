const express = require("express");
const router = express.Router();
const controller = require("../controllers/numberDirectory.controller");
const { authJwt } = require("../middlewares");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// My numbers  
router.get("/my", [authJwt.verifyToken], controller.getMyNumbers);

// Admin all numbers  
router.get("/all", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllNumbers);

// Add single  
router.post("/add", [authJwt.verifyToken], controller.addNumber);

// Update  
router.put("/:id", [authJwt.verifyToken], controller.updateNumber);

// Delete  
router.delete("/:id", [authJwt.verifyToken], controller.deleteNumber);

// Bulk upload CSV  
router.post(
  "/bulk",
  [authJwt.verifyToken],
  upload.single("file"),
  controller.bulkImport
);

module.exports = router;
