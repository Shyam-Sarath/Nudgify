const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const dishController = require('../controllers/dishController');

// Get all dishes
router.get('/', asyncHandler(dishController.getAllDishes));

// Get dish by ID
// Search dishes
router.get('/search/:query', asyncHandler(dishController.searchDishes));

// Get dish by ID
router.get('/:id', asyncHandler(dishController.getDishById));

module.exports = router;
