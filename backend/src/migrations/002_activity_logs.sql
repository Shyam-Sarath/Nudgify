-- ============================================================
-- NUDGIFY MVP - Activity Logs Table Migration
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Create Activity Logs Table (if it wasn't created in the first migration)
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER,
  action VARCHAR(255) NOT NULL,
  target_type VARCHAR(100),
  target_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);
