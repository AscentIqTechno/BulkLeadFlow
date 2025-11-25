require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ Connected to MongoDB Atlas");
  const seedRoles = require("./app/seed/seedRoles");
  await seedRoles();
  const seedPlans = require("./app/seed/plan.seeder")
  await seedPlans();
  const { initializeRazorpay } = require("./app/utils/initializeRazorpay");
  await initializeRazorpay();

})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});





app.get("/", (req, res) => {
  res.json({ message: "Welcome to ReachIQ Node.js + MongoDB Atlas API" });
});

const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const smtpRoutes = require("./app/routes/smtp.routes");
const campaignRoutes = require("./app/routes/campaign.routes");
const emailDirectoryRoutes = require("./app/routes/emailDirectory.routes");
const smsRoutes = require("./app/routes/SmsGatewayConfig.routes");
const numberDirectoryRoutes = require("./app/routes/numberDirectory.routes");
const smsCampaignRoutes = require("./app/routes/sms_campaign.routes");
const paymentRoutes = require('./app/routes/payment.routes');
const plansRoute = require("./app/routes/plan.routes");
const dashboardRoute = require("./app/routes/dashboard.routes");
const razorpayRoute = require("./app/routes/razorpayConfig.routes");

app.use('/api/payment', paymentRoutes);
app.use("/api/sms_campaign", smsCampaignRoutes);
app.use("/api/user", userRoutes);
app.use("/api", smtpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", campaignRoutes);
app.use("/api/email_directory", emailDirectoryRoutes);
app.use("/api", smsRoutes);
app.use("/api/number_directory", numberDirectoryRoutes);
app.use("/api",plansRoute);
app.use("/api/dashboard",dashboardRoute);
app.use("/api/razorpay" ,razorpayRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});