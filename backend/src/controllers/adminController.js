const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const bcrypt = require('bcryptjs');

const logAdminAction = async (adminId, action, targetType = null, targetId = null, details = {}) => {
  try {
    await supabase.from('activity_logs').insert({
      admin_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error.message || error);
  }
};

// Create Chef (admin) - creates a Supabase Auth user, inserts users row, chef_profile, and uploads profile image
const createChef = async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    cuisine_type,
    bio,
    profileImageBase64,
  } = req.body;

  if (!name || !email || !password) throw new AppError('Name, email and password are required', 400);

  const bucket = process.env.SUPABASE_STORAGE_BUCKET_CHEFS || 'chef-images';

  let createdUser = null;
  let createdProfile = null;
  let uploadedPath = null;

  try {
    // 1) Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      throw new AppError('User with this email already exists', 409);
    }

    // 2) Insert into users table (store hashed password to keep parity with seed)
    const hashed = await bcrypt.hash(password, 10);
    const { data: userInsert, error: userErr } = await supabase
      .from('users')
      .insert({ name, email, password: hashed, role: 'chef', active: true })
      .select('id')
      .single();

    if (userErr || !userInsert) throw new AppError(`User insert failed: ${userErr?.message || 'unknown'}`, 500);
    createdUser = userInsert;

    // 3) Create chef_profile (prepare profile_image after upload)
    let profileImageUrl = null;
    if (profileImageBase64) {
      // upload buffer
      const matches = profileImageBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      let buffer = null;
      let contentType = 'image/jpeg';
      let base64Data = profileImageBase64;
      if (matches) {
        contentType = matches[1];
        base64Data = matches[2];
      }
      buffer = Buffer.from(base64Data, 'base64');
      const filePath = `chefs/${createdUser.id}/${Date.now()}_profile.jpg`;
      const { data: uploadData, error: uploadErr } = await supabase.storage.from(bucket).upload(filePath, buffer, {
        contentType,
        upsert: false,
      });
      if (uploadErr) throw new AppError(`Image upload failed: ${uploadErr.message}`, 500);
      uploadedPath = filePath;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      profileImageUrl = urlData?.publicUrl || urlData?.publicURL || null;
    }

    const { data: profileInsert, error: profileErr } = await supabase.from('chef_profile').insert({
      user_id: createdUser.id,
      bio: bio || null,
      cuisine_type: cuisine_type || null,
      profile_image: profileImageUrl,
      is_active: true,
    }).select('*').single();

    if (profileErr) throw new AppError(`Chef profile insert failed: ${profileErr.message}`, 500);
    createdProfile = profileInsert;

    await logAdminAction(req.user.id, 'Added chef', 'chef', createdUser.id, {
      name,
      email,
      cuisine_type,
      bio,
      profile_image: profileImageUrl,
    });

    return res.status(201).json({ success: true, data: { user: createdUser, profile: createdProfile } });
  } catch (err) {
    // Rollback in case of partial success
    try {
      if (createdProfile) {
        await supabase.from('chef_profile').delete().eq('id', createdProfile.id);
      }
      if (createdUser) {
        await supabase.from('users').delete().eq('id', createdUser.id);
      }
      if (uploadedPath) {
        try { await supabase.storage.from(bucket).remove([uploadedPath]); } catch (e) { /* ignore */ }
      }
    } catch (cleanupErr) {
      console.error('Cleanup error:', cleanupErr.message);
    }

    console.error('Create chef error:', err.message || err);
    throw err instanceof AppError ? err : new AppError(err.message || 'Failed to create chef', 500);
  }
};


