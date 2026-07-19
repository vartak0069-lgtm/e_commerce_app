const validator = require('validator');

function isValidEmail(email) {
  return typeof email === 'string' && validator.isEmail(email);
}

function isStrongPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function isValidPincode(pincode) {
  return /^[1-9][0-9]{5}$/.test(String(pincode));
}

function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(String(phone));
}

function sanitizeString(str) {
  return typeof str === 'string' ? validator.escape(str.trim()) : str;
}

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidPincode,
  isValidPhone,
  sanitizeString,
};
