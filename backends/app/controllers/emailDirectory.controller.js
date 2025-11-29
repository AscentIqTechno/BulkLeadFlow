const db = require("../models");
const EmailDirectory = db.emailDirectory;
const User = db.user;
const csv = require("csvtojson");

// Helper: check admin
const isAdminUser = (user) => {
  if (!user.roles) return false;
  return user.roles.some((role) => role.name === "admin");
};

// ==========================================
// GET MY EMAILS
// ==========================================
exports.getMyEmailList = async (req, res) => {
  try {
    const emails = await EmailDirectory.find({ userId: req.userId })
      .select("email name isConfidential createdAt");

    res.status(200).json(emails);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch emails", error: err.message });
  }
};

// ==========================================
// GET ALL EMAILS (ADMIN)
// ==========================================
exports.getAllEmailList = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("roles");

    if (!isAdminUser(user)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const emails = await EmailDirectory.find()
      .select("email name isConfidential userId createdAt");

    res.status(200).json(emails);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch emails", error: err.message });
  }
};

// ==========================================
// ADD SINGLE EMAIL
// ==========================================
exports.addEmail = async (req, res) => {
  try {
    const { email, name, isConfidential } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already exists for this user
    const existing = await EmailDirectory.findOne({ userId: req.userId, email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const entry = await EmailDirectory.create({
      userId: req.userId,
      email,
      name: name || "",
      isConfidential: isConfidential || false,
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to add email", error: err.message });
  }
};

// ==========================================
// UPDATE EMAIL
// ==========================================
exports.updateEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, isConfidential } = req.body;

    const entry = await EmailDirectory.findById(id);
    if (!entry) return res.status(404).json({ message: "Email not found" });

    const user = await User.findById(req.userId).populate("roles");

    if (entry.userId.toString() !== req.userId && !isAdminUser(user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    entry.email = email ?? entry.email;
    entry.name = name ?? entry.name;
    entry.isConfidential = isConfidential ?? entry.isConfidential;

    await entry.save();

    res.status(200).json({ message: "Email updated", entry });
  } catch (err) {
    res.status(500).json({ message: "Failed to update email", error: err.message });
  }
};

// ==========================================
// DELETE EMAIL
// ==========================================
exports.deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await EmailDirectory.findById(id);
    if (!entry) return res.status(404).json({ message: "Email not found" });

    const user = await User.findById(req.userId).populate("roles");

    if (entry.userId.toString() !== req.userId && !isAdminUser(user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await EmailDirectory.findByIdAndDelete(id);

    res.status(200).json({ message: "Email deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete email", error: err.message });
  }
};

// ==========================================
// BULK IMPORT EMAILS (CSV/Excel)
// Columns: email,name,isConfidential
// ==========================================
exports.bulkImportEmail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file missing" });
    }

    const jsonArray = await csv().fromFile(req.file.path);

    if (!jsonArray.length) {
      return res.status(400).json({ message: "CSV file is empty" });
    }

    // -------------------------------
    // ✅ CHECK REQUIRED CSV COLUMNS
    // -------------------------------
    const sample = jsonArray[0];

    const emailColumn =
      sample.email ||
      sample.Email ||
      sample.EmailAddress;

    if (!emailColumn) {
      return res.status(400).json({
        message:
          "Invalid CSV format. Required 'email' column missing. Allowed: email, Email, EmailAddress",
      });
    }

    // -------------------------------
    // Normalize
    // -------------------------------
    const normalizedArray = jsonArray.map((item) => ({
      userId: req.userId,
      email: item.email || item.Email || item.EmailAddress || null,
      name: item.name || item.Name || "",
      isConfidential:
        item.isConfidential === "true" ||
        item.isConfidential === true ||
        false,
    }));

    // Remove rows without email
    const validEntries = normalizedArray.filter((item) => item.email);

    if (!validEntries.length) {
      return res.status(400).json({
        message:
          "Incorrect CSV format. No valid email entries found. Check your CSV.",
      });
    }

    // -------------------------------
    // Find duplicates
    // -------------------------------
    const existingEmails = await EmailDirectory.find(
      {
        userId: req.userId,
        email: { $in: validEntries.map((i) => i.email) },
      },
      { email: 1, _id: 0 }
    ).lean();

    const existingSet = new Set(existingEmails.map((i) => i.email));

    // Only keep new
    const newEntries = validEntries.filter(
      (item) => !existingSet.has(item.email)
    );

    if (!newEntries.length) {
      return res.status(200).json({
        message: "No new emails to import",
      });
    }

    const result = await EmailDirectory.insertMany(newEntries);

    // -------------------------------
    // SUCCESS ✔️
    // -------------------------------
    res.status(200).json({
      message: "Email import successful",
      count: result.length,
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to import emails",
      error: err.message,
    });
  }
};