// Get Dashboard Overview
const getDashboard = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  const [
    { count: totalCustomers },
    { count: totalChefs },
    { count: totalOrders },
    { data: revenueData },
    { count: todaysOrders },
    { data: todaysRevenueData },
    { count: pendingOrders },
    { count: completedOrders },
    { count: rejectedOrders },
    { count: disabledChefs },
    { count: totalDishes },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'chef'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').eq('status', 'completed'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00Z`).lt('created_at', `${today}T23:59:59Z`),
    supabase.from('orders').select('total_amount').gte('created_at', `${today}T00:00:00Z`).lt('created_at', `${today}T23:59:59Z`).eq('status', 'completed'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('chef_profile').select('*', { count: 'exact', head: true }).eq('is_active', false),
    supabase.from('dishes').select('*', { count: 'exact', head: true }),
  ]);

  const totalRevenue = (revenueData || []).reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const todaysRevenue = (todaysRevenueData || []).reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  res.status(200).json({
    success: true,
    data: {
      totalCustomers: totalCustomers || 0,
      totalChefs: totalChefs || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      todaysOrders: todaysOrders || 0,
      todaysRevenue,
      pendingOrders: pendingOrders || 0,
      completedOrders: completedOrders || 0,
      rejectedOrders: rejectedOrders || 0,
      disabledChefs: disabledChefs || 0,
      pendingChefApprovals: disabledChefs || 0,
      totalDishes: totalDishes || 0,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
    },
  });
};

// Get All Users
const getAllUsers = async (req, res) => {
  const { role, search, page = 1, limit = 20, active } = req.query;
  let query = supabase
    .from('users')
    .select('id, name, email, role, active, created_at')
    .order('created_at', { ascending: false });

  if (role) {
    query = query.eq('role', role);
  }

  if (active !== undefined) {
    const activeValue = active === 'true';
    query = query.eq('active', activeValue);
  }

  if (search) {
    const searchValue = `%${search}%`;
    query = query.or(`name.ilike.${searchValue},email.ilike.${searchValue}`);
  }

  const offset = (Number(page) - 1) * Number(limit);
  const { data, error } = await query.range(offset, offset + Number(limit) - 1);

  if (error) throw new AppError(error.message, 500);

  res.status(200).json({ success: true, data });
};

// Get User Detail
const getUserDetail = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, active, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) throw new AppError('User not found', 404);

  res.status(200).json({ success: true, data });
};

// Disable User
const disableUser = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('users')
    .update({ active: false })
    .eq('id', userId)
    .select('id, name, email, active, role')
    .single();

  if (error || !data) throw new AppError('User not found', 404);

  // If the user is a chef, also deactivate their chef profile
  if (data.role === 'chef') {
    await supabase
      .from('chef_profile')
      .update({ is_active: false })
      .eq('user_id', userId);
  }

  await logAdminAction(req.user.id, 'Disabled user', data.role, userId, {
    name: data.name,
    email: data.email,
  });

  res.status(200).json({ success: true, message: 'User disabled', data });
};

// Enable User
const enableUser = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('users')
    .update({ active: true })
    .eq('id', userId)
    .select('id, name, email, active, role')
    .single();

  if (error || !data) throw new AppError('User not found', 404);

  if (data.role === 'chef') {
    await supabase
      .from('chef_profile')
      .upsert({ user_id: userId, is_active: true }, { onConflict: 'user_id' });
  }

  await logAdminAction(req.user.id, 'Enabled user', data.role, userId, {
    name: data.name,
    email: data.email,
  });

  res.status(200).json({ success: true, message: 'User enabled', data });
};

// Approve Chef
const approveChef = async (req, res) => {
  const { chefId } = req.params;

  const { data, error } = await supabase
    .from('users')
    .update({ active: true })
    .eq('id', chefId)
    .eq('role', 'chef')
    .select('id, name, email, role, active')
    .single();

  if (error || !data) throw new AppError('Chef not found', 404);

  await supabase
    .from('chef_profile')
    .upsert({ user_id: chefId, is_active: true }, { onConflict: 'user_id' });

  await logAdminAction(req.user.id, 'Approved chef', 'chef', chefId, {
    name: data.name,
    email: data.email,
  });

  res.status(200).json({ success: true, message: 'Chef approved', data });
};

// Get All Chefs
const getAllChefs = async (req, res) => {
  const { search, active } = req.query;
  let query = supabase
    .from('chef_profile')
    .select('*, users(name, email)')
    .order('created_at', { ascending: false });

  if (active !== undefined) {
    const activeValue = active === 'true';
    query = query.eq('is_active', activeValue);
  }

  if (search) {
    const searchValue = `%${search}%`;
    query = query.or(`cuisine_type.ilike.${searchValue},bio.ilike.${searchValue},users.name.ilike.${searchValue},users.email.ilike.${searchValue}`);
  }

  const { data, error } = await query;

  if (error) throw new AppError(error.message, 500);

  const chefs = data.map((c) => ({
    ...c,
    name: c.users?.name,
    email: c.users?.email,
    users: undefined,
  }));

  res.status(200).json({ success: true, data: chefs });
};

