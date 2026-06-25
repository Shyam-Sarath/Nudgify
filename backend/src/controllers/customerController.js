const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Get Customer Profile
const getProfile = async (req, res) => {
  const customerId = req.user.id;

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, profile_image, created_at')
    .eq('id', customerId)
    .single();

  if (error || !data) throw new AppError('Profile not found', 404);

  res.status(200).json({ success: true, data });
};

// Update Customer Profile
const updateProfile = async (req, res) => {
  const customerId = req.user.id;
  const { name } = req.body;

  const { data, error } = await supabase
    .from('users')
    .update({ name })
    .eq('id', customerId)
    .select('id, name, email')
    .single();

  if (error) throw new AppError(error.message, 500);

  res.status(200).json({ success: true, message: 'Profile updated successfully', data });
};

// Get All Active Chefs
const getAllChefs = async (req, res) => {
  const { data, error } = await supabase
    .from('chef_profile')
    .select('*, users(name, email)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500);

  res.status(200).json({ success: true, data });
};

// Get Chef Detail with Dishes
const getChefDetail = async (req, res) => {
  const { chefId } = req.params;

  const { data: chef, error: chefError } = await supabase
    .from('chef_profile')
    .select('*, users(name, email)')
    .eq('user_id', chefId)
    .single();

  if (chefError || !chef) throw new AppError('Chef not found', 404);

  const { data: dishes } = await supabase
    .from('dishes')
    .select('*')
    .eq('chef_id', chefId)
    .eq('availability', true);

  res.status(200).json({ success: true, data: { ...chef, dishes: dishes || [] } });
};

// Get All Available Dishes
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

// Get Dish Detail
const getDishDetail = async (req, res) => {
  const { dishId } = req.params;

  const { data, error } = await supabase
    .from('dishes')
    .select('*, users!chef_id(name, email)')
    .eq('id', dishId)
    .single();

  if (error || !data) throw new AppError('Dish not found', 404);

  res.status(200).json({
    success: true,
    data: { ...data, chef_name: data.users?.name, chef_email: data.users?.email, users: undefined },
  });
};

// Upload Customer Profile Image
const uploadProfileImage = async (req, res) => {
  const customerId = req.user.id;
  const { imageBase64 } = req.body;

  if (!imageBase64) throw new AppError('Image data is required', 400);

  let contentType = 'image/png';
  let base64Data = imageBase64;

  if (imageBase64.includes(';base64,')) {
    const parts = imageBase64.split(';base64,');
    contentType = parts[0].replace('data:', '');
    base64Data = parts[1];
  }

  const buffer = Buffer.from(base64Data, 'base64');
  const fileExtension = contentType.split('/')[1] || 'png';
  const fileName = `customer_${customerId}_${Date.now()}.${fileExtension}`;

  const bucket = 'profile-images';

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType,
      upsert: true,
    });

  if (error) throw new AppError(`Storage upload failed: ${error.message}`, 500);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  const publicUrl = urlData?.publicUrl;

  const { data: profile, error: dbError } = await supabase
    .from('users')
    .update({ profile_image: publicUrl })
    .eq('id', customerId)
    .select()
    .single();

  if (dbError) throw new AppError(dbError.message, 500);

  res.status(200).json({
    success: true,
    message: 'Profile image uploaded successfully',
    data: { profile_image: publicUrl, profile },
  });
};

module.exports = {
  getProfile,
  updateProfile,
  getAllChefs,
  getChefDetail,
  getAllDishes,
  getDishDetail,
  uploadProfileImage,
};
