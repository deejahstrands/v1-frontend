import { create } from 'zustand';

interface DeliveryOption {
  label: string;
  price: number;
}

interface DeliveryState {
  selected: { [type: string]: DeliveryOption };
  setSelected: (type: string, option: DeliveryOption) => void;
  getTotalPrice: () => number;
}

export const useDelivery = create<DeliveryState>((set, get) => ({
  selected: {},
  setSelected: (type, option) => set((state) => ({
    selected: { ...state.selected, [type]: option },
  })),
  getTotalPrice: () => {
    return Object.values(get().selected).reduce((sum, opt) => sum + (opt.price || 0), 0);
  },
})); 