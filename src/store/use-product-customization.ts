import { create } from 'zustand';

interface CustomizationOption {
  label: string;
  price?: number;
}

interface ProductCustomizationState {
  selected: { [type: string]: CustomizationOption };
  setSelected: (type: string, option: CustomizationOption) => void;
  getTotalPrice: () => number;
  reset: () => void;
}

export const useProductCustomization = create<ProductCustomizationState>((set, get) => ({
  selected: {},
  setSelected: (type, option) => set((state) => ({
    selected: { ...state.selected, [type]: option },
  })),
  getTotalPrice: () => {
    return Object.values(get().selected).reduce((sum, opt) => sum + (opt.price || 0), 0);
  },
  reset: () => set({ selected: {} }),
})); 