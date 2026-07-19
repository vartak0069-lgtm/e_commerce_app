const { isValidEmail, isStrongPassword, isValidPincode, isValidPhone } = require('../../src/utils/validators');

describe('validators', () => {
  test('validates emails correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
  });

  test('validates password strength', () => {
    expect(isStrongPassword('123456')).toBe(true);
    expect(isStrongPassword('123')).toBe(false);
  });

  test('validates Indian pincode', () => {
    expect(isValidPincode('400001')).toBe(true);
    expect(isValidPincode('000001')).toBe(false);
  });

  test('validates Indian phone number', () => {
    expect(isValidPhone('9876543210')).toBe(true);
    expect(isValidPhone('1234567890')).toBe(false);
  });
});
