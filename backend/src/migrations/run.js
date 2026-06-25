const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function runMigration() {
  const schemaPath = path.join(__dirname, '001_create_schema.sql');
  console.log(`Reading schema from: ${schemaPath}`);
  
  // Try pooler credentials configured in .env, falling back to direct host if needed
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'db.ludedzyuwnsurxsmahli.supabase.co',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    database: process.env.DB_NAME || 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const migrations = ['001_create_schema.sql', '002_activity_logs.sql', '003_upgrade.sql'];
    for (const file of migrations) {
      const filePath = path.join(__dirname, file);
      console.log(`Running migration: ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      await pool.query(sql);
    }
    console.log('✅ Migrations completed successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
