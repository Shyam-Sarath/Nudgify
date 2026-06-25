const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Place Order
const placeOrder = async (req, res) => {
  const customerId = req.user.id;
  const { chefId, items, deliveryAddress, specialInstructions } = req.body;

  if (!chefId || !items || items.length === 0) {
    throw new AppError('Invalid order data', 400);
  }

  // Server-side price verification — fetch real prices from DB
  const dishIds = items.map((i) => i.dishId);
  const { data: dbDishes, error: dishErr } = await supabase
    .from('dishes')
    .select('id, price, availability')
    .in('id', dishIds);

  if (dishErr) throw new AppError('Failed to verify dish prices', 500);

  // Build a price map
  const priceMap = {};
  for (const dish of dbDishes) {
    if (!dish.availability) throw new AppError(`Dish ID ${dish.id} is no longer available`, 400);
    priceMap[dish.id] = parseFloat(dish.price);
  }

  // Calculate authoritative server-side total
  const DELIVERY_FEE = 4.5;
  const TAX_RATE = 0.08;
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = priceMap[item.dishId];
    if (!unitPrice) throw new AppError(`Dish ID ${item.dishId} not found`, 400);
    return sum + unitPrice * item.quantity;
  }, 0);
  const serverTotal = parseFloat((subtotal + DELIVERY_FEE + subtotal * TAX_RATE).toFixed(2));

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      chef_id: chefId,
      total_amount: serverTotal,
      status: 'pending',
      delivery_address: deliveryAddress,
      special_instructions: specialInstructions,
    })
    .select()
    .single();

  if (orderError) throw new AppError(orderError.message, 500);

  // Create order items with server-validated prices
  const orderItems = items.map((item) => ({
    order_id: order.id,
    dish_id: item.dishId,
    quantity: item.quantity,
    price: priceMap[item.dishId],
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    // Rollback: delete the order
    await supabase.from('orders').delete().eq('id', order.id);
    throw new AppError('Failed to create order items', 500);
  }

  res.status(201).json({ success: true, message: 'Order placed successfully', data: { ...order, total_amount: serverTotal } });
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
