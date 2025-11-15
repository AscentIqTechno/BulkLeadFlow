const db = require("../models");
const Role = db.role;

async function seedRoles() {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      await Role.create([
        { name: "user" },
        { name: "admin" },
        { name: "moderator" }
      ]);

      console.log("✅ Default roles seeded!");
    } else {
      console.log("ℹ️ Roles already exist. Skipping seeding...");
    }
  } catch (err) {
    console.error("❌ Error seeding roles:", err);
  }
}

module.exports = seedRoles;
