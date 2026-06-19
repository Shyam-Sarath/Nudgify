'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { user, token } = response.data.data;

      if (user.role !== 'admin') {
        setError('Only admins can access this dashboard');
        return;
      }

      localStorage.setItem('token', token);
      setAuth(user, token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-panel p-8 w-full max-w-md border border-border/25 shadow-xl animate-slide-up">
        <h1 className="text-3xl font-bold font-serif text-primary-950 mb-1">Nudgify</h1>
        <p className="text-secondary-600 font-serif font-bold text-xs uppercase tracking-widest mb-8">Admin Dashboard</p>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-tertiary-600 uppercase tracking-widest font-serif">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nudgify.com"
              className="input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-tertiary-600 uppercase tracking-widest font-serif">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full font-serif text-base py-3 mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-tertiary-500 text-xs mt-6 font-medium">
          Demo credentials: <span className="font-semibold text-primary-950">admin@nudgify.com</span> / <span className="font-semibold text-primary-950">admin123</span>
        </p>
      </div>
    </div>
  );
}