// Get Chef Detail
const getChefDetail = async (req, res) => {
  const { chefId } = req.params;

  const { data: chef, error } = await supabase
    .from('chef_profile')
    .select('*, users(name, email)')
    .eq('user_id', chefId)
    .single();

  if (error || !chef) throw new AppError('Chef not found', 404);

  const [{ count: totalOrders }, { data: revenueData }, { count: menuCount }, { count: completedOrders }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('chef_id', chefId),
    supabase.from('orders').select('total_amount').eq('chef_id', chefId).eq('status', 'completed'),
    supabase.from('dishes').select('*', { count: 'exact', head: true }).eq('chef_id', chefId),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('chef_id', chefId).eq('status', 'completed'),
  ]);

  const totalRevenue = (revenueData || []).reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const completionRate = totalOrders ? (completedOrders / totalOrders) * 100 : 0;

  res.status(200).json({
    success: true,
    data: {
      ...chef,
      name: chef.users?.name,
      email: chef.users?.email,
      users: undefined,
      totalOrders: totalOrders || 0,
      totalRevenue,
      menuCount: menuCount || 0,
      completionRate: Number(completionRate.toFixed(2)),
    },
  });
};

// Get Activity Logs
const getActivityLogs = async (req, res) => {
  const { page = 1, limit = 25 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const { data, error } = await supabase
    .from('activity_logs')
    .select('id, action, target_type, target_id, details, admin_id, created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  if (error) throw new AppError(error.message, 500);

  res.status(200).json({ success: true, data });
};

// Get All Orders
const getOrders = async (req, res) => {
  const { status, search, page = 1, limit = 25 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('orders')
    .select('*, customer:users!customer_id(name,email), chef:users!chef_id(name,email)')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  if (search) {
    const searchValue = `%${search}%`;
    const numericId = Number(search);
    const searchQueries = [
      `customer.name.ilike.${searchValue}`,
      `customer.email.ilike.${searchValue}`,
      `chef.name.ilike.${searchValue}`,
      `chef.email.ilike.${searchValue}`,
    ];

    if (!Number.isNaN(numericId)) {
      searchQueries.unshift(`id.eq.${numericId}`);
    }

    query = query.or(searchQueries.join(','));
  }

  const { data, error } = await query.range(offset, offset + Number(limit) - 1);

  if (error) throw new AppError(error.message, 500);

  const orders = data.map((o) => ({
    ...o,
    customer_name: o.customer?.name,
    customer_email: o.customer?.email,
    chef_name: o.chef?.name,
    chef_email: o.chef?.email,
    customer: undefined,
    chef: undefined,
  }));

  res.status(200).json({ success: true, data: orders });
};

// Get Admin Dish Catalog
const getAdminDishes = async (req, res) => {
  const { status, search, page = 1, limit = 25 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('dishes')
    .select('*, users!chef_id(name,email)')
    .order('created_at', { ascending: false });

  if (status) {
    const availability = status === 'available';
    query = query.eq('availability', availability);
  }

  if (search) {
    const searchValue = `%${search}%`;
    query = query.or(
      `name.ilike.${searchValue},description.ilike.${searchValue},category.ilike.${searchValue},users.name.ilike.${searchValue}`
    );
  }

  const { data, error } = await query.range(offset, offset + Number(limit) - 1);

  if (error) throw new AppError(error.message, 500);

  const dishes = data.map((dish) => ({
    ...dish,
    chef_name: dish.users?.name,
    chef_email: dish.users?.email,
    users: undefined,
  }));

  res.status(200).json({ success: true, data: dishes });
};

// Update Dish Availability
const updateDishAvailability = async (req, res) => {
  const { dishId } = req.params;
  const { availability } = req.body;

  if (typeof availability !== 'boolean') {
    throw new AppError('Availability must be a boolean', 400);
  }

  const { data, error } = await supabase
    .from('dishes')
    .update({ availability })
    .eq('id', dishId)
    .select()
    .single();

  if (error || !data) throw new AppError('Dish not found', 404);

  await logAdminAction(req.user.id, 'Updated dish availability', 'dish', dishId, { availability });

  res.status(200).json({ success: true, message: 'Dish availability updated', data });
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];

  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid order status', 400);
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error || !data) throw new AppError('Order not found', 404);

  await logAdminAction(req.user.id, 'Updated order status', 'order', orderId, { status });

  res.status(200).json({ success: true, message: 'Order status updated', data });
};

// Get Daily Analytics (last 30 days)
const getDailyAnalytics = async (req, res) => {
  // Fetch orders from last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: true });

  if (error) throw new AppError(error.message, 500);

  // Group by date in JS
  const grouped = {};
  (data || []).forEach((order) => {
    const date = order.created_at.substring(0, 10); // YYYY-MM-DD
    if (!grouped[date]) grouped[date] = { date, orders: 0, revenue: 0 };
    grouped[date].orders += 1;
    grouped[date].revenue += parseFloat(order.total_amount || 0);
  });

  const analytics = Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));

  res.status(200).json({ success: true, data: analytics });
};

