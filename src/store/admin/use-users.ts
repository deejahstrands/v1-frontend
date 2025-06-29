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
  setSearch: (search) => {
    console.log('Store - setSearch called with:', search);
    set({ search });
  },
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
    let filtered = [...users];

    // Search implementation
    const searchTerm = search.toLowerCase();
    if (searchTerm) {
      filtered = users.filter(user => {
        const nameMatches = user.name.toLowerCase().includes(searchTerm);
        const emailMatches = user.email.toLowerCase().includes(searchTerm);
        
        console.log('Checking user:', {
          name: user.name,
          nameMatches,
          email: user.email,
          emailMatches,
          searchTerm
        });
        
        return nameMatches || emailMatches;
      });

      console.log('Search results:', {
        term: searchTerm,
        matchCount: filtered.length,
        matches: filtered.map(u => u.name)
      });
    }

    // Filter implementation
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter(user => {
        return Object.entries(filters).every(([key, value]) => 
          user[key as keyof User] === value
        );
      });
    }

    return filtered;
  },
})); 