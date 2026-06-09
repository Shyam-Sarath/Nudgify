const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '15m' }
  );
};

// Register User
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new AppError('All fields are required', 400);
  }

  if (!['customer', 'chef'].includes(role)) {
    throw new AppError('Invalid role. Must be customer or chef', 400);
  }

  // Check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    throw new AppError('User already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const { data: user, error } = await supabase
    .from('users')
    .insert({ name, email, password: hashedPassword, role })
    .select('id, email, role')
    .single();

  if (error) throw new AppError(error.message, 500);

  // If chef, create chef profile
  if (role === 'chef') {
    await supabase.from('chef_profile').insert({ user_id: user.id });
  }

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, token },
  });
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new AppError('Invalid credentials', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
      token,
    },
  });
};

// Refresh Token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newToken = generateToken(decoded);
    res.status(200).json({ success: true, data: { token: newToken } });
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }
};

// Logout
const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logout successful' });
};

module.exports = { register, login, refreshToken, logout };
