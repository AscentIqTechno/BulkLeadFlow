const mongoose = require('mongoose');

// Subdocument for usage tracking
const planUsageSchema = new mongoose.Schema({
  emailsSent: { type: Number, default: 0 },
  smsSent: { type: Number, default: 0 },
  smtpConfigsUsed: { type: Number, default: 0 },
  androidGatewaysUsed: { type: Number, default: 0 },
  lastResetDate: { type: Date, default: Date.now }
}, { _id: false });

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },

  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'expired', 'past_due', 'inactive'],
    default: 'inactive'
  },

  planLimits: {
    emailsPerMonth: { type: Number, default: 0 },
    smsPerMonth: { type: Number, default: 0 },
    smtpConfigs: { type: Number, default: 0 },
    androidGateways: { type: Number, default: 0 }
  },

  planUsage: {
    type: planUsageSchema,
    default: () => ({})
  },

  trialEndsAt: {
    type: Date
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,

  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  autoRenew: {
    type: Boolean,
    default: true
  },

  status: {
    type: String,
    enum: ['active', 'expired', 'canceled', 'refunded'],
    default: 'active'
  }

}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
