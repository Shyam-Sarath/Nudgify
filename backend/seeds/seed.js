require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const password = await bcrypt.hash('Password123!', 10);

    // Insert admin
    const adminRes = await client.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id`,
      ['Admin User', 'admin@nudgify.test', password, 'admin']
    );

    // Insert chef
    const chefRes = await client.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id`,
      ['Chef Alice', 'chef.alice@nudgify.test', password, 'chef']
    );

    const chefId = chefRes.rows[0].id;

    // Insert customer
    const customerRes = await client.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id`,
      ['Customer Bob', 'customer.bob@nudgify.test', password, 'customer']
    );

    // Insert chef profile
    await client.query(
      `INSERT INTO chef_profile (user_id, bio, cuisine_type, profile_image) VALUES ($1,$2,$3,$4)`,
      [chefId, 'Home chef specializing in Italian and fusion.', 'Italian', 'https://placehold.co/256']
    );

    // Insert sample dishes
    await client.query(
      `INSERT INTO dishes (chef_id, name, description, price, category, availability, image_url) VALUES
      ($1,$2,$3,$4,$5,$6,$7)`,
      [chefId, 'Spaghetti Carbonara', 'Classic creamy carbonara with pancetta.', 12.5, 'Pasta', true, 'https://placehold.co/400']
    );

    await client.query('COMMIT');
    console.log('✅ Seed data inserted successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
  } finally {
    client.release();
    // close pool after a short delay to allow logs to flush
    setTimeout(() => pool.end(), 500);
  }
}

seed();
