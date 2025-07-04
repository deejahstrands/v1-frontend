import { create } from 'zustand';

interface ProductGridState {
  grid: number; // 2, 3, or 4 (for lg screens)
  setGrid: (grid: number) => void;
}

export const useProductGrid = create<ProductGridState>((set) => ({
  grid: 4,
  setGrid: (grid) => set({ grid }),
})); 