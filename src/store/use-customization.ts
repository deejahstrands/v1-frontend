import { create } from 'zustand';

interface CustomizationOption {
  label: string;
  price?: number;
}

interface CustomizationType {
  type: string;
  options: CustomizationOption[];
}

interface WigType {
  id: string;
  name: string;
  basePrice: number;
  customizations: CustomizationType[];
}

interface CustomizationState {
  selectedWigType: WigType | null;
  selectedOptions: { [type: string]: CustomizationOption };
  setSelectedWigType: (wigType: WigType) => void;
  setSelectedOption: (type: string, option: CustomizationOption) => void;
  getTotalPrice: () => number;
  reset: () => void;
}

export const useCustomization = create<CustomizationState>((set, get) => ({
  selectedWigType: null,
  selectedOptions: {},
  setSelectedWigType: (wigType) => {
    set({ selectedWigType: wigType, selectedOptions: {} });
    // Initialize with first option for each customization type
    const initialOptions: { [type: string]: CustomizationOption } = {};
    wigType.customizations.forEach(custom => {
      if (custom.options[0]) {
        initialOptions[custom.type] = custom.options[0];
      }
    });
    set({ selectedOptions: initialOptions });
  },
  setSelectedOption: (type, option) => set((state) => ({
    selectedOptions: { ...state.selectedOptions, [type]: option },
  })),
  getTotalPrice: () => {
    const state = get();
    if (!state.selectedWigType) return 0;
    
    const basePrice = state.selectedWigType.basePrice;
    const optionsPrice = Object.values(state.selectedOptions).reduce((sum, opt) => sum + (opt.price || 0), 0);
    
    return basePrice + optionsPrice;
  },
  reset: () => set({ selectedWigType: null, selectedOptions: {} }),
})); 