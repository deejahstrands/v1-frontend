/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { users as dummyUsers, User } from '@/data/users';

export type UserFilterKey = 'consultation';
export type UserFilters = Partial<Record<UserFilterKey, string>>;

export type UserStore = {
  users: User[];
  search: string;
  setSearch: (search: string) => void;
  filters: UserFilters;
  setFilter: (key: UserFilterKey, value: string) => void;
  removeFilter: (key: UserFilterKey) => void;
  resetFilters: () => void;
  filteredUsers: User[];
  isLoading: boolean;
};

export const useUsers = create<UserStore>((set, get) => ({
  users: dummyUsers,
  search: '',
  setSearch: (search) => set({ search }),
  filters: {} as UserFilters,
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  removeFilter: (key) => set((state) => {
    const { [key]: _, ...rest } = state.filters;
    return { filters: rest };
  }),
  resetFilters: () => set({ filters: {} }),
  isLoading: false,
  get filteredUsers() {
    const { users, search, filters } = get();
    let filtered = users;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          u.id.includes(s)
      );
    }
    Object.entries(filters).forEach(([key, value]) => {
      filtered = filtered.filter((u) => (u as any)[key] === value);
    });
    return filtered;
  },
})); 