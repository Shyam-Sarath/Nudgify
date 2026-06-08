import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setAuth: (user, token) => set({
    user,
    token,
    isAuthenticated: !!token,
  }),

  logout: () => set({
    user: null,
    token: null,
    isAuthenticated: false,
  }),
}));

export const useDashboardStore = create((set) => ({
  stats: {
    totalCustomers: 0,
    totalChefs: 0,
    totalOrders: 0,
    totalRevenue: 0,
  },
  setStats: (stats) => set({ stats }),
}));
