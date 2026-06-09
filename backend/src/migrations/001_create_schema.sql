-- ============================================================
-- NUDGIFY MVP - Full Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','chef','admin')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Chef Profile Table
CREATE TABLE IF NOT EXISTS chef_profile (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  bio TEXT,
  cuisine_type VARCHAR(100),
  profile_image VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  rating FLOAT DEFAULT 5.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Dishes Table
CREATE TABLE IF NOT EXISTS dishes (
  id SERIAL PRIMARY KEY,
  chef_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  availability BOOLEAN DEFAULT true,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chef_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  chef_id INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','completed')),
  delivery_address TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (chef_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  dish_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_chef_profile_user_id ON chef_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_chef_profile_active ON chef_profile(is_active);
CREATE INDEX IF NOT EXISTS idx_dishes_chef_id ON dishes(chef_id);
CREATE INDEX IF NOT EXISTS idx_dishes_availability ON dishes(availability);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_chef_id ON orders(chef_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
