const { formatCurrency, generateOrderNumber, generateSlug, paginate } = require('../../src/utils/formatters');

describe('formatters', () => {
  test('formatCurrency formats correctly', () => {
    expect(formatCurrency(1500)).toBe('₹1500.00');
  });

  test('generateOrderNumber has expected prefix', () => {
    expect(generateOrderNumber()).toMatch(/^ORD-\d{8}-\d{4}$/);
  });

  test('generateSlug converts name to url-safe slug', () => {
    expect(generateSlug('Wireless Bluetooth Earbuds!')).toBe('wireless-bluetooth-earbuds');
  });

  test('paginate calculates range correctly', () => {
    expect(paginate(2, 10)).toEqual({ from: 10, to: 19, page: 2, limit: 10 });
  });
});
