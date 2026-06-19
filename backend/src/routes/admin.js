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
router.put('/users/:userId/enable', verifyToken, checkRole(['admin']), asyncHandler(adminController.enableUser));

// Chef Management
router.get('/chefs', verifyToken, checkRole(['admin']), asyncHandler(adminController.getAllChefs));
router.get('/chefs/:chefId', verifyToken, checkRole(['admin']), asyncHandler(adminController.getChefDetail));
// Create Chef (admin)
router.post('/chefs', verifyToken, checkRole(['admin']), asyncHandler(adminController.createChef));

// Activity Logs
router.get('/activity-logs', verifyToken, checkRole(['admin']), asyncHandler(adminController.getActivityLogs));

// Pending Chef Approval
router.put('/chefs/:chefId/approve', verifyToken, checkRole(['admin']), asyncHandler(adminController.approveChef));

// Admin Dish Management
router.get('/dishes', verifyToken, checkRole(['admin']), asyncHandler(adminController.getAdminDishes));
router.put('/dishes/:dishId/availability', verifyToken, checkRole(['admin']), asyncHandler(adminController.updateDishAvailability));
router.delete('/dishes/:dishId', verifyToken, checkRole(['admin']), asyncHandler(adminController.deleteDish));

// Order Management & Analytics
router.get('/orders', verifyToken, checkRole(['admin']), asyncHandler(adminController.getOrders));
router.put('/orders/:orderId/status', verifyToken, checkRole(['admin']), asyncHandler(adminController.updateOrderStatus));
router.get('/analytics/daily', verifyToken, checkRole(['admin']), asyncHandler(adminController.getDailyAnalytics));
router.get('/reports', verifyToken, checkRole(['admin']), asyncHandler(adminController.getReports));

module.exports = router;
