const asyncHandler = require('../middleware/asyncHandler');
const Coupon = require('../models/Coupon');
const { calculateCouponDiscount } = require('../utils/helpers');
const { NotFoundError, ValidationError } = require('../utils/errors');

// POST /api/coupons/validate
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findByCode(code);

  if (!coupon || !coupon.is_active) throw new ValidationError('Invalid or inactive coupon');
  if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
    throw new ValidationError('This coupon has expired');
  }
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    throw new ValidationError('This coupon has reached its usage limit');
  }

  const discount = calculateCouponDiscount(coupon, subtotal);
  if (discount === 0) throw new ValidationError(`Minimum order value of ₹${coupon.min_order_value} required`);

  res.json({ success: true, data: { code: coupon.code, discount } });
});

// GET /api/admin/coupons (admin)
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.findAll();
  res.json({ success: true, data: coupons });
});

// POST /api/admin/coupons (admin)
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() });
  res.status(201).json({ success: true, data: coupon });
});

// PUT /api/admin/coupons/:id (admin)
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.update(req.params.id, req.body);
  res.json({ success: true, data: coupon });
});

// DELETE /api/admin/coupons/:id (admin)
const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.remove(req.params.id);
  res.json({ success: true, message: 'Coupon deleted' });
});

module.exports = { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
