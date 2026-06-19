/**
 * Nudgify — Supabase Storage Bucket Setup Script
 *
 * Run this ONCE after creating your Supabase project to provision
 * the required storage buckets for chef and dish images.
 *
 * Usage:
 *   node scripts/setup-storage.js
 *
 * Requirements:
 *   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env
 *   The service role key (NOT the anon key) is required to create buckets.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Detect if the service role key is actually the anon key (same prefix)
// Anon keys have role: "anon", service role keys have role: "service_role"
try {
  const payload = JSON.parse(Buffer.from(SUPABASE_SERVICE_ROLE_KEY.split('.')[1], 'base64').toString());
  if (payload.role !== 'service_role') {
    console.warn('⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY appears to be the anon key (role="anon").');
    console.warn('   Bucket creation may fail. Get the service_role key from:');
    console.warn('   Supabase Dashboard → Project Settings → API → service_role secret\n');
  }
} catch {
  // ignore decode errors
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  realtime: {
    transport: require('ws')
  }
});

const BUCKETS = [
  {
    name: process.env.SUPABASE_STORAGE_BUCKET_CHEFS || 'chef-images',
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  {
    name: process.env.SUPABASE_STORAGE_BUCKET_DISHES || 'dish-images',
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
];

async function setupStorage() {
  console.log('🪣  Nudgify Storage Bucket Setup\n');

  for (const bucket of BUCKETS) {
    process.stdout.write(`  Creating bucket "${bucket.name}"... `);

    // Check if already exists
    const { data: existing } = await supabase.storage.getBucket(bucket.name);
    if (existing) {
      console.log('⏭️  already exists, skipping.');
      continue;
    }

    const { data, error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit,
      allowedMimeTypes: bucket.allowedMimeTypes,
    });

    if (error) {
      console.log(`❌ FAILED: ${error.message}`);
    } else {
      console.log(`✅ created (public=${bucket.public})`);
    }
  }

  console.log('\n✅ Storage setup complete!');
  console.log('   Public URLs will be formatted as:');
  console.log(`   ${SUPABASE_URL}/storage/v1/object/public/<bucket-name>/<filename>`);
}

setupStorage().catch((err) => {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
});
