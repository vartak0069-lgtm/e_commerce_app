const { verifyAccessToken } = require('../utils/jwt');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

// Verifies JWT from Authorization header or cookie, attaches req.user
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.accessToken;

    if (!token) throw new UnauthorizedError('No token provided, please log in');

    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

// Restricts route to specific roles, e.g. requireRole('admin')
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    next();
  };
}

// Attaches req.user if a valid token exists, but doesn't fail if not (for guest browsing)
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.accessToken;
    if (token) {
      req.user = verifyAccessToken(token);
    }
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
}

module.exports = { authenticate, requireRole, optionalAuth };
