const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const adminController = require('../controllers/adminController');

// Admin Dashboard Overview
router.get('/dashboard', verifyToken, checkRole(['admin']), asyncHandler(adminController.getDashboard));

// User Management
router.get('/users', verifyToken, checkRole(['admin']), asyncHandler(adminController.getAllUsers));
router.get('/users/:userId', verifyToken, checkRole(['admin']), asyncHandler(adminController.getUserDetail));
router.put('/users/:userId/disable', verifyToken, checkRole(['admin']), asyncHandler(adminController.disableUser));

// Chef Management
router.get('/chefs', verifyToken, checkRole(['admin']), asyncHandler(adminController.getAllChefs));
router.get('/chefs/:chefId', verifyToken, checkRole(['admin']), asyncHandler(adminController.getChefDetail));

// Order Analytics
router.get('/orders', verifyToken, checkRole(['admin']), asyncHandler(adminController.getOrders));
router.get('/analytics/daily', verifyToken, checkRole(['admin']), asyncHandler(adminController.getDailyAnalytics));

module.exports = router;
