const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authJwt = require("../middlewares/authJwt");

// User dashboard → only token verification
router.get("/user", authJwt.verifyToken, dashboardController.getUserDashboard);

// Admin dashboard → token + admin check
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], dashboardController.getAdminDashboard);

module.exports = router;
