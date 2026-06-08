const pool = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Get Dashboard Overview
const getDashboard = async (req, res) => {
  try {
    // Total customers
    const customers = await pool.query(
      'SELECT COUNT(*) FROM users WHERE role = $1',
      ['customer']
    );

    // Total chefs
    const chefs = await pool.query(
      'SELECT COUNT(*) FROM users WHERE role = $1',
      ['chef']
    );

    // Total orders
    const orders = await pool.query('SELECT COUNT(*) FROM orders');

    // Total revenue
    const revenue = await pool.query(
      'SELECT SUM(total_amount) FROM orders WHERE status = $1',
      ['completed']
    );

    res.status(200).json({
      success: true,
      data: {
        totalCustomers: parseInt(customers.rows[0].count),
        totalChefs: parseInt(chefs.rows[0].count),
        totalOrders: parseInt(orders.rows[0].count),
        totalRevenue: revenue.rows[0].sum || 0
      }
    });
  } catch (error) {
    throw error;
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    throw error;
  }
};

// Get User Detail
const getUserDetail = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Disable User
const disableUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE users SET active = false WHERE id = $1 RETURNING id, name, email, active',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User disabled',
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Get All Chefs
const getAllChefs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cp.*, u.name, u.email 
       FROM chef_profile cp 
       JOIN users u ON cp.user_id = u.id 
       ORDER BY cp.created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    throw error;
  }
};

// Get Chef Detail
const getChefDetail = async (req, res) => {
  const { chefId } = req.params;

  try {
    const chefResult = await pool.query(
      `SELECT cp.*, u.name, u.email 
       FROM chef_profile cp 
       JOIN users u ON cp.user_id = u.id 
       WHERE cp.user_id = $1`,
      [chefId]
    );

    if (chefResult.rows.length === 0) {
      throw new AppError('Chef not found', 404);
    }

    const ordersResult = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE chef_id = $1',
      [chefId]
    );

    const revenueResult = await pool.query(
      'SELECT SUM(total_amount) FROM orders WHERE chef_id = $1 AND status = $2',
      [chefId, 'completed']
    );

    res.status(200).json({
      success: true,
      data: {
        ...chefResult.rows[0],
        totalOrders: parseInt(ordersResult.rows[0].count),
        totalRevenue: revenueResult.rows[0].sum || 0
      }
    });
  } catch (error) {
    throw error;
  }
};

// Get Orders
const getOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.name as customer_name, c.name as chef_name 
       FROM orders o 
       JOIN users u ON o.customer_id = u.id 
       JOIN users c ON o.chef_id = c.id 
       ORDER BY o.created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    throw error;
  }
};

// Get Daily Analytics
const getDailyAnalytics = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total_amount) as revenue 
       FROM orders 
       WHERE created_at >= NOW() - INTERVAL '30 days' 
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  getUserDetail,
  disableUser,
  getAllChefs,
  getChefDetail,
  getOrders,
  getDailyAnalytics
};
