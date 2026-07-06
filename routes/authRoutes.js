const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (Requires authentication)
router.get('/profile', protect, getUserProfile);

// Example of Role-Based Access Control (RBAC)
// Route only accessible by Admins
router.get('/admin-dashboard', protect, authorize('Admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Admin Dashboard! Access granted.',
    user: req.user,
  });
});

// Route only accessible by Developers or Admins
router.get('/developer-board', protect, authorize('Developer', 'Admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Developer Board! Access granted.',
    user: req.user,
  });
});

module.exports = router;
