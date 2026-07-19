const Razorpay = require('razorpay');
require('dotenv').config();

// NOTE: Use TEST MODE keys (start with rzp_test_) - these are completely free,
// no real transactions happen, perfect for internship/college projects.
// Get them free from: https://dashboard.razorpay.com/app/keys

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️  Razorpay keys missing in .env - payment routes will fail until added.');
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;
