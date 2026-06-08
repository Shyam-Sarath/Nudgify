const pool = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Place Order
const placeOrder = async (req, res) => {
  const customerId = req.user.id;
  const { chefId, items, totalAmount } = req.body;

  if (!chefId || !items || items.length === 0 || !totalAmount) {
    throw new AppError('Invalid order data', 400);
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (customer_id, chef_id, total_amount, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [customerId, chefId, totalAmount, 'pending']
    );

    const order = orderResult.rows[0];

    // Add order items
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, dish_id, quantity) VALUES ($1, $2, $3)',
        [order.id, item.dishId, item.quantity]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Get Order By ID
const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const order = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);

    if (order.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    const orderData = order.rows[0];

    // Check authorization
    if (orderData.customer_id !== userId && orderData.chef_id !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    const items = await pool.query(
      `SELECT oi.*, d.name, d.price FROM order_items oi 
       JOIN dishes d ON oi.dish_id = d.id 
       WHERE oi.order_id = $1`,
      [orderId]
    );

    res.status(200).json({
      success: true,
      data: {
        ...orderData,
        items: items.rows
      }
    });
  } catch (error) {
    throw error;
  }
};

// Get Customer Orders
const getCustomerOrders = async (req, res) => {
  const customerId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT o.*, u.name as chef_name 
       FROM orders o 
       JOIN users u ON o.chef_id = u.id 
       WHERE o.customer_id = $1 
       ORDER BY o.created_at DESC`,
      [customerId]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    throw error;
  }
};

// Get Chef Orders
const getChefOrders = async (req, res) => {
  const chefId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT o.*, u.name as customer_name 
       FROM orders o 
       JOIN users u ON o.customer_id = u.id 
       WHERE o.chef_id = $1 
       ORDER BY o.created_at DESC`,
      [chefId]
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
  placeOrder,
  getOrderById,
  getCustomerOrders,
  getChefOrders
};
