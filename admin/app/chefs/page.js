'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import apiClient from '@/lib/api';
import { Search, AlertCircle } from 'lucide-react';

export default function ChefsPage() {
  const router = useRouter();
  const [chefs, setChefs] = useState([]);
  const [filteredChefs, setFilteredChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchChefs();
  }, []);

  useEffect(() => {
    const filtered = chefs.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredChefs(filtered);
  }, [search, chefs]);

  const fetchChefs = async () => {
    try {
      const response = await apiClient.get('/api/admin/chefs');
      setChefs(response.data.data);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableChef = async (userId) => {
    if (!confirm('Are you sure you want to disable this chef?')) return;

    try {
      await apiClient.put(`/api/admin/users/${userId}/disable`);
      fetchChefs();
    } catch (error) {
      alert('Error disabling chef');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Chef Name' },
    { key: 'email', label: 'Email' },
    { key: 'cuisine_type', label: 'Cuisine' },
    {
      key: 'rating',
      label: 'Rating',
      render: (val) => `${val || 0}/5`,
    },
    {
      key: 'user_id',
      label: 'Action',
      render: (val) => (
        <button
          onClick={() => handleDisableChef(val)}
          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition"
        >
          Disable
        </button>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-dark mb-8">Chefs Management</h1>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12"
            />
          </div>

          {/* Table */}
          <Table columns={columns} data={filteredChefs} loading={loading} />
        </div>
      </main>
    </div>
  );
}
