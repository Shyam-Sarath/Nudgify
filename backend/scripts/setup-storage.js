require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    realtime: {
      transport: require('ws')
    }
  }
);

async function setupStorage() {
  const buckets = ['profile-images', 'dish-images'];

  for (const bucketName of buckets) {
    try {
      const { data, error } = await supabase.storage.getBucket(bucketName);
      
      if (error && error.message.includes('Bucket not found')) {
        console.log(`Creating bucket: ${bucketName}`);
        const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (createError) {
          console.error(`Failed to create bucket ${bucketName}:`, createError.message);
        } else {
          console.log(`✅ Bucket ${bucketName} created successfully.`);
        }
      } else if (error) {
        console.error(`Error checking bucket ${bucketName}:`, error.message);
      } else {
        console.log(`✅ Bucket ${bucketName} already exists.`);
      }
    } catch (err) {
      console.error(`Unexpected error with bucket ${bucketName}:`, err.message);
    }
  }
}

setupStorage();
