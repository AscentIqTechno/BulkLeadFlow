const db = require("../models");
const EmailDirectory = db.emailDirectory;
const User = db.user;

// Helper to check if user has admin role
const isAdminUser = (user) => {
  if (!user.roles) return false;
  return user.roles.some((role) => role.name === "admin");
};

// Logged-in user emails
exports.getMyEmailList = async (req, res) => {
  try {
    const emails = await EmailDirectory.find({ userId: req.userId }).select("email userId createdAt");
    res.status(200).json(emails);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your email list", error: err.message });
  }
};

// Admin: all emails
exports.getAllEmailList = async (req, res) => {
  try {
    // req.userId is set by verifyToken
    const user = await User.findById(req.userId).populate("roles"); // 🔹 populate roles

  const emails = await EmailDirectory.find().select("email userId createdAt");
    res.status(200).json(emails);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all emails", error: err.message });
  }
};

// Optional: Delete email
exports.deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const emailEntry = await EmailDirectory.findById(id);
    if (!emailEntry) return res.status(404).json({ message: "Email not found" });

    const user = await User.findById(req.userId).populate("roles"); // 🔹 populate roles

    // Only owner or admin can delete
    if (emailEntry.userId.toString() !== req.userId && !isAdminUser(user)) {
      return res.status(403).json({ message: "Not authorized to delete this email" });
    }

    await EmailDirectory.findByIdAndDelete(id);
    res.status(200).json({ message: "Email deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete email", error: err.message });
  }
};
