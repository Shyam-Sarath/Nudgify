const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const chefController = require('../controllers/chefController');

// Chef Profile
router.get('/profile', verifyToken, checkRole(['chef']), asyncHandler(chefController.getProfile));
router.put('/profile', verifyToken, checkRole(['chef']), asyncHandler(chefController.updateProfile));
router.post('/profile/image', verifyToken, checkRole(['chef']), asyncHandler(chefController.uploadProfileImage));

// Chef Dishes
router.get('/dishes', verifyToken, checkRole(['chef']), asyncHandler(chefController.getDishes));
router.post('/dishes', verifyToken, checkRole(['chef']), asyncHandler(chefController.createDish));
router.put('/dishes/:dishId', verifyToken, checkRole(['chef']), asyncHandler(chefController.updateDish));
router.delete('/dishes/:dishId', verifyToken, checkRole(['chef']), asyncHandler(chefController.deleteDish));
router.post('/dishes/:dishId/image', verifyToken, checkRole(['chef']), asyncHandler(chefController.uploadDishImage));

// Chef Orders
router.get('/orders', verifyToken, checkRole(['chef']), asyncHandler(chefController.getOrders));
router.put('/orders/:orderId/accept', verifyToken, checkRole(['chef']), asyncHandler(chefController.acceptOrder));
router.put('/orders/:orderId/reject', verifyToken, checkRole(['chef']), asyncHandler(chefController.rejectOrder));
router.put('/orders/:orderId/complete', verifyToken, checkRole(['chef']), asyncHandler(chefController.completeOrder));

// Chef Dashboard
router.get('/dashboard', verifyToken, checkRole(['chef']), asyncHandler(chefController.getDashboard));

module.exports = router;
