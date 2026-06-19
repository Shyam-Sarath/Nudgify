const supabase = require('./src/config/database');

async function check() {
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  
  const tables = ['users', 'chef_profile', 'dishes', 'orders', 'order_items'];
  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ Table "${table}": error:`, error.message);
    } else {
      console.log(`✅ Table "${table}": exists, count =`, count);
    }
  }
}

check();
