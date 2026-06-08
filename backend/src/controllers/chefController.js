const pool = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Get Chef Profile
const getProfile = async (req, res) => {
  const chefId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT c.*, u.name, u.email FROM chef_profile c JOIN users u ON c.user_id = u.id WHERE c.user_id = $1',
      [chefId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Chef profile not found', 404);
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Update Chef Profile
const updateProfile = async (req, res) => {
  const chefId = req.user.id;
  const { bio, cuisine_type, profile_image } = req.body;

  try {
    const result = await pool.query(
      'UPDATE chef_profile SET bio = $1, cuisine_type = $2, profile_image = $3 WHERE user_id = $4 RETURNING *',
      [bio, cuisine_type, profile_image, chefId]
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Get Chef Dishes
const getDishes = async (req, res) => {
  const chefId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM dishes WHERE chef_id = $1 ORDER BY created_at DESC',
      [chefId]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    throw error;
  }
};

// Create Dish
const createDish = async (req, res) => {
  const chefId = req.user.id;
  const { name, description, price, category, availability } = req.body;

  if (!name || !price) {
    throw new AppError('Name and price are required', 400);
  }

  try {
    const result = await pool.query(
      'INSERT INTO dishes (chef_id, name, description, price, category, availability) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [chefId, name, description, price, category, availability || true]
    );

    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Update Dish
const updateDish = async (req, res) => {
  const chefId = req.user.id;
  const { dishId } = req.params;
  const { name, description, price, category, availability } = req.body;

  try {
    const result = await pool.query(
      'UPDATE dishes SET name = $1, description = $2, price = $3, category = $4, availability = $5 WHERE id = $6 AND chef_id = $7 RETURNING *',
      [name, description, price, category, availability, dishId, chefId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Dish not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Dish updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Delete Dish
const deleteDish = async (req, res) => {
  const chefId = req.user.id;
  const { dishId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM dishes WHERE id = $1 AND chef_id = $2 RETURNING id',
      [dishId, chefId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Dish not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    throw error;
  }
};

// Get Chef Orders
const getOrders = async (req, res) => {
  const chefId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email 
       FROM orders o 
       JOIN users u ON o.customer_id = u.id 
       WHERE o.chef_id = $1 
       ORDER BY o.created_at DESC`,
      [chefId]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    throw error;
  }
};

// Accept Order
const acceptOrder = async (req, res) => {
  const chefId = req.user.id;
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 AND chef_id = $3 RETURNING *',
      ['accepted', orderId, chefId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Order accepted',
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Reject Order
const rejectOrder = async (req, res) => {
  const chefId = req.user.id;
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 AND chef_id = $3 RETURNING *',
      ['rejected', orderId, chefId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Order rejected',
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Complete Order
const completeOrder = async (req, res) => {
  const chefId = req.user.id;
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 AND chef_id = $3 RETURNING *',
      ['completed', orderId, chefId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Order completed',
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Get Chef Dashboard
const getDashboard = async (req, res) => {
  const chefId = req.user.id;

  try {
    // Total orders
    const ordersCount = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE chef_id = $1',
      [chefId]
    );

    // Total revenue
    const revenue = await pool.query(
      'SELECT SUM(total_amount) FROM orders WHERE chef_id = $1 AND status = $2',
      [chefId, 'completed']
    );

    // Completed orders
    const completedCount = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE chef_id = $1 AND status = $2',
      [chefId, 'completed']
    );

    res.status(200).json({
      success: true,
      data: {
        totalOrders: parseInt(ordersCount.rows[0].count),
        totalRevenue: revenue.rows[0].sum || 0,
        completedOrders: parseInt(completedCount.rows[0].count)
      }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDishes,
  createDish,
  updateDish,
  deleteDish,
  getOrders,
  acceptOrder,
  rejectOrder,
  completeOrder,
  getDashboard
};
