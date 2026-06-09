const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Get All Dishes (public)
const getAllDishes = async (req, res) => {
  const { data, error } = await supabase
    .from('dishes')
    .select('*, users!chef_id(name)')
    .eq('availability', true)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500);

  const dishes = data.map((d) => ({ ...d, chef_name: d.users?.name, users: undefined }));

  res.status(200).json({ success: true, data: dishes });
};

// Get Dish By ID
const getDishById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('dishes')
    .select('*, users!chef_id(name)')
    .eq('id', id)
    .single();

  if (error || !data) throw new AppError('Dish not found', 404);

  res.status(200).json({
    success: true,
    data: { ...data, chef_name: data.users?.name, users: undefined },
  });
};

// Search Dishes
const searchDishes = async (req, res) => {
  const { query } = req.params;

  const { data, error } = await supabase
    .from('dishes')
    .select('*, users!chef_id(name)')
    .eq('availability', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500);

  const dishes = data.map((d) => ({ ...d, chef_name: d.users?.name, users: undefined }));

  res.status(200).json({ success: true, data: dishes });
};

module.exports = { getAllDishes, getDishById, searchDishes };
