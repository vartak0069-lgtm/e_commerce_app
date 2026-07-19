const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { ConflictError, UnauthorizedError, NotFoundError, ValidationError } = require('../utils/errors');
const emailService = require('../services/emailService');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findByEmail(email);
  if (existing) throw new ConflictError('An account with this email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    verification_token: verificationToken,
  });

  await emailService.sendMail(email, 'Welcome to our store!', emailService.welcomeTemplate(name));

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new UnauthorizedError('Invalid email or password');

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    },
  });
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new UnauthorizedError('Refresh token required');

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);
  if (!user) throw new UnauthorizedError('Invalid refresh token');

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  res.json({ success: true, data: { accessToken } });
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findByEmail(email);
  if (!user) {
    // Don't reveal whether the email exists - respond generically for security
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await User.update(user.id, {
    reset_password_token: resetToken,
    reset_password_expires: resetExpires,
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;
  await emailService.sendMail(email, 'Password Reset Request', emailService.passwordResetTemplate(resetLink));

  res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) throw new ValidationError('Token and new password are required');

  // Simple lookup - in a bigger app you'd index reset_password_token
  const { data } = await require('../config/database')
    .from('users')
    .select('*')
    .eq('reset_password_token', token)
    .maybeSingle();

  if (!data || new Date(data.reset_password_expires) < new Date()) {
    throw new ValidationError('Reset token is invalid or has expired');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.update(data.id, {
    password: hashedPassword,
    reset_password_token: null,
    reset_password_expires: null,
  });

  res.json({ success: true, message: 'Password reset successful, please log in' });
});

// GET /api/auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { data } = await require('../config/database')
    .from('users')
    .select('*')
    .eq('verification_token', token)
    .maybeSingle();

  if (!data) throw new NotFoundError('Invalid verification link');

  await User.update(data.id, { is_verified: true, verification_token: null });
  res.json({ success: true, message: 'Email verified successfully' });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new NotFoundError('User not found');
  const { password, ...safeUser } = user;
  res.json({ success: true, data: safeUser });
});

module.exports = { register, login, refresh, forgotPassword, resetPassword, verifyEmail, getMe };
