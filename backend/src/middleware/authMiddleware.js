const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate a token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token lasts for 30 days
  });
};

// Middleware to check if user is authenticated (logged in)
const checkAuth = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
     
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // User is authenticated, proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user has the *required* role
// This should run *after* checkAuth
const checkRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next(); // User has the required role, proceed
  } else {
    // User is logged in, but doesn't have the right permission
    return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
  }
};

module.exports = { generateToken, checkAuth, checkRole };