const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Get Dashboard Overview
const getDashboard = async (req, res) => {
  const [
    { count: totalCustomers },
    { count: totalChefs },
    { count: totalOrders },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'chef'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').eq('status', 'completed'),
  ]);

  const totalRevenue = (revenueData || []).reduce(
    (sum, o) => sum + parseFloat(o.total_amount || 0),
    0
  );

  res.status(200).json({
    success: true,
    data: {
      totalCustomers: totalCustomers || 0,
      totalChefs: totalChefs || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
    },
  });
};

// Get All Users
const getAllUsers = async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, active, created_at')
    .order('created_at', { ascending: false });

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
    .select('id, name, email, active')
    .single();

  if (error || !data) throw new AppError('User not found', 404);

  res.status(200).json({ success: true, message: 'User disabled', data });
};

// Get All Chefs
const getAllChefs = async (req, res) => {
  const { data, error } = await supabase
    .from('chef_profile')
    .select('*, users(name, email)')
    .order('created_at', { ascending: false });

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

  const [{ count: totalOrders }, { data: revenueData }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('chef_id', chefId),
    supabase.from('orders').select('total_amount').eq('chef_id', chefId).eq('status', 'completed'),
  ]);

  const totalRevenue = (revenueData || []).reduce(
    (sum, o) => sum + parseFloat(o.total_amount || 0),
    0
  );

  res.status(200).json({
    success: true,
    data: {
      ...chef,
      name: chef.users?.name,
      email: chef.users?.email,
      users: undefined,
      totalOrders: totalOrders || 0,
      totalRevenue,
    },
  });
};

// Get All Orders
const getOrders = async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customer:users!customer_id(name), chef:users!chef_id(name)')
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500);

  const orders = data.map((o) => ({
    ...o,
    customer_name: o.customer?.name,
    chef_name: o.chef?.name,
    customer: undefined,
    chef: undefined,
  }));

  res.status(200).json({ success: true, data: orders });
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

  const analytics = Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));

  res.status(200).json({ success: true, data: analytics });
};

module.exports = {
  getDashboard,
  getAllUsers,
  getUserDetail,
  disableUser,
  getAllChefs,
  getChefDetail,
  getOrders,
  getDailyAnalytics,
};
