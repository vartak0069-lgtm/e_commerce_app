const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');
const { paginate } = require('../utils/formatters');

// GET /api/orders (own orders)
const getMyOrders = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { from, to } = paginate(page, limit);
  const { data, count } = await Order.findByUser(req.user.id, { from, to });
  res.json({ success: true, data, meta: { total: count } });
});

// GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new NotFoundError('Order not found');
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    throw new ForbiddenError('You cannot view this order');
  }
  res.json({ success: true, data: order });
});

// PATCH /api/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new NotFoundError('Order not found');
  if (order.user_id !== req.user.id) throw new ForbiddenError('You cannot cancel this order');
  if (['shipped', 'delivered'].includes(order.status)) {
    throw new ValidationError('Order cannot be cancelled after it has shipped');
  }
  const updated = await Order.updateStatus(req.params.id, 'cancelled');
  res.json({ success: true, data: updated });
});

// GET /api/admin/orders (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const { from, to } = paginate(page, limit);
  const { data, count } = await Order.findAll({ from, to, status });
  res.json({ success: true, data, meta: { total: count } });
});

// PATCH /api/admin/orders/:id/status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  if (!validStatuses.includes(status)) throw new ValidationError('Invalid order status');
  const order = await Order.updateStatus(req.params.id, status);
  res.json({ success: true, data: order });
});

module.exports = { getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus };
