const db = require("../models");
const NumberDirectory = db.numberDirectory;
const User = db.user;
const csv = require("csvtojson");

// Helper: check admin
const isAdminUser = (user) => {
  if (!user.roles) return false;
  return user.roles.some((role) => role.name === "admin");
};

// ==========================================
// GET MY NUMBERS
// ==========================================
exports.getMyNumbers = async (req, res) => {
  try {
    const numbers = await NumberDirectory.find({ userId: req.userId })
      .select("number name isConfidential createdAt");

    res.status(200).json(numbers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch numbers", error: err.message });
  }
};

// ==========================================
// GET ALL NUMBERS (ADMIN)
// ==========================================
exports.getAllNumbers = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("roles");

    if (!isAdminUser(user)) {
      return res.status(403).json({ message: "Admin only" });
    }

    const numbers = await NumberDirectory.find()
      .select("number name isConfidential userId createdAt");

    res.status(200).json(numbers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch numbers", error: err.message });
  }
};

// ==========================================
// ADD SINGLE NUMBER
// ==========================================
exports.addNumber = async (req, res) => {
  try {
    const { number, name, isConfidential } = req.body;

    if (!number) {
      return res.status(400).json({ message: "Number is required" });
    }

    // Check if the number already exists for this user
    const existing = await NumberDirectory.findOne({ userId: req.userId, number });
    if (existing) {
      return res.status(400).json({ message: "Number already exists" });
    }

    // Create new entry
    const entry = await NumberDirectory.create({
      userId: req.userId,
      number,
      name: name || "",
      isConfidential: isConfidential || false,
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to add number", error: err.message });
  }
};

// ==========================================
// UPDATE NUMBER
// ==========================================
exports.updateNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, name, isConfidential } = req.body;

    const entry = await NumberDirectory.findById(id);
    if (!entry) return res.status(404).json({ message: "Number not found" });

    const user = await User.findById(req.userId).populate("roles");

    if (entry.userId.toString() !== req.userId && !isAdminUser(user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    entry.number = number ?? entry.number;
    entry.name = name ?? entry.name;
    entry.isConfidential = isConfidential ?? entry.isConfidential;

    await entry.save();

    res.status(200).json({ message: "Number updated", entry });

  } catch (err) {
    res.status(500).json({ message: "Failed to update number", error: err.message });
  }
};

// ==========================================
// DELETE NUMBER
// ==========================================
exports.deleteNumber = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await NumberDirectory.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Number not found" });
    }

    const user = await User.findById(req.userId).populate("roles");

    if (entry.userId.toString() !== req.userId && !isAdminUser(user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await NumberDirectory.findByIdAndDelete(id);

    res.status(200).json({ message: "Number deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete number", error: err.message });
  }
};

// ==========================================
// BULK IMPORT CSV
// Columns: number,name,isConfidential
// ==========================================
exports.bulkImport = async (req, res) => {
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

    const numberColumn =
      sample.number ||
      sample.Number ||
      sample.Contact;

    if (!numberColumn) {
      return res.status(400).json({
        message:
          "Invalid CSV format. Required 'number' column missing. Allowed: number, Number, Contact",
      });
    }

    // -------------------------------
    // Normalize CSV fields
    // -------------------------------
    const normalizedArray = jsonArray.map((item) => ({
      userId: req.userId,
      number: item.number || item.Number || item.Contact || null,
      name: item.name || item.Name || "",
      isConfidential:
        item.isConfidential === "true" ||
        item.isConfidential === true ||
        false,
    }));

    // Remove rows without valid number
    const validEntries = normalizedArray.filter((item) => item.number);

    if (!validEntries.length) {
      return res.status(400).json({
        message:
          "Incorrect CSV format. No valid number entries found. Check your CSV.",
      });
    }

    // -------------------------------
    // Find duplicates
    // -------------------------------
    const existingNumbers = await NumberDirectory.find(
      {
        userId: req.userId,
        number: { $in: validEntries.map((i) => i.number) },
      },
      { number: 1, _id: 0 }
    ).lean();

    const existingSet = new Set(existingNumbers.map((i) => i.number));

    const newEntries = validEntries.filter(
      (item) => !existingSet.has(item.number)
    );

    if (!newEntries.length) {
      return res.status(200).json({
        message: "No new numbers to import",
      });
    }

    const result = await NumberDirectory.insertMany(newEntries);

    // -------------------------------
    // SUCCESS ✔️
    // -------------------------------
    res.status(200).json({
      message: "Contact import successful",
      count: result.length,
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to import numbers",
      error: err.message,
    });
  }
};
