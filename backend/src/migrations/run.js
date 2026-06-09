const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function runMigration() {
  const schemaPath = path.join(__dirname, '001_create_schema.sql');
  console.log(`Reading schema from: ${schemaPath}`);
  
  // Try direct host first, or pooler if configured. Let's check environment
  const directHost = 'db.ludedzyuwnsurxsmahli.supabase.co';
  const pool = new Pool({
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    host: directHost,
    port: 5432,
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Running schema migrations...');
    await pool.query(schemaSql);
    console.log('✅ Migrations completed successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
