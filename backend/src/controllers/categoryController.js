const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Get All Categories
const getCategories = async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    if (error.code === '42P01') {
      // Table doesn't exist yet, return empty list gracefully
      return res.status(200).json({ success: true, data: [] });
    }
    throw new AppError(error.message, 500);
  }

  res.status(200).json({ success: true, data: data || [] });
};

// Create a Category (Chef/Admin only)
const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new AppError('Category name is required', 400);
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({ name: name.trim() })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new AppError('Category already exists', 400);
    }
    throw new AppError(error.message, 500);
  }

  res.status(201).json({ success: true, message: 'Category created successfully', data });
};

module.exports = {
  getCategories,
  createCategory,
};
