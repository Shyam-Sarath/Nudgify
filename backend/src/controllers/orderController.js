const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Place Order
const placeOrder = async (req, res) => {
  const customerId = req.user.id;
  const { chefId, items, totalAmount } = req.body;

  if (!chefId || !items || items.length === 0 || !totalAmount) {
    throw new AppError('Invalid order data', 400);
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ customer_id: customerId, chef_id: chefId, total_amount: totalAmount, status: 'pending' })
    .select()
    .single();

  if (orderError) throw new AppError(orderError.message, 500);

  // Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    dish_id: item.dishId,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    // Rollback: delete the order
    await supabase.from('orders').delete().eq('id', order.id);
    throw new AppError('Failed to create order items', 500);
  }

  res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
};

// Get Order By ID
const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) throw new AppError('Order not found', 404);

  if (order.customer_id !== userId && order.chef_id !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  const { data: items } = await supabase
    .from('order_items')
    .select('*, dishes(name, price)')
    .eq('order_id', orderId);

  res.status(200).json({ success: true, data: { ...order, items: items || [] } });
};

// Get Customer Orders
const getCustomerOrders = async (req, res) => {
  const customerId = req.user.id;

  const { data, error } = await supabase
    .from('orders')
    .select('*, users!chef_id(name)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500);

  const orders = data.map((o) => ({ ...o, chef_name: o.users?.name, users: undefined }));

  res.status(200).json({ success: true, data: orders });
};

// Get Chef Orders
const getChefOrders = async (req, res) => {
  const chefId = req.user.id;

  const { data, error } = await supabase
    .from('orders')
    .select('*, users!customer_id(name)')
    .eq('chef_id', chefId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500);

  const orders = data.map((o) => ({ ...o, customer_name: o.users?.name, users: undefined }));

  res.status(200).json({ success: true, data: orders });
};

module.exports = { placeOrder, getOrderById, getCustomerOrders, getChefOrders };
