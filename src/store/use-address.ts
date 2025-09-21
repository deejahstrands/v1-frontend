import { create } from 'zustand';
import { addressService, type Address, type AddAddressRequest } from '@/services/address';

interface AddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAddresses: () => Promise<void>;
  addAddress: (data: AddAddressRequest) => Promise<void>;
  updateAddress: (addressId: string, data: Partial<AddAddressRequest>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setSelectedAddress: (address: Address | null) => void;
  getDefaultAddress: () => Address | null;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

export const useAddress = create<AddressState>((set, get) => ({
  ...initialState,

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await addressService.getAddresses();
      const addresses = response.data;
      
      // Auto-select default address if none selected
      const defaultAddress = addresses.find(addr => addr.default) || addresses[0] || null;
      
      set({
        addresses,
        selectedAddress: get().selectedAddress || defaultAddress,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch addresses',
      });
    }
  },

  addAddress: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await addressService.addAddress(data);
      const newAddress = response.data;
      
      set((state) => ({
        addresses: [...state.addresses, newAddress],
        selectedAddress: newAddress.default ? newAddress : state.selectedAddress,
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to add address',
      });
      throw error;
    }
  },

  updateAddress: async (addressId, data) => {
    set({ loading: true, error: null });
    try {
      await addressService.updateAddress(addressId, data);
      
      // Since the API only returns a success message, refetch all addresses
      // to get the updated data with proper structure
      const response = await addressService.getAddresses();
      const addresses = response.data;
      
      // Auto-select default address if none selected
      const defaultAddress = addresses.find(addr => addr.default) || addresses[0] || null;
      
      set({
        addresses,
        selectedAddress: get().selectedAddress || defaultAddress,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update address',
      });
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    set({ loading: true, error: null });
    try {
      await addressService.deleteAddress(addressId);
      
      set((state) => {
        const remainingAddresses = state.addresses.filter(addr => addr.id !== addressId);
        const newSelectedAddress = state.selectedAddress?.id === addressId
          ? remainingAddresses.find(addr => addr.default) || remainingAddresses[0] || null
          : state.selectedAddress;
        
        return {
          addresses: remainingAddresses,
          selectedAddress: newSelectedAddress,
          loading: false,
        };
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete address',
      });
      throw error;
    }
  },

  setSelectedAddress: (address) => {
    set({ selectedAddress: address });
  },

  getDefaultAddress: () => {
    const { addresses } = get();
    return addresses.find(addr => addr.default) || addresses[0] || null;
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
