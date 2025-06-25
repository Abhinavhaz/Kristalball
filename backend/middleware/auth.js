const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password').populate('assignedBase');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }

    next();
  };
};

// Base access control - ensure user can only access their assigned base data
const checkBaseAccess = (req, res, next) => {
  const { baseId } = req.params;
  const userRole = req.user.role;
  const userBaseId = req.user.assignedBase?._id?.toString();

  // Admin can access all bases
  if (userRole === 'admin') {
    return next();
  }

  // Base commander and logistics officer can only access their assigned base
  if ((userRole === 'base_commander' || userRole === 'logistics_officer') && 
      baseId && baseId !== userBaseId) {
    return res.status(403).json({ 
      message: 'Access denied. You can only access data for your assigned base.' 
    });
  }

  next();
};

module.exports = {
  protect,
  authorize,
  checkBaseAccess
};
