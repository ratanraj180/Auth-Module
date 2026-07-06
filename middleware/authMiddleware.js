const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes by verifying JWT in the Authorization header.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in authorization header and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (split "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB and attach to req object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(`Token verification failed: ${error.message}`);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

/**
 * Grant access to specific roles.
 * @param  {...string} roles - Roles allowed to access the route
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
