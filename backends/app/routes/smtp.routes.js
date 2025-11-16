const express = require("express");
const router = express.Router();
const controller = require("../controllers/smtp.controller");
const { verifyToken } = require("../middlewares/authJwt");


  router.post("/smtp", verifyToken, controller.createSmtp);
  router.get("/smtp", verifyToken, controller.getMySmtps);
  router.put("/smtp/:id", verifyToken, controller.updateSmtp);
  router.delete("/smtp/:id", verifyToken, controller.deleteSmtp);

module.exports = router;