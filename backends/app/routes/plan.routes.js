const router = require("express").Router();
const controller = require("../controllers/plan.controller");
const { authJwt } = require("../middlewares");


// PUBLIC ROUTE
router.get("/plans", controller.getAllPlans);

// ADMIN ROUTES
router.post("/plans", authJwt.verifyToken, authJwt.isAdmin, controller.createPlan);
router.put("/plans/:id", authJwt.verifyToken, authJwt.isAdmin, controller.updatePlan);
router.delete("/plans/:id", authJwt.verifyToken, authJwt.isAdmin, controller.deletePlan);

module.exports = router;
