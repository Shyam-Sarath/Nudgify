'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import apiClient from '@/lib/api';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/admin/users');
      // Filter for customers only
      const customerData = res.data.data.filter(u => u.role === 'customer');
      setCustomers(customerData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    // Currently, backend only has 'disableUser'. Assuming active status toggle isn't fully implemented in MVP,
    // but we can call disable. We'll simulate a toggle locally for UI purposes if the backend is read-only for enable.
    try {
      if (currentStatus) {
        await apiClient.put(`/api/admin/users/${userId}/disable`);
        setCustomers(customers.map(c => c.id === userId ? { ...c, active: false } : c));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update status');
    }
  };

  const columns = [
    { label: 'Name', key: 'name', render: (val) => <span className="font-semibold">{val}</span> },
    { label: 'Email', key: 'email' },
    { 
      label: 'Joined Date', 
      key: 'created_at',
      render: (val) => new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    {
      label: 'Status',
      key: 'active',
      render: (val) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (id, row) => (
        <button
          onClick={() => handleToggleStatus(id, row.active)}
          disabled={!row.active}
          className={`text-sm px-3 py-1 rounded-lg font-medium transition ${
            row.active 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Disable
        </button>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-app">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark tracking-tight">Customers</h1>
              <p className="text-gray-500 mt-1">Manage all registered customers</p>
            </div>
          </div>

          <Table columns={columns} data={customers} loading={loading} />
        </div>
      </main>
    </div>
  );
}
