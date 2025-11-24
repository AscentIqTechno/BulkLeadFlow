const controller = require("../controllers/plan.controller.js");
const router = require("express").Router();


router.get("/plans", controller.getAllPlans);
module.exports = router;