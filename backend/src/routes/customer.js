const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const customerController = require('../controllers/customerController');

// Customer Profile
router.get('/profile', verifyToken, checkRole(['customer']), asyncHandler(customerController.getProfile));
router.put('/profile', verifyToken, checkRole(['customer']), asyncHandler(customerController.updateProfile));
router.post('/profile/image', verifyToken, checkRole(['customer']), asyncHandler(customerController.uploadProfileImage));

// Browse Chefs
router.get('/chefs', asyncHandler(customerController.getAllChefs));
router.get('/chefs/:chefId', asyncHandler(customerController.getChefDetail));

// Browse Dishes
router.get('/dishes', asyncHandler(customerController.getAllDishes));
router.get('/dishes/:dishId', asyncHandler(customerController.getDishDetail));

module.exports = router;
