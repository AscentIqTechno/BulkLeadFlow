const config = require("../config/auth.config");
const db = require("../models");

const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// ----------------------------------------------------
// SIGNUP
// ----------------------------------------------------
exports.signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Create user
    const user = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
    });

    const savedUser = await user.save();

    // Assign roles
    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      savedUser.roles = foundRoles.map((r) => r._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      savedUser.roles = [defaultRole._id];
    }

    await savedUser.save();

    res.status(201).send({
      message: "User registered successfully!",
      userId: savedUser._id,
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send({ message: err.message || "Signup failed" });
  }
};


// ----------------------------------------------------
// SIGNIN (LOGIN WITH EMAIL)
// ----------------------------------------------------
exports.signin = async (req, res) => {
  try {
    // frontend may send email OR username
    const email = req.body.email || req.body.username;
    const password = req.body.password;

    console.log("Login body:", req.body);
    console.log("Extracted email:", email);

    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required!" });
    }

    // Find user by email
    const user = await User.findOne({ email }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Check password
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password!",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      config.secret,
      { expiresIn: 86400 }
    );

    const authorities = user.roles.map((role) => "ROLE_" + role.name.toUpperCase());

    // Response
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });

  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).send({ message: err.message || "Signin failed" });
  }
};
