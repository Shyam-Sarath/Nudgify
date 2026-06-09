import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => set({ user, token, isAuthenticated: !!token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

export const useCartStore = create((set, get) => ({
  cart: [],
  chefId: null, // Only allow ordering from one chef at a time
  addToCart: (dish, chefId) => {
    const currentCart = get().cart;
    const currentChefId = get().chefId;

    if (currentChefId && currentChefId !== chefId) {
      // Clear cart if ordering from a different chef
      set({
        cart: [{ ...dish, quantity: 1 }],
        chefId,
      });
      return;
    }

    const existingIndex = currentCart.findIndex((item) => item.id === dish.id);
    if (existingIndex > -1) {
      const updatedCart = [...currentCart];
      updatedCart[existingIndex].quantity += 1;
      set({ cart: updatedCart, chefId });
    } else {
      set({ cart: [...currentCart, { ...dish, quantity: 1 }], chefId });
    }
  },
  removeFromCart: (dishId) => {
    const currentCart = get().cart;
    const updatedCart = currentCart
      .map((item) => {
        if (item.id === dishId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    set({
      cart: updatedCart,
      chefId: updatedCart.length > 0 ? get().chefId : null,
    });
  },
  clearCart: () => set({ cart: [], chefId: null }),
}));

export const useDataStore = create((set) => ({
  chefs: [],
  dishes: [],
  orders: [],
  setChefs: (chefs) => set({ chefs }),
  setDishes: (dishes) => set({ dishes }),
  setOrders: (orders) => set({ orders }),
}));
