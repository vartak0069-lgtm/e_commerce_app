const { ValidationError } = require('../utils/errors');
const { isValidEmail, isStrongPassword, isValidPincode, isValidPhone } = require('../utils/validators');

function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  if (!name || name.trim().length < 2) return next(new ValidationError('Name must be at least 2 characters'));
  if (!isValidEmail(email)) return next(new ValidationError('Please provide a valid email'));
  if (!isStrongPassword(password)) return next(new ValidationError('Password must be at least 6 characters'));
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!isValidEmail(email)) return next(new ValidationError('Please provide a valid email'));
  if (!password) return next(new ValidationError('Password is required'));
  next();
}

function validateAddress(req, res, next) {
  const { full_name, phone, address_line1, city, state, pincode } = req.body;
  if (!full_name || !address_line1 || !city || !state) {
    return next(new ValidationError('Please fill all required address fields'));
  }
  if (!isValidPhone(phone)) return next(new ValidationError('Please provide a valid 10-digit phone number'));
  if (!isValidPincode(pincode)) return next(new ValidationError('Please provide a valid pincode'));
  next();
}

function validateProduct(req, res, next) {
  const { name, price, category_id } = req.body;
  if (!name || name.trim().length < 2) return next(new ValidationError('Product name is required'));
  if (price === undefined || Number(price) <= 0) return next(new ValidationError('Price must be a positive number'));
  if (!category_id) return next(new ValidationError('Category is required'));
  next();
}

function validateReview(req, res, next) {
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5) return next(new ValidationError('Rating must be between 1 and 5'));
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateAddress,
  validateProduct,
  validateReview,
};
