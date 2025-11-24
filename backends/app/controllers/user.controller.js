const db = require("../models");
const User = db.user;
const Role = db.role;

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

