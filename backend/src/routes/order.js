const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const orderController = require('../controllers/orderController');

// Place Order (Customer)
router.post('/', verifyToken, checkRole(['customer']), asyncHandler(orderController.placeOrder));

// Get Order by ID
router.get('/:orderId', verifyToken, asyncHandler(orderController.getOrderById));

// Get Customer Orders
router.get('/customer/history', verifyToken, checkRole(['customer']), asyncHandler(orderController.getCustomerOrders));

// Get Chef Orders
router.get('/chef/all', verifyToken, checkRole(['chef']), asyncHandler(orderController.getChefOrders));

module.exports = router;
