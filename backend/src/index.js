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
    // #region agent log
    fetch('http://127.0.0.1:7325/ingest/ec45b7eb-196d-4933-afd3-e540532f9309',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'78bd0c'},body:JSON.stringify({sessionId:'78bd0c',runId:'initial',hypothesisId:'C',location:'backend/src/index.js:listen',message:'Backend server started',data:{port:PORT,corsOrigin:process.env.CORS_ORIGIN||'*'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
