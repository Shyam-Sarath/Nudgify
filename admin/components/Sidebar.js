'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  ChefHat,
  ShoppingCart,
  BarChart3,
  LogOut,
  Menu,
} from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Customers', href: '/customers' },
    { icon: ChefHat, label: 'Chefs', href: '/chefs' },
    { icon: ShoppingCart, label: 'Orders', href: '/orders' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  ];

  return (
    <div className="w-64 bg-dark text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-primary">Nudgify</h2>
        <p className="text-gray-400 text-sm">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-gray-700">
        {user && (
          <div className="mb-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
