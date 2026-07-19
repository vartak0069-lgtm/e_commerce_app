const asyncHandler = require('../middleware/asyncHandler');
const razorpayService = require('../services/razorpayService');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const emailService = require('../services/emailService');
const User = require('../models/User');
const { ValidationError, NotFoundError } = require('../utils/errors');

// POST /api/payments/verify
// Called by frontend after Razorpay checkout modal completes (test mode)
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const isValid = razorpayService.verifySignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!isValid) {
    await Payment.updateByRazorpayOrderId(razorpay_order_id, { status: 'failed' });
    throw new ValidationError('Payment verification failed - signature mismatch');
  }

  await Payment.updateByRazorpayOrderId(razorpay_order_id, {
    razorpay_payment_id,
    razorpay_signature,
    status: 'paid',
  });

  const order = await Order.updatePaymentStatus(orderId, 'paid');
  await Order.updateStatus(orderId, 'confirmed');

  // Reduce stock for each item and clear the user's cart
  const fullOrder = await Order.findById(orderId);
  for (const item of fullOrder.order_items) {
    await Product.decrementStock(item.product_id, item.quantity);
  }
  if (fullOrder.coupon_id) {
    await Coupon.incrementUsage(fullOrder.coupon_id);
  }

  const cart = await Cart.findOrCreateByUser(req.user.id);
  await CartItem.clearCart(cart.id);

  const user = await User.findById(req.user.id);
  await emailService.sendMail(
    user.email,
    `Order Confirmed - ${fullOrder.order_number}`,
    emailService.orderConfirmationTemplate(fullOrder)
  );

  res.json({ success: true, message: 'Payment verified successfully', data: order });
});

// POST /api/payments/failed
const markPaymentFailed = asyncHandler(async (req, res) => {
  const { razorpay_order_id, orderId } = req.body;
  await Payment.updateByRazorpayOrderId(razorpay_order_id, { status: 'failed' });
  await Order.updatePaymentStatus(orderId, 'failed');
  res.json({ success: true, message: 'Payment marked as failed' });
});

module.exports = { verifyPayment, markPaymentFailed };
