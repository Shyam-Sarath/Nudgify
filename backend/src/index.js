require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Middleware
const { errorHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const chefRoutes = require('./routes/chef');
const customerRoutes = require('./routes/customer');
const dishRoutes = require('./routes/dish');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chatRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware Setup
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to the Nudgify API', version: '1.0.0' });
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chef', chefRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/dish', dishRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/categories', categoryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global Error Handler
app.use(errorHandler);

// Server Setup
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Setup WebSocket Server for Chat
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ server });
  const supabase = require('./config/database');

  // Simple in-memory mapping from userId to WebSocket connection
  const clients = new Map();

  wss.on('connection', (ws, req) => {
    // Basic auth check using query param (in production pass a real token)
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      ws.close();
      return;
    }

    clients.set(userId, ws);

    ws.on('message', async (messageBuffer) => {
      try {
        const data = JSON.parse(messageBuffer.toString());
        if (data.type === 'send_message') {
          // Save message to DB
          const { receiverId, content } = data.payload;
          
          const { data: savedMsg, error } = await supabase
            .from('messages')
            .insert({ sender_id: userId, receiver_id: receiverId, content })
            .select()
            .single();

          if (!error && savedMsg) {
            // Send back to sender for confirmation
            ws.send(JSON.stringify({ type: 'new_message', payload: savedMsg }));
            
            // Forward to receiver if online
            const receiverWs = clients.get(String(receiverId));
            if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
              receiverWs.send(JSON.stringify({ type: 'new_message', payload: savedMsg }));
            }
          }
        }
      } catch (err) {
        console.error('WS Error:', err.message);
      }
    });

    ws.on('close', () => {
      clients.delete(userId);
    });
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Set PORT to a free port and try again.`);
      process.exit(1);
    }

    throw error;
  });
}

module.exports = app;
