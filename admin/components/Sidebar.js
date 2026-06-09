'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  LayoutDashboard,
  Users,
  ChefHat,
  ShoppingCart,
  BarChart3,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
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
    <div className="w-64 bg-dark text-white h-screen flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.05)] border-r border-gray-800 z-10 relative">
      {/* Brand */}
      <div className="p-8 pb-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">Nudgify</h2>
        <p className="text-gray-400 text-sm mt-1 font-medium tracking-wide">Admin Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary border-l-4 border-primary font-semibold' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <Icon 
                size={22} 
                className={`transition-all duration-300 ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'}`} 
              />
              <span className="text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-6 border-t border-gray-800/50 bg-black/20 backdrop-blur-sm m-4 rounded-2xl">
        {user && (
          <div className="mb-5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate text-white">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-300 px-4 py-2.5 rounded-xl transition-all duration-300 border border-white/5 hover:border-red-500/30"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
