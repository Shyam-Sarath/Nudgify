const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const authController = require('../controllers/authController');

// Public Routes
router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/refresh-token', asyncHandler(authController.refreshToken));

// Protected Routes
router.post('/logout', asyncHandler(authController.logout));

module.exports = router;
