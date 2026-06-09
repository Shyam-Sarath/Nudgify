require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { 
    auth: { persistSession: false },
    realtime: { transport: require('ws') }
  }
);

async function seed() {
  try {
    console.log('🌱 Starting seed...');
    const password = await bcrypt.hash('Password123!', 10);
    const admin123Hashed = await bcrypt.hash('admin123', 10);

    // Insert admin (com)
    const { data: adminCom, error: adminComErr } = await supabase
      .from('users')
      .insert({ name: 'Admin User', email: 'admin@nudgify.com', password: admin123Hashed, role: 'admin' })
      .select('id')
      .single();
    if (adminComErr && !adminComErr.message.includes('duplicate key value')) {
      throw new Error(`Admin (com) insert failed: ${adminComErr.message}`);
    }
    if (adminCom) console.log('✅ Admin (com) created:', adminCom.id);

    // Insert admin (test)
    const { data: admin, error: adminErr } = await supabase
      .from('users')
      .insert({ name: 'Admin Test', email: 'admin@nudgify.test', password, role: 'admin' })
      .select('id')
      .single();
    if (adminErr && !adminErr.message.includes('duplicate key value')) {
      throw new Error(`Admin insert failed: ${adminErr.message}`);
    }
    if (admin) console.log('✅ Admin created:', admin.id);

    // Insert chef
    const { data: chef, error: chefErr } = await supabase
      .from('users')
      .insert({ name: 'Chef Alice', email: 'chef.alice@nudgify.test', password, role: 'chef' })
      .select('id')
      .single();
    if (chefErr) throw new Error(`Chef insert failed: ${chefErr.message}`);
    console.log('✅ Chef created:', chef.id);

    // Insert customer
    const { data: customer, error: custErr } = await supabase
      .from('users')
      .insert({ name: 'Customer Bob', email: 'customer.bob@nudgify.test', password, role: 'customer' })
      .select('id')
      .single();
    if (custErr) throw new Error(`Customer insert failed: ${custErr.message}`);
    console.log('✅ Customer created:', customer.id);

    // Insert chef profile
    const { error: profileErr } = await supabase.from('chef_profile').insert({
      user_id: chef.id,
      bio: 'Home chef specializing in Italian and fusion.',
      cuisine_type: 'Italian',
      profile_image: 'https://placehold.co/256',
      is_active: true,
    });
    if (profileErr) throw new Error(`Chef profile insert failed: ${profileErr.message}`);
    console.log('✅ Chef profile created');

    // Insert sample dish
    const { data: dish, error: dishErr } = await supabase.from('dishes').insert({
      chef_id: chef.id,
      name: 'Spaghetti Carbonara',
      description: 'Classic creamy carbonara with pancetta.',
      price: 12.50,
      category: 'Pasta',
      availability: true,
      image_url: 'https://placehold.co/400',
    }).select('id').single();
    if (dishErr) throw new Error(`Dish insert failed: ${dishErr.message}`);
    console.log('✅ Dish created:', dish.id);

    // Insert sample order
    const { data: order, error: orderErr } = await supabase.from('orders').insert({
      customer_id: customer.id,
      chef_id: chef.id,
      total_amount: 25.00,
      status: 'completed',
    }).select('id').single();
    if (orderErr) throw new Error(`Order insert failed: ${orderErr.message}`);

    await supabase.from('order_items').insert({
      order_id: order.id,
      dish_id: dish.id,
      quantity: 2,
      price: 12.50,
    });
    console.log('✅ Order + order item created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:    admin@nudgify.test / Password123!');
    console.log('Chef:     chef.alice@nudgify.test / Password123!');
    console.log('Customer: customer.bob@nudgify.test / Password123!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
