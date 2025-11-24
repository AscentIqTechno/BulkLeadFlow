const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/authJwt");

// Public routes
router.get("/plans", paymentController.getPlans);

// Protected routes
router.post("/create-order", verifyToken, paymentController.createOrder);
router.post("/verify-payment", verifyToken, paymentController.verifyPayment);
router.get("/subscription", verifyToken, paymentController.getSubscription);
router.get("/history", verifyToken, paymentController.getPaymentHistory);
router.get("/payment/:paymentId", verifyToken, paymentController.getPaymentDetails);
router.post("/refund", verifyToken, paymentController.refundPayment);

module.exports = router;