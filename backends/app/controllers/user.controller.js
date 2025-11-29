const db = require("../models");
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  if (!req.userId) {
    return res.status(401).send({ message: "Unauthorized: Missing user id" });
  }
  res.status(200).send(`User Content. UserId: ${req.userId}`);
};

exports.adminBoard = (req, res) => {
  if (!req.userId) {
    return res.status(401).send({ message: "Unauthorized: Missing user id" });
  }
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  if (!req.userId) {
    return res.status(401).send({ message: "Unauthorized: Missing user id" });
  }
  res.status(200).send("Moderator Content.");
};

// ✅ Add this function
exports.getAllUsers = async (req, res) => {
  try {
    // Populate roles to get role names
    const users = await User.find().populate("roles", "name"); 
    // The second parameter "name" selects only the role name field

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, roles,phone } = req.body;

    let roleIds = [];

    if (roles) {
      // Convert "Admin" -> "admin"
      const roleLower = roles[0];

      const foundRole = await Role.findOne({ name: roleLower });

      if (!foundRole) {
        return res.status(400).send({ message: "Invalid role selected" });
      }

      roleIds = [foundRole._id];
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
        phone,
        roles: roleIds,  // Must be ObjectId[]
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({
        message: "username, email, and password are required",
      });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Find admin role
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      return res.status(500).send({
        message: "Admin role not found in database. Seed roles first.",
      });
    }

    // Create admin user
    const adminUser = new User({
      username,
      email,
      phone: phone || "",
      password: bcrypt.hashSync(password, 8),
      roles: [adminRole._id],
    });

    await adminUser.save();

    res.status(201).send({
      message: "Admin user created successfully",
      user: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
      },
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};