require('dotenv').config();

const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'PORT'
];

console.log('🔍 Checking Environment Variables...');
let missing = [];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missing.push(envVar);
  }
}

if (missing.length > 0) {
  console.error('❌ Missing the following environment variables:');
  missing.forEach(v => console.error(`   - ${v}`));
  process.exit(1);
}

// Check for correct service role key
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
try {
  const payload = JSON.parse(Buffer.from(serviceKey.split('.')[1], 'base64').toString());
  if (payload.role !== 'service_role') {
    console.warn('⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY appears to be the anon key (role="anon").');
    console.warn('   This will cause issues bypassing RLS or creating buckets.');
    console.warn('   Get the service_role key from: Supabase Dashboard → Project Settings → API → service_role secret\n');
  } else {
    console.log('✅ Service role key verified.');
  }
} catch {
  console.warn('⚠️  WARNING: Could not parse SUPABASE_SERVICE_ROLE_KEY to verify role.');
}

console.log('✅ All required environment variables are present.');
