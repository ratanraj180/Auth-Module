const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Helper function to generate a JWT token.
 * @param {string} id - The user ID to include in the payload.
 * @returns {string} Signed JWT token.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if fields are empty
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user. Password will be hashed in pre-save hook of model.
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Developer', // defaults to Developer
    });

    if (user) {
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(`Registration Error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if fields are empty
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user in DB and explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`Login Error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(`Get Profile Error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
