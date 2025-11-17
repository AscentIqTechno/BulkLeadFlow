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
const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const smtpRoutes = require("./app/routes/smtp.routes");
const campaignRoutes = require("./app/routes/campaign.routes");
const emailDirectoryRoutes = require("./app/routes/emailDirectory.routes");
const smsRoutes = require("./app/routes/SmsGatewayConfig.routes");
const numberDirectoryRoutes = require("./app/routes/numberDirectory.routes"); // <-- ADDED

app.use("/api/user", userRoutes);
app.use("/api", smtpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/complain", campaignRoutes);
app.use("/api/email_directory", emailDirectoryRoutes);
app.use("/api", smsRoutes);
app.use("/api/number_directory", numberDirectoryRoutes); // <-- ADDED


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Replace with your phone's IP from Simple SMS Gateway
// const PHONE_IP = "192.168.101.121";
// const PHONE_PORT = 8080;
// const SMS_ENDPOINT = "/send-sms"; // Your app uses POST with JSON

// // ---- REAL SMS SENDER ----
// app.post("/api/sms/send", async (req, res) => {
//   const { phone, message } = req.body;

//   if (!phone || !message) {
//     return res.status(400).json({ success: false, error: "Phone and message are required" });
//   }

//   try {
//     // Forward POST request to Android Gateway
//     const response = await axios.post(`http://${PHONE_IP}:${PHONE_PORT}${SMS_ENDPOINT}`, {
//       phone,
//       message
//     });

//     console.log(`SMS sent to: ${phone}`);
//     console.log(`Message: ${message}`);

//     return res.json({
//       success: true,
//       msg: `SMS sent to ${phone}`,
//       phoneResponse: response.data
//     });
//   } catch (err) {
//     console.error(`Error sending SMS to ${phone}:`, err.message);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ---- BULK SMS API ----
// app.post("/api/sms/send-bulk", async (req, res) => {
//   const { numbers, message } = req.body;

//   if (!numbers || !Array.isArray(numbers) || numbers.length === 0 || !message) {
//     return res.status(400).json({ success: false, error: "Numbers array and message are required" });
//   }

//   let sentCount = 0;

//   for (let phone of numbers) {
//     try {
//       await axios.post(`http://${PHONE_IP}:${PHONE_PORT}${SMS_ENDPOINT}`, { phone, message });
//       console.log(`Sent to ${phone}`);
//       sentCount++;
//     } catch (err) {
//       console.error(`Failed to send to ${phone}:`, err.message);
//     }
//   }

//   return res.json({
//     success: true,
//     sent: sentCount,
//     total: numbers.length,
//     message: "Bulk SMS process completed!"
//   });
// });

// app.listen(4000, () => console.log("Server running on port 4000"));
