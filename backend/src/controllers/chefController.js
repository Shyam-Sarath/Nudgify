const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Get Chef Profile
const getProfile = async (req, res) => {
  const chefId = req.user.id;

  const { data, error } = await supabase
    .from('chef_profile')
    .select('*, users(name, email)')
    .eq('user_id', chefId)
    .single();

  if (error || !data) throw new AppError('Chef profile not found', 404);

  res.status(200).json({ success: true, data });
};

// Update Chef Profile
const updateProfile = async (req, res) => {
  const chefId = req.user.id;
  const { bio, cuisine_type, profile_image } = req.body;

  const { data, error } = await supabase
    .from('chef_profile')
    .update({ bio, cuisine_type, profile_image })
    .eq('user_id', chefId)
    .select()
    .single();

  if (error) throw new AppError(error.message, 500);

  res.status(200).json({ success: true, message: 'Profile updated successfully', data });
};

// Get Chef Dishes
const getDishes = async (req, res) => {
  const chefId = req.user.id;

  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('chef_id', chefId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500);

  res.status(200).json({ success: true, data });
};

// Create Dish
const createDish = async (req, res) => {
  const chefId = req.user.id;
  const { name, description, price, category, availability } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new AppError('Dish name is required', 400);
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    throw new AppError('Price must be a valid number greater than 0', 400);
  }

  const { data, error } = await supabase
    .from('dishes')
    .insert({
      chef_id: chefId,
      name: name.trim(),
      description,
      price: parsedPrice,
      category,
      availability: availability ?? true,
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 500);

  res.status(201).json({ success: true, message: 'Dish created successfully', data });
};

// Update Dish
const updateDish = async (req, res) => {
  const chefId = req.user.id;
  const { dishId } = req.params;
  const { name, description, price, category, availability } = req.body;

  const { data, error } = await supabase
    .from('dishes')
    .update({ name, description, price, category, availability })
    .eq('id', dishId)
    .eq('chef_id', chefId)
    .select()
    .single();

  if (error || !data) throw new AppError('Dish not found', 404);

  res.status(200).json({ success: true, message: 'Dish updated successfully', data });
};

// Delete Dish
const deleteDish = async (req, res) => {
  const chefId = req.user.id;
  const { dishId } = req.params;

  const { error } = await supabase
    .from('dishes')
    .delete()
    .eq('id', dishId)
    .eq('chef_id', chefId);

  if (error) throw new AppError('Dish not found', 404);

  res.status(200).json({ success: true, message: 'Dish deleted successfully' });
};

// Get Chef Orders
const getOrders = async (req, res) => {
  const chefId = req.user.id;

  const { data, error } = await supabase
    .from('orders')
    .select('*, users!customer_id(name, email)')
    .eq('chef_id', chefId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500);

  // Flatten customer info
  const orders = data.map((o) => ({
    ...o,
    customer_name: o.users?.name,
    customer_email: o.users?.email,
    users: undefined,
  }));

  res.status(200).json({ success: true, data: orders });
};

// Accept Order
const acceptOrder = async (req, res) => {
  const chefId = req.user.id;
  const { orderId } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'accepted' })
    .eq('id', orderId)
    .eq('chef_id', chefId)
    .select()
    .single();

  if (error || !data) throw new AppError('Order not found', 404);

  res.status(200).json({ success: true, message: 'Order accepted', data });
};

// Reject Order
const rejectOrder = async (req, res) => {
  const chefId = req.user.id;
  const { orderId } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'rejected' })
    .eq('id', orderId)
    .eq('chef_id', chefId)
    .select()
    .single();

  if (error || !data) throw new AppError('Order not found', 404);

  res.status(200).json({ success: true, message: 'Order rejected', data });
};

// Complete Order
const completeOrder = async (req, res) => {
  const chefId = req.user.id;
  const { orderId } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', orderId)
    .eq('chef_id', chefId)
    .select()
    .single();

  if (error || !data) throw new AppError('Order not found', 404);

  res.status(200).json({ success: true, message: 'Order completed', data });
};

// Get Chef Dashboard
const getDashboard = async (req, res) => {
  const chefId = req.user.id;

  const [
    { count: totalOrders },
    { data: revenueData },
    { count: completedOrders },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('chef_id', chefId),
    supabase.from('orders').select('total_amount').eq('chef_id', chefId).eq('status', 'completed'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('chef_id', chefId).eq('status', 'completed'),
  ]);

  const totalRevenue = (revenueData || []).reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  res.status(200).json({
    success: true,
    data: {
      totalOrders: totalOrders || 0,
      totalRevenue,
      completedOrders: completedOrders || 0,
    },
  });
};

// Upload Chef Profile Image
const uploadProfileImage = async (req, res) => {
  const chefId = req.user.id;
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
  const fileName = `chef_${chefId}_${Date.now()}.${fileExtension}`;

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_CHEFS || 'chef-images';

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
    .from('chef_profile')
    .update({ profile_image: publicUrl })
    .eq('user_id', chefId)
    .select()
    .single();

  if (dbError) throw new AppError(dbError.message, 500);

  res.status(200).json({
    success: true,
    message: 'Profile image uploaded successfully',
    data: { profile_image: publicUrl, profile },
  });
};

// Upload Dish Image
const uploadDishImage = async (req, res) => {
  const chefId = req.user.id;
  const { dishId } = req.params;
  const { imageBase64 } = req.body;

  if (!imageBase64) throw new AppError('Image data is required', 400);

  // Verify ownership of the dish
  const { data: dish, error: findError } = await supabase
    .from('dishes')
    .select('id')
    .eq('id', dishId)
    .eq('chef_id', chefId)
    .single();

  if (findError || !dish) throw new AppError('Dish not found or unauthorized', 404);

  let contentType = 'image/png';
  let base64Data = imageBase64;

  if (imageBase64.includes(';base64,')) {
    const parts = imageBase64.split(';base64,');
    contentType = parts[0].replace('data:', '');
    base64Data = parts[1];
  }

  const buffer = Buffer.from(base64Data, 'base64');
  const fileExtension = contentType.split('/')[1] || 'png';
  const fileName = `dish_${dishId}_${Date.now()}.${fileExtension}`;

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_DISHES || 'dish-images';

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

  const { data: updatedDish, error: dbError } = await supabase
    .from('dishes')
    .update({ image_url: publicUrl })
    .eq('id', dishId)
    .select()
    .single();

  if (dbError) throw new AppError(dbError.message, 500);

  res.status(200).json({
    success: true,
    message: 'Dish image uploaded successfully',
    data: { image_url: publicUrl, dish: updatedDish },
  });
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
  getDashboard,
  uploadProfileImage,
  uploadDishImage,
};
