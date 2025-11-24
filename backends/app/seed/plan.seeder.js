const db = require("../models");
const Plan = db.plan;

async function seedPlans() {
  try {
    const count = await Plan.estimatedDocumentCount();

    if (count === 0) {
      await Plan.create([
        {
          name: "Starter",
          price: 0,
          currency: "INR",
          interval: "month",
          description: "Perfect for testing and small-scale campaigns",
          features: [
            "Up to 500 emails/month",
            "Up to 100 SMS/month",
            "1 SMTP configuration",
            "1 Android gateway connection",
            "Basic analytics",
            "Community support"
          ],
          emailsPerMonth: 500,
          smsPerMonth: 100,
          smtpConfigs: 1,
          androidGateways: 1
        },
        {
          name: "Professional",
          price: 2900,
          currency: "INR",
          interval: "month",
          description: "Ideal for growing businesses and marketing teams",
          features: [
            "Up to 10,000 emails/month",
            "Up to 2,000 SMS/month",
            "5 SMTP configurations",
            "3 Android gateway connections",
            "Advanced analytics",
            "Priority email support",
            "Custom templates"
          ],
          emailsPerMonth: 10000,
          smsPerMonth: 2000,
          smtpConfigs: 5,
          androidGateways: 3,
          isPopular: true
        },
        {
          name: "Enterprise",
          price: 9900,
          currency: "INR",
          interval: "month",
          description: "For agencies and high-volume senders",
          features: [
            "Unlimited emails",
            "Unlimited SMS",
            "Unlimited SMTP configurations",
            "Unlimited gateway connections",
            "Real-time analytics",
            "24/7 phone support",
            "Custom integrations",
            "Dedicated account manager"
          ],
          emailsPerMonth: -1,
          smsPerMonth: -1,
          smtpConfigs: -1,
          androidGateways: -1
        }
      ]);

      console.log("✅ Default Plans Seeded!");
    } else {
      console.log("ℹ️ Plans already exist. Skipping...");
    }
  } catch (err) {
    console.error("❌ Error seeding plans:", err);
  }
}

module.exports = seedPlans;
