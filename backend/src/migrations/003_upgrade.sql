-- ============================================================
-- NUDGIFY MVP - Production Upgrade (Categories, Chat, Profiles)
-- ============================================================

-- 1. Add profile_image to users table for customers (and chefs to mirror)
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed basic categories if empty
INSERT INTO categories (name) VALUES
  ('Burgers'),
  ('Pizza'),
  ('Healthy'),
  ('Desserts'),
  ('Drinks')
ON CONFLICT (name) DO NOTHING;

-- 3. Create Messages Table for Two-Way Chat
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Indexes for Chat Performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
