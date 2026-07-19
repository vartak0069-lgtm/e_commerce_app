const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

function generateAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwtConfig.refreshSecret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
