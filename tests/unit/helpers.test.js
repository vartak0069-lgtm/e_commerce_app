const { calculateOrderTotals, calculateCouponDiscount } = require('../../src/utils/helpers');

describe('helpers', () => {
  test('calculateOrderTotals computes tax and total', () => {
    const result = calculateOrderTotals({ subtotal: 1000, discountAmount: 100, shippingCharge: 49, taxRate: 0.05 });
    expect(result.taxAmount).toBe(45);
    expect(result.totalAmount).toBe(994);
  });

  test('calculateCouponDiscount applies percentage discount', () => {
    const coupon = { discount_type: 'percentage', discount_value: 10, min_order_value: 500 };
    expect(calculateCouponDiscount(coupon, 1000)).toBe(100);
  });

  test('calculateCouponDiscount returns 0 if below min order value', () => {
    const coupon = { discount_type: 'flat', discount_value: 50, min_order_value: 500 };
    expect(calculateCouponDiscount(coupon, 300)).toBe(0);
  });
});
