const axios = require('axios');
const API_URL = 'http://localhost:5001';

async function testAllApis() {
  console.log('--- STARTING COMPREHENSIVE API AUDIT ---\n');
  let customerToken = null;
  let chefToken = null;

  // 1. Auth Login (Customer)
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'customer.bob@nudgify.test',
      password: 'Password123!'
    });
    customerToken = res.data.data.token;
    console.log('✅ Customer Login successful.');
  } catch (err) {
    console.error('❌ Customer Login failed:', err.response?.data || err.message);
  }

  // 2. Auth Login (Chef)
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'chef.alice@nudgify.test',
      password: 'Password123!'
    });
    chefToken = res.data.data.token;
    console.log('✅ Chef Login successful.');
  } catch (err) {
    console.error('❌ Chef Login failed:', err.response?.data || err.message);
  }

  // 3. Customer Routes
  if (customerToken) {
    const headers = { Authorization: `Bearer ${customerToken}` };
    try {
      const res = await axios.get(`${API_URL}/api/customer/profile`, { headers });
      console.log('✅ Customer Profile GET successful.');
    } catch (err) { console.error('❌ Customer Profile GET failed:', err.response?.data?.message); }

    try {
      const res = await axios.get(`${API_URL}/api/customer/chefs`, { headers });
      console.log('✅ Customer Chefs GET successful.');
    } catch (err) { console.error('❌ Customer Chefs GET failed:', err.response?.data?.message); }
    
    try {
      const res = await axios.get(`${API_URL}/api/order/customer`, { headers });
      console.log('✅ Customer Orders GET successful.');
    } catch (err) { console.error('❌ Customer Orders GET failed:', err.response?.data?.message); }
  }

  // 4. Chef Routes
  if (chefToken) {
    const headers = { Authorization: `Bearer ${chefToken}` };
    try {
      const res = await axios.get(`${API_URL}/api/chef/profile`, { headers });
      console.log('✅ Chef Profile GET successful.');
    } catch (err) { console.error('❌ Chef Profile GET failed:', err.response?.data?.message); }

    try {
      const res = await axios.get(`${API_URL}/api/chef/dishes`, { headers });
      console.log('✅ Chef Dishes GET successful.');
    } catch (err) { console.error('❌ Chef Dishes GET failed:', err.response?.data?.message); }

    try {
      const res = await axios.get(`${API_URL}/api/chef/dashboard`, { headers });
      console.log('✅ Chef Dashboard GET successful.');
    } catch (err) { console.error('❌ Chef Dashboard GET failed:', err.response?.data?.message); }
    
    try {
      const res = await axios.get(`${API_URL}/api/chef/orders`, { headers });
      console.log('✅ Chef Orders GET successful.');
    } catch (err) { console.error('❌ Chef Orders GET failed:', err.response?.data?.message); }
  }

  console.log('\n--- END API AUDIT ---');
}

testAllApis();
