const axios = require('axios');

const API_URL = 'http://localhost:5001';

async function testApi() {
  console.log('--- STARTING API AUDIT ---');
  let token = null;

  try {
    console.log('1. Testing Login with valid customer...');
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'customer.bob@nudgify.test',
      password: 'Password123!'
    });
    token = res.data.data.token;
    console.log('✅ Login successful. Token received.');
  } catch (err) {
    console.error('❌ Login failed:', err.response?.data || err.message);
    return;
  }

  try {
    console.log('\n2. Testing Customer Orders endpoint (requires auth)...');
    const res = await axios.get(`${API_URL}/api/order/customer`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Customer Orders successful. Found ${res.data.data?.length || 0} orders.`);
  } catch (err) {
    console.error('❌ Customer Orders failed:', err.response?.data || err.message);
  }

  try {
    console.log('\n3. Testing Chef Browse endpoint...');
    const res = await axios.get(`${API_URL}/api/chef`);
    console.log(`✅ Chef Browse successful. Found ${res.data.data?.length || 0} chefs.`);
  } catch (err) {
    console.error('❌ Chef Browse failed:', err.response?.data || err.message);
  }

  console.log('\n--- END API AUDIT ---');
}

testApi();
