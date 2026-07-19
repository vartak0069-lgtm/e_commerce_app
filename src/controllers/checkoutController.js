const asyncHandler = require('../middleware/asyncHandler');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Payment = require('../models/Payment');
const Address = require('../models/Address');
const Coupon = require('../models/Coupon');
const razorpayService = require('../services/razorpayService');
const shippingService = require('../services/shippingService');
const { calculateOrderTotals, calculateCouponDiscount } = require('../utils/helpers');
const { generateOrderNumber } = require('../utils/formatters');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { TAX_RATE } = require('../config/constants');

// POST /api/checkout/initiate
// Calculates totals, creates a pending order + Razorpay order (test mode, free)
const initiateCheckout = asyncHandler(async (req, res) => {
  const { addressId, couponCode } = req.body;

  const address = await Address.findById(addressId);
  if (!address || address.user_id !== req.user.id) throw new NotFoundError('Address not found');

  const cart = await Cart.findOrCreateByUser(req.user.id);
  const cartItems = await CartItem.findByCart(cart.id);
  if (!cartItems.length) throw new ValidationError('Your cart is empty');

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.products.discount_price || item.products.price;
    return sum + price * item.quantity;
  }, 0);

  let coupon = null;
  let discountAmount = 0;
  if (couponCode) {
    coupon = await Coupon.findByCode(couponCode);
    if (!coupon || !coupon.is_active) throw new ValidationError('Invalid or expired coupon');
    discountAmount = calculateCouponDiscount(coupon, subtotal);
  }

  const shippingCharge = shippingService.calculateShipping(subtotal - discountAmount);
  const { taxAmount, totalAmount } = calculateOrderTotals({
    subtotal,
    discountAmount,
    shippingCharge,
    taxRate: TAX_RATE,
  });

  const orderNumber = generateOrderNumber();
  const order = await Order.create({
    user_id: req.user.id,
    order_number: orderNumber,
    subtotal,
    discount_amount: discountAmount,
    shipping_charge: shippingCharge,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    coupon_id: coupon?.id || null,
    shipping_address_id: addressId,
    status: 'pending',
    payment_status: 'pending',
  });

  const orderItemsPayload = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_name: item.products.name,
    quantity: item.quantity,
    price: item.products.discount_price || item.products.price,
    total: (item.products.discount_price || item.products.price) * item.quantity,
  }));
  await OrderItem.bulkCreate(orderItemsPayload);

  // Create Razorpay order in TEST MODE (free, no real money moves)
  const razorpayOrder = await razorpayService.createOrder(totalAmount, 'INR', orderNumber);
  await Payment.create({
    order_id: order.id,
    razorpay_order_id: razorpayOrder.id,
    amount: totalAmount,
    status: 'created',
  });

  res.status(201).json({
    success: true,
    data: {
      orderId: order.id,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID, // safe to expose - public key
    },
  });
});

module.exports = { initiateCheckout };