// Get Comprehensive Reports
const getReports = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch all completed orders from last 30 days
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('created_at, total_amount, chef_id, customer_id')
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo);

    // Revenue Trend (Daily)
    const dailyRevenue = {};
    (recentOrders || []).forEach((o) => {
      const date = o.created_at.substring(0, 10);
      if (!dailyRevenue[date]) dailyRevenue[date] = { date, revenue: 0, orders: 0 };
      dailyRevenue[date].revenue += parseFloat(o.total_amount || 0);
      dailyRevenue[date].orders += 1;
    });

    const revenueTrend = Object.values(dailyRevenue).sort((a, b) => a.date.localeCompare(b.date));

    // Top Chefs
    const chefStats = {};
    (recentOrders || []).forEach((o) => {
      if (!chefStats[o.chef_id]) chefStats[o.chef_id] = { chef_id: o.chef_id, revenue: 0, orders: 0 };
      chefStats[o.chef_id].revenue += parseFloat(o.total_amount || 0);
      chefStats[o.chef_id].orders += 1;
    });

    const topChefsRaw = Object.values(chefStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    
    // Enrich top chefs with names
    const topChefs = await Promise.all(topChefsRaw.map(async (c) => {
      const { data } = await supabase.from('users').select('name').eq('id', c.chef_id).single();
      return { ...c, name: data?.name || 'Unknown' };
    }));

    // Top Dishes
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('dish_id, quantity, dishes(name, category)')
      .limit(1000); // simplify for MVP

    const dishStats = {};
    const cuisineStats = {};

    (orderItems || []).forEach((item) => {
      const name = item.dishes?.name || 'Unknown';
      const cat = item.dishes?.category || 'Uncategorized';
      
      if (!dishStats[name]) dishStats[name] = { name, quantity: 0 };
      dishStats[name].quantity += item.quantity;

      if (!cuisineStats[cat]) cuisineStats[cat] = { name: cat, value: 0 };
      cuisineStats[cat].value += item.quantity;
    });

    const topDishes = Object.values(dishStats).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    const cuisineDistribution = Object.values(cuisineStats);

    res.status(200).json({
      success: true,
      data: {
        revenueTrend,
        topChefs,
        topDishes,
        cuisineDistribution
      }
    });
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// Delete Dish
const deleteDish = async (req, res) => {
  const { dishId } = req.params;

  const { data, error } = await supabase
    .from('dishes')
    .delete()
    .eq('id', dishId)
    .select()
    .single();

  if (error || !data) throw new AppError('Dish not found or could not be deleted', 404);

  await logAdminAction(req.user.id, 'Deleted dish', 'dish', dishId, { name: data.name });

  res.status(200).json({ success: true, message: 'Dish deleted successfully', data });
};

module.exports = {
  getDashboard,
  getAllUsers,
  getUserDetail,
  disableUser,
  enableUser,
  approveChef,
  getAllChefs,
  getChefDetail,
  getActivityLogs,
  getOrders,
  getAdminDishes,
  updateDishAvailability,
  updateOrderStatus,
  getDailyAnalytics,
  createChef,
  getReports,
  deleteDish,
};
