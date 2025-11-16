require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ Connected to MongoDB Atlas");

  // 👉 Run Role Seeder Only After DB Connection
  const seedRoles = require("./app/seed/seedRoles");
  await seedRoles();
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ReachIQ Node.js + MongoDB Atlas API" });
});

// 👉 Import & Use Routes Properly
const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const smtpRoutes = require("./app/routes/smtp.routes");
const campaignRoutes = require("./app/routes/campaign.routes")
const emailDirectoryRoutes = require("./app/routes/emailDirectory.routes")

app.use("/api/user", userRoutes);
app.use("/api", smtpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/complain",campaignRoutes)
app.use("/api/email_directory",emailDirectoryRoutes)

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
