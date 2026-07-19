function calculateOrderTotals({ subtotal, discountAmount = 0, shippingCharge = 0, taxRate = 0.05 }) {
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = Number((taxableAmount * taxRate).toFixed(2));
  const totalAmount = Number((taxableAmount + taxAmount + shippingCharge).toFixed(2));
  return { taxAmount, totalAmount };
}

function calculateCouponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  if (subtotal < Number(coupon.min_order_value || 0)) return 0;

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = (subtotal * Number(coupon.discount_value)) / 100;
    if (coupon.max_discount) discount = Math.min(discount, Number(coupon.max_discount));
  } else {
    discount = Number(coupon.discount_value);
  }
  return Number(discount.toFixed(2));
}

module.exports = { calculateOrderTotals, calculateCouponDiscount };
