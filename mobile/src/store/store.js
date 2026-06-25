import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: !!token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'nudgify-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      chefId: null, // Only allow ordering from one chef at a time
      addToCart: (dish, chefId) => {
        const currentCart = get().cart;
        const currentChefId = get().chefId;

        if (currentChefId && currentChefId !== chefId) {
          // Return conflict instead of silently overwriting
          return { success: false, conflict: true };
        }

        const existingIndex = currentCart.findIndex((item) => item.id === dish.id);
        if (existingIndex > -1) {
          const updatedCart = [...currentCart];
          updatedCart[existingIndex].quantity += 1;
          set({ cart: updatedCart, chefId });
        } else {
          set({ cart: [...currentCart, { ...dish, quantity: 1 }], chefId });
        }
        return { success: true };
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
    }),
    {
      name: 'nudgify-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useDataStore = create((set) => ({
  chefs: [],
  dishes: [],
  orders: [],
  setChefs: (chefs) => set({ chefs }),
  setDishes: (dishes) => set({ dishes }),
  setOrders: (orders) => set({ orders }),
}));

export const useChatStore = create(
  persist(
    (set, get) => ({
      chats: [
        {
          id: '1',
          participants: ['user1', 'chef1'],
          messages: [
            { id: 'm1', text: 'Hi, can you make the chicken less spicy?', senderId: 'user1', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
            { id: 'm2', text: 'Sure! I will reduce the spices.', senderId: 'chef1', timestamp: new Date(Date.now() - 1800000).toISOString(), read: true }
          ],
          lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
        }
      ],
      sendMessage: (chatId, senderId, receiverId, text) => {
        set((state) => {
          const chats = [...state.chats];
          let chatIndex = chats.findIndex((c) => c.id === chatId || (c.participants.includes(senderId) && c.participants.includes(receiverId)));
          
          const newMessage = {
            id: Math.random().toString(36).substring(7),
            text,
            senderId,
            timestamp: new Date().toISOString(),
            read: false,
          };

          if (chatIndex > -1) {
            const updatedChat = { ...chats[chatIndex] };
            updatedChat.messages = [...updatedChat.messages, newMessage];
            updatedChat.lastMessageAt = newMessage.timestamp;
            chats[chatIndex] = updatedChat;
          } else {
            chats.push({
              id: Math.random().toString(36).substring(7),
              participants: [senderId, receiverId],
              messages: [newMessage],
              lastMessageAt: newMessage.timestamp,
            });
          }
          return { chats };
        });
      },
      markAsRead: (chatId, userId) => {
        set((state) => {
          const chats = [...state.chats];
          const chatIndex = chats.findIndex((c) => c.id === chatId);
          if (chatIndex > -1) {
            const updatedChat = { ...chats[chatIndex] };
            updatedChat.messages = updatedChat.messages.map(m => 
              m.senderId !== userId ? { ...m, read: true } : m
            );
            chats[chatIndex] = updatedChat;
          }
          return { chats };
        });
      }
    }),
    {
      name: 'nudgify-chats',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
