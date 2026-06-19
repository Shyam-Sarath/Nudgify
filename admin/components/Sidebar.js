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
  ClipboardList,
  Clock3,
  LogOut,
  Utensils,
  Settings,
  Bell
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
    { icon: Clock3, label: 'Pending Chefs', href: '/pending-chefs' },
    { icon: ShoppingCart, label: 'Orders', href: '/orders' },
    { icon: Utensils, label: 'Dishes', href: '/dishes' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: ClipboardList, label: 'Activity Logs', href: '/activity-logs' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="w-72 bg-tertiary-100 dark:bg-dark-card text-foreground h-screen flex flex-col shadow-sm border-r border-border/30 dark:border-dark-border z-10 relative">
      {/* Brand */}
      <div className="p-8 pb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-md">
          <Utensils className="text-white w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif text-primary-950 dark:text-white tracking-tight">Nudgify</h2>
          <p className="text-secondary-600 dark:text-secondary-400 text-xs mt-0.5 font-bold tracking-widest uppercase font-serif">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-primary-200/40 dark:bg-primary-950/20 text-primary-950 dark:text-primary-300 font-semibold' 
                  : 'text-tertiary-600 dark:text-tertiary-400 hover:bg-primary-200/20 dark:hover:bg-white/5 hover:text-primary-900 dark:hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 dark:bg-primary-400 rounded-r-full" />
              )}
              <Icon 
                size={20} 
                className={`transition-transform duration-300 ${isActive ? 'scale-105 text-primary-700 dark:text-primary-300' : 'text-tertiary-400 dark:text-tertiary-500 group-hover:text-primary-700 dark:group-hover:text-primary-300 group-hover:scale-105'}`} 
              />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-5 border-t border-border/20 dark:border-dark-border/50 bg-tertiary-100/50 dark:bg-black/10 backdrop-blur-md">
        {user && (
          <div className="mb-4 flex items-center space-x-3 p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-border/10">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold font-serif shadow-inner">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-semibold text-sm truncate text-primary-950 dark:text-gray-200">{user.name}</p>
              <p className="text-xs text-tertiary-500 dark:text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-danger/10 hover:bg-danger hover:text-white text-danger px-4 py-2.5 rounded-full transition-all duration-300 border border-danger/10"
        >
          <LogOut size={18} />
          <span className="font-semibold text-sm tracking-wide font-serif">Logout</span>
        </button>
      </div>
    </div>
  );
}
