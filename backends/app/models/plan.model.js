const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  interval: {
    type: String,
    enum: ['month', 'year'],
    default: 'month'
  },
  description: {
    type: String
  },
  features: [{
    type: String
  }],
  // Plan limits
  emailsPerMonth: {
    type: Number,
    default: 0
  },
  smsPerMonth: {
    type: Number,
    default: 0
  },
  smtpConfigs: {
    type: Number,
    default: 1
  },
  androidGateways: {
    type: Number,
    default: 1
  },
  // ... other limits
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', PlanSchema);