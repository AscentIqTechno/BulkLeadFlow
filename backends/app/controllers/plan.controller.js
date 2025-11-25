const db = require("../models");
const Plan = db.plan;

// ➤ GET ALL PLANS (Public)
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });

    res.json({
      success: true,
      data: plans,
    });
  } catch (err) {
    console.error("❌ Error fetching plans:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load plans",
    });
  }
};

// ➤ CREATE NEW PLAN (Admin Only)
exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);

    res.json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (err) {
    console.error("❌ Error creating plan:", err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ➤ UPDATE PLAN
exports.updatePlan = async (req, res) => {
  try {
    const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ success: false, message: "Plan not found" });

    res.json({
      success: true,
      message: "Plan updated",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error updating plan:", err);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

// ➤ DELETE PLAN
exports.deletePlan = async (req, res) => {
  try {
    const deleted = await Plan.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Plan not found" });

    res.json({
      success: true,
      message: "Plan deleted",
    });
  } catch (err) {
    console.error("❌ Error deleting plan:", err);
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
