'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import apiClient from '@/lib/api';

export default function ChefsPage() {
  const router = useRouter();
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/admin/chefs');
      setChefs(res.data.data || []);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      label: 'Chef', 
      key: 'name', 
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <img 
            src={row.profile_image || 'https://placehold.co/100'} 
            alt={row.name} 
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { label: 'Cuisine', key: 'cuisine_type' },
    { 
      label: 'Rating', 
      key: 'rating',
      render: (val) => (
        <span className="flex items-center space-x-1 text-amber-500 font-medium">
          <span>★</span>
          <span>{val ? val.toFixed(1) : 'N/A'}</span>
        </span>
      )
    },
    { 
      label: 'Joined Date', 
      key: 'created_at',
      render: (val) => new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    },
    {
      label: 'Status',
      key: 'is_active',
      render: (val) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
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
              <h1 className="text-3xl font-bold text-dark tracking-tight">Chefs Directory</h1>
              <p className="text-gray-500 mt-1">Manage approved home chefs</p>
            </div>
            <button className="btn-primary">Add New Chef</button>
          </div>

          <Table columns={columns} data={chefs} loading={loading} />
        </div>
      </main>
    </div>
  );
}
