const db = require("../models");
const Plan = db.plan;

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });

    res.json({
      success: true,
      data: plans
    });
  } catch (err) {
    console.error("❌ Error fetching plans:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load plans"
    });
  }
};
