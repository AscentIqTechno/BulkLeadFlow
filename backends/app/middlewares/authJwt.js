const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  
  // Extract token from Bearer format if present
  let actualToken = token;
  if (token && token.startsWith("Bearer ")) {
    actualToken = token.slice(7, token.length);
  }
  
  console.log("🔐 Token received:", actualToken ? "Present" : "Missing");

  if (!actualToken) {
    return res.status(403).json({ 
      success: false,
      message: "No token provided!" 
    });
  }

  jwt.verify(actualToken, config.secret, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized! Token is invalid or expired." 
      });
    }
    
    req.userId = decoded.id;
    console.log("✅ Token verified for user ID:", decoded.id);
    next();
  });
};

// Helper to fetch user with roles populated
const getUserWithRoles = async (userId) => {
  return await User.findById(userId).populate("roles", "name");
};

// Check if user has 'admin' role
const isAdmin = async (req, res, next) => {
  try {
    const user = await getUserWithRoles(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found!" 
      });
    }

    if (user.roles.some((r) => r.name === "admin")) {
      console.log("✅ User has admin role:", user.username);
      next();
    } else {
      console.log("❌ User lacks admin role:", user.username);
      res.status(403).json({ 
        success: false,
        message: "Require Admin Role!" 
      });
    }
  } catch (err) {
    console.error("isAdmin error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Check if user has 'moderator' role
const isModerator = async (req, res, next) => {
  try {
    const user = await getUserWithRoles(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found!" 
      });
    }

    if (user.roles.some((r) => r.name === "moderator")) {
      console.log("✅ User has moderator role:", user.username);
      next();
    } else {
      console.log("❌ User lacks moderator role:", user.username);
      res.status(403).json({ 
        success: false,
        message: "Require Moderator Role!" 
      });
    }
  } catch (err) {
    console.error("isModerator error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Check if user has 'user' role
const isUser = async (req, res, next) => {
  try {
    const user = await getUserWithRoles(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found!" 
      });
    }

    if (user.roles.some((r) => r.name === "user")) {
      console.log("✅ User has user role:", user.username);
      next();
    } else {
      console.log("❌ User lacks user role:", user.username);
      res.status(403).json({ 
        success: false,
        message: "Require User Role!" 
      });
    }
  } catch (err) {
    console.error("isUser error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Check if user has moderator OR admin role
const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await getUserWithRoles(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found!" 
      });
    }

    const hasRole = user.roles.some((r) => 
      r.name === "moderator" || r.name === "admin"
    );

    if (hasRole) {
      console.log("✅ User has moderator or admin role:", user.username);
      next();
    } else {
      console.log("❌ User lacks moderator/admin role:", user.username);
      res.status(403).json({ 
        success: false,
        message: "Require Moderator or Admin Role!" 
      });
    }
  } catch (err) {
    console.error("isModeratorOrAdmin error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

module.exports = { 
  verifyToken, 
  isAdmin, 
  isModerator, 
  isUser,
  isModeratorOrAdmin 
};