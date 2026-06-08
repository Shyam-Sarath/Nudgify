const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

/**
 * Supabase Auth Client - For user authentication
 * Uses anon key for client-side auth operations
 */
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

/**
 * Supabase Admin Client - For server-side admin operations
 * Uses service role key for full database access
 */
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

module.exports = {
  supabaseAuth,
  supabaseAdmin,
  getSupabaseClient: (isAdmin = false) => isAdmin ? supabaseAdmin : supabaseAuth,
};
