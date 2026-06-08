const pool = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

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

// Get Dish By ID
const getDishById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT d.*, u.name as chef_name 
       FROM dishes d 
       JOIN users u ON d.chef_id = u.id 
       WHERE d.id = $1`,
      [id]
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

// Search Dishes
const searchDishes = async (req, res) => {
  const { query } = req.params;

  try {
    const result = await pool.query(
      `SELECT d.*, u.name as chef_name 
       FROM dishes d 
       JOIN users u ON d.chef_id = u.id 
       WHERE (d.name ILIKE $1 OR d.description ILIKE $1 OR d.category ILIKE $1) 
       AND d.availability = true 
       ORDER BY d.created_at DESC`,
      [`%${query}%`]
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
  getAllDishes,
  getDishById,
  searchDishes
};
