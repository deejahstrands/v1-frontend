import { create } from 'zustand';

interface CustomizationOption {
  itemCustomizationId: string;
  customizationId: string;
  name: string;
  label: string;
  description: string;
  price: number;
  status: string;
}

interface ProductCustomizationState {
  selected: { [type: string]: CustomizationOption | null };
  setSelected: (type: string, option: CustomizationOption | null) => void;
  getTotalPrice: () => number;
  reset: () => void;
}

export const useProductCustomization = create<ProductCustomizationState>((set, get) => ({
  selected: {},
  setSelected: (type, option) => set((state) => ({
    selected: { ...state.selected, [type]: option },
  })),
  getTotalPrice: () => {
    return Object.values(get().selected).reduce((sum, opt) => sum + (opt?.price || 0), 0);
  },
  reset: () => set({ selected: {} }),
})); 