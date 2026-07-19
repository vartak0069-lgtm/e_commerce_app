const crypto = require('crypto');
const razorpay = require('../config/razorpay');

// Creates a Razorpay order (test mode) - amount must be in paise
async function createOrder(amount, currency = 'INR', receipt) {
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt,
  });
}

// Verifies the payment signature sent back from Razorpay checkout on the frontend
function verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  return generatedSignature === razorpay_signature;
}

async function fetchPayment(paymentId) {
  return razorpay.payments.fetch(paymentId);
}

module.exports = { createOrder, verifySignature, fetchPayment };
