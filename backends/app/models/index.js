const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// MODELS
db.user = require("./user.model");
db.role = require("./role.model");
db.smtp = require("./smtp.model");
db.campaign = require("./campaign.model");
db.emailDirectory = require("./EmailDirectory.model");  // <-- ADD THIS
db.SmsGatewayConfig = require("./SmsGatewayConfig.model")
db.numberDirectory = require("./numberDirectory.model");


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
