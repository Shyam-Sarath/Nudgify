const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Supabase Admin Client - full DB access, bypasses RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: fetch,
      headers: { 'x-my-custom-header': 'nudgify' }
    },
    realtime: {
      transport: require('ws')
    }
  }
);

// Test connection via REST
(async () => {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = table doesn't exist yet (before migration) — that's OK
      if (error.message.includes('relation "users" does not exist')) {
        console.warn('⚠️  Database tables not yet created. Run migration SQL in Supabase SQL editor.');
      } else {
        console.error('❌ Supabase connection error:', error.message);
      }
    } else {
      console.log('✅ Supabase connected successfully');
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
})();

module.exports = supabase;
