const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const adminController = require('../controllers/adminController');

router.get('/dishes', verifyToken, checkRole(['admin']), asyncHandler(adminController.getAdminDishes));
router.put('/dishes/:dishId/availability', verifyToken, checkRole(['admin']), asyncHandler(adminController.updateDishAvailability));

module.exports = router;
