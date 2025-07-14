import { create } from "zustand";
import { users } from "@/data/users";

export type User = typeof users[number];

interface UserState {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasPurchased: () => boolean;
  hasPurchasedProduct: (productId: string) => boolean;
}

export const useUser = create<UserState>((set, get) => ({
  currentUser: users[0], // default to first user for demo
  login: (userId) => {
    const user = users.find(u => u.id === userId) || null;
    set({ currentUser: user });
  },
  logout: () => set({ currentUser: null }),
  isAuthenticated: () => !!get().currentUser?.isAuthenticated,
  hasPurchased: () => !!get().currentUser?.hasPurchased,
  hasPurchasedProduct: (productId) => {
    const user = get().currentUser;
    return !!user && Array.isArray(user.purchases) && user.purchases.some(p => p.productId === productId);
  },
})); 