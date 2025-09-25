/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { wigUnitsService, WigUnitDetail, WigUnitListItem } from '@/services/wig-units';

interface WigUnitsState {
  list: WigUnitListItem[];
  selected: WigUnitDetail | null;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;

  fetchList: (params?: { page?: number; limit?: number }) => Promise<void>;
  fetchOne: (id: string) => Promise<void>;
  clearSelected: () => void;
  clearError: () => void;
}

export const useWigUnits = create<WigUnitsState>((set) => ({
  list: [],
  selected: null,
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrev: false,

  fetchList: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await wigUnitsService.getWigUnits(params);
      set({
        list: res.data,
        page: res.meta.page,
        totalPages: res.meta.totalPages,
        totalItems: res.meta.totalItems,
        hasNext: res.meta.hasNext,
        hasPrev: res.meta.hasPrev,
        loading: false,
      });
    } catch (e: any) {
      set({ loading: false, error: e?.response?.data?.message || 'Failed to fetch wig units' });
    }
  },

  fetchOne: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await wigUnitsService.getWigUnit(id);
      set({ selected: res.data, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e?.response?.data?.message || 'Failed to fetch wig unit' });
    }
  },

  clearSelected: () => set({ selected: null }),
  clearError: () => set({ error: null }),
}));


