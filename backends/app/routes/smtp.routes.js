const express = require("express");
const router = express.Router();
const controller = require("../controllers/smtp.controller");
const { verifyToken } = require("../middlewares/authJwt");
const planUsageMiddleware = require("../middlewares/planUsage.middleware");

// CREATE SMTP → check plan limit
router.post("/smtp", verifyToken, planUsageMiddleware, controller.createSmtp);


// GET all SMTP configs → no plan usage decrement
router.get("/smtp", verifyToken, controller.getMySmtps);

// UPDATE SMTP → optional: check if updating counts as usage
router.put("/smtp/:id", verifyToken, controller.updateSmtp);

// DELETE SMTP → no plan usage decrement
router.delete("/smtp/:id", verifyToken, controller.deleteSmtp);

module.exports = router;
