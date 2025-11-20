const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

// Verify JWT token
verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  console.log(token,"ggggg")
  if (!token) return res.status(403).send({ message: "No token provided!" });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized!" });
    req.userId = decoded.id;
    next();
  });
};

// Helper to fetch user with roles populated
const getUserWithRoles = async (userId) => {
  return await User.findById(userId).populate("roles", "name"); // populate 'name' field of roles
};

// Check if user has 'admin' role
isAdmin = async (req, res, next) => {
  try {
    const user = await getUserWithRoles(req.userId);
    if (!user) return res.status(404).send({ message: "User not found!" });

    if (user.roles.some((r) => r.name === "admin")) {
      next();
    } else {
      res.status(403).send({ message: "Require Admin Role!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Check if user has 'moderator' role
isModerator = async (req, res, next) => {
  try {
    const user = await getUserWithRoles(req.userId);
    if (!user) return res.status(404).send({ message: "User not found!" });

    if (user.roles.some((r) => r.name === "moderator")) {
      next();
    } else {
      res.status(403).send({ message: "Require Moderator Role!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Check if user has 'user' role
isUser = async (req, res, next) => {
  try {
    const user = await getUserWithRoles(req.userId);
    if (!user) return res.status(404).send({ message: "User not found!" });

    if (user.roles.some((r) => r.name === "user")) {
      next();
    } else {
      res.status(403).send({ message: "Require User Role!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { verifyToken, isAdmin, isModerator, isUser };
