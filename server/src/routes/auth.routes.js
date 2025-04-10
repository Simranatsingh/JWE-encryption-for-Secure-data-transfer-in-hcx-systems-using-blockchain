const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');
const { generateEncryptionKey } = require('../utils/encryption');

// Validation middleware
const validateRegistration = [
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['patient', 'doctor', 'healthcare_provider', 'insurance_provider']),
  // Make the profile and its fields optional but validate fullName if present
  body('profile.fullName').optional().trim(),
  body('walletAddress').optional(),
  body('publicKey').optional()
];

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
  try {
    console.log('Registration request received:', {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      hasProfile: !!req.body.profile,
      hasWalletAddress: !!req.body.walletAddress
    });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      username, 
      email, 
      password, 
      role, 
      profile,
      walletAddress, 
      publicKey 
    } = req.body;

    // Check if user already exists with same email or username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Check wallet address only if one is provided
    if (walletAddress && walletAddress.trim() !== '') {
      const existingWalletUser = await User.findOne({ 
        walletAddress: walletAddress.toLowerCase() 
      });
      
      if (existingWalletUser) {
        return res.status(400).json({ 
          message: 'This wallet address is already registered' 
        });
      }
    }

    // Create safe versions of optional fields
    const safeProfile = profile || { fullName: 'User' };
    // Let the pre-save hook handle null wallet addresses
    const safeWalletAddress = walletAddress ? walletAddress.toLowerCase() : null;
    const safePublicKey = publicKey || null;

    // Generate encryption keys with proper error handling
    let publicKeyJwk = { dummy: true };
    let privateKeyJwk = { dummy: true };

    try {
      const encryptionKeyPair = await generateEncryptionKey();
      if (encryptionKeyPair && typeof encryptionKeyPair.export === 'function') {
        publicKeyJwk = encryptionKeyPair.export({ type: "public" });
        privateKeyJwk = encryptionKeyPair.export({ type: "private" });
        console.log('Encryption keys generated successfully');
      } else {
        console.log('Using fallback encryption keys');
      }
    } catch (keyGenError) {
      console.error('Error generating encryption keys:', keyGenError);
      // Continue with dummy keys
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role,
      profile: safeProfile,
      walletAddress: safeWalletAddress,
      publicKey: safePublicKey,
      encryptionKeys: {
        publicKey: JSON.stringify(publicKeyJwk),
        privateKey: JSON.stringify(privateKeyJwk)
      }
    });

    try {
      await user.save();
      console.log('User saved successfully');
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: user.getPublicProfile()
      });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      
      // Handle MongoDB errors
      if (saveError.code === 11000) {
        // Extract the duplicate field from the error message
        const field = Object.keys(saveError.keyPattern)[0];
        return res.status(400).json({ 
          message: `Registration failed: Duplicate ${field} value`,
          error: 'A user with this information already exists'
        });
      }
      
      return res.status(500).json({ 
        message: 'Error creating user', 
        error: saveError.message 
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, walletAddress } = req.body;

    console.log('Login attempt for:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: No user found with email:', email);
      return res.status(401).json({ message: 'No user found with this email address' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Incorrect password for user:', email);
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // If wallet address is provided, verify it matches
    if (walletAddress && user.walletAddress) {
      if (user.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        console.log('Login failed: Wrong wallet address for user:', email);
        return res.status(401).json({ 
          message: 'Wrong MetaMask wallet connected. Please use the wallet address you registered with: ' + user.walletAddress 
        });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    try {
      const userProfile = user.getPublicProfile();
      console.log('Login successful for user:', email);
      
      res.json({
        message: 'Login successful',
        token,
        user: userProfile
      });
    } catch (profileError) {
      console.error('Error getting user profile:', profileError);
      
      // Fallback to basic user info if getPublicProfile fails
      const basicUserInfo = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      
      res.json({
        message: 'Login successful',
        token,
        user: basicUserInfo
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile with records
router.get('/profile', auth, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user._id;
    console.log('Fetching profile for user ID:', userId);

    const user = await User.findById(userId)
      .populate({
        path: 'healthRecords',
        populate: {
          path: 'sender receiver',
          select: 'username profile.fullName profile.specialization profile.organization'
        }
      })
      .populate({
        path: 'sharedRecords.record',
        populate: {
          path: 'sender receiver',
          select: 'username profile.fullName profile.specialization profile.organization'
        }
      });

    if (!user) {
      console.log('Profile fetch failed: User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile successfully fetched for user ID:', userId);
    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching profile', error: error.message });
  }
});

// Logout user (client-side only)
router.post('/logout', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('User logged out:', userId);
    
    // In a real application, you might want to invalidate the token
    // or implement a token blacklist
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout', error: error.message });
  }
});

// Test registration route - for debugging only
router.post('/test-register', async (req, res) => {
  try {
    console.log('Test registration received with body:', req.body);
    
    // Always return success
    res.status(200).json({
      message: 'Test registration successful',
      token: 'test-token',
      user: {
        username: req.body.username || 'test-user',
        email: req.body.email || 'test@example.com',
        role: req.body.role || 'patient'
      }
    });
  } catch (error) {
    console.error('Test registration error:', error);
    res.status(500).json({ message: 'Server error during test registration' });
  }
});

// Get all users (development only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

module.exports = router; 