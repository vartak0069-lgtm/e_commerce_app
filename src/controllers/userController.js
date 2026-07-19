const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const { NotFoundError, ValidationError, UnauthorizedError } = require('../utils/errors');
const { paginate } = require('../utils/formatters');

// PUT /api/users/me
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar_url } = req.body;
  const updated = await User.update(req.user.id, { name, phone, avatar_url });
  const { password, ...safeUser } = updated;
  res.json({ success: true, data: safeUser });
});

// PUT /api/users/me/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) throw new ValidationError('New password must be at least 6 characters');

  const user = await User.findById(req.user.id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new UnauthorizedError('Current password is incorrect');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.update(req.user.id, { password: hashedPassword });
  res.json({ success: true, message: 'Password changed successfully' });
});

// GET /api/admin/users (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { from, to } = paginate(page, limit);
  const { data, count } = await User.findAll({ from, to });
  res.json({ success: true, data, meta: { total: count } });
});

// PATCH /api/admin/users/:id/role (admin)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'admin'].includes(role)) throw new ValidationError('Invalid role');
  const user = await User.update(req.params.id, { role });
  const { password, ...safeUser } = user;
  res.json({ success: true, data: safeUser });
});

module.exports = { updateProfile, changePassword, getAllUsers, updateUserRole };
