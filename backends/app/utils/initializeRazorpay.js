const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpay;

const initializeRazorpay = () => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are missing');
    }
    
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    
    console.log('✅ Razorpay initialized successfully');
    return razorpay;
  } catch (error) {
    console.error('❌ Razorpay initialization failed:', error.message);
    return null;
  }
};

const getRazorpayInstance = () => {
  if (!razorpay) {
    throw new Error('Razorpay not initialized. Call initializeRazorpay first.');
  }
  return razorpay;
};

module.exports = { initializeRazorpay, getRazorpayInstance };