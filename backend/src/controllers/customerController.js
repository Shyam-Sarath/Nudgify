const pool = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Get Customer Profile
const getProfile = async (req, res) => {
  const customerId = req.user.id;

  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [customerId]);

    if (result.rows.length === 0) {
      throw new AppError('Profile not found', 404);
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

// Update Customer Profile
const updateProfile = async (req, res) => {
  const customerId = req.user.id;
  const { name } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email',
      [name, customerId]
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
    const chef = await pool.query(
      `SELECT cp.*, u.name, u.email 
       FROM chef_profile cp 
       JOIN users u ON cp.user_id = u.id 
       WHERE cp.user_id = $1`,
      [chefId]
    );

    if (chef.rows.length === 0) {
      throw new AppError('Chef not found', 404);
    }

    const dishes = await pool.query('SELECT * FROM dishes WHERE chef_id = $1', [chefId]);

    res.status(200).json({
      success: true,
      data: {
        ...chef.rows[0],
        dishes: dishes.rows
      }
    });
  } catch (error) {
    throw error;
  }
};

// Get All Dishes
const getAllDishes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.name as chef_name 
       FROM dishes d 
       JOIN users u ON d.chef_id = u.id 
       WHERE d.availability = true 
       ORDER BY d.created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    throw error;
  }
};

// Get Dish Detail
const getDishDetail = async (req, res) => {
  const { dishId } = req.params;

  try {
    const result = await pool.query(
      `SELECT d.*, u.name as chef_name, u.email as chef_email 
       FROM dishes d 
       JOIN users u ON d.chef_id = u.id 
       WHERE d.id = $1`,
      [dishId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Dish not found', 404);
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllChefs,
  getChefDetail,
  getAllDishes,
  getDishDetail
};
