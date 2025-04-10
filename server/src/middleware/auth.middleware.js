const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Authentication failed: No token provided');
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded.id);
      
      if (!user) {
        console.log('Authentication failed: User not found for token');
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Add user to request
      req.user = user;
      req.token = token;
      next();
    } catch (verifyError) {
      console.log('Token verification failed:', verifyError.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

const validateWallet = async (req, res, next) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    // Check if wallet address is already registered
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Wallet address is already registered' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  auth,
  checkRole,
  validateWallet
}; 