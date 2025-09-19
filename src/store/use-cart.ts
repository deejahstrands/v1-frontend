/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartService } from '@/services/cart'
import type { CartItem as ApiCartItem } from '@/services/cart'

interface CustomizationOption {
  label: string
  price?: number
}

interface ConsultationData {
  type: string
  price: number
  description?: string
}

interface MeasurementsData {
  hasMeasurements: string;
  earToEar: string;
  headCircumference: string;
  foreheadToNape: string;
  hairlinePictures: File[] | string[]; // Support both Files and URLs
  styleReference: File[] | string[]; // Support both Files and URLs
}

interface CartItem {
  productId: string
  title: string
  image?: string
  basePrice: number
  customizations: { [type: string]: CustomizationOption }
  customizationTotal: number
  totalPrice: number
  quantity: number
  consultation?: ConsultationData
  delivery?: { [type: string]: { label: string; price: number } }
  measurements?: MeasurementsData
  specifications?: { type: string; value: string }[]
  apiData?: any // Store API-ready data for backend calls
}

export type { CartItem };

interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
  totalPrice: number
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  clearCartStorage: () => void
  getCartTotal: () => number
  fetchCart: () => Promise<void>
  updateCartItem: (itemId: string, quantity: number) => Promise<void>
  removeCartItem: (itemId: string) => Promise<void>
  transformApiCartItem: (apiItem: ApiCartItem) => CartItem
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      backendItems: [],
      totalPrice: 0,
      loading: false,
      error: null,
      addToCart: (item) => set((state) => {  
        const existingItemIndex = state.items.findIndex(
          (existingItem) => {
            const match = existingItem.productId === item.productId;
            console.log(`Comparing: "${existingItem.productId}" === "${item.productId}" = ${match}`);
            return match;
          }
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            customizations: item.customizations,
            customizationTotal: item.customizationTotal,
            consultation: item.consultation,
            delivery: item.delivery,
            measurements: item.measurements,
            specifications: item.specifications,
          };
          return { items: updatedItems };
        } else {
          // Add new item
          const newItems = [...state.items, item];
          return { items: newItems };
        }
      }),
      removeFromCart: (productId) => set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      })),
      clearCart: () => set({ items: [] }),
      clearCartStorage: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart-storage');
        }
        set({ items: [] });
      },
      getCartTotal: () => get().items.reduce((sum, item) => sum + item.totalPrice * item.quantity + (item.consultation?.price || 0), 0),

      // Backend API methods
      fetchCart: async () => {
        set({ loading: true, error: null });
        try {
          const response = await cartService.getCart();
          const transformedItems = response.data.items.map(get().transformApiCartItem);
          set({
            items: transformedItems,
            totalPrice: response.data.totalPrice,
            loading: false,
          });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || 'Failed to fetch cart',
          });
        }
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        try {
          await cartService.updateCartItem(itemId, { quantity });
          // Refresh cart after update
          await get().fetchCart();
        } catch (error: any) {
          set({ error: error.message || 'Failed to update cart item' });
        }
      },

      removeCartItem: async (itemId: string) => {
        try {
          await cartService.removeFromCart(itemId);
          // Refresh cart after removal
          await get().fetchCart();
        } catch (error: any) {
          set({ error: error.message || 'Failed to remove cart item' });
        }
      },

      transformApiCartItem: (apiItem: ApiCartItem): CartItem => {
        const product = apiItem.product || apiItem.wigUnit;
        const basePrice = product?.basePrice || 0;
        
        // Calculate customization total from API customizations
        const customizationTotal = apiItem.customizations.reduce((sum, customization) => {
          return sum + customization.options.reduce((optionSum, option) => optionSum + option.price, 0);
        }, 0);

        // Transform customizations to local format
        const transformedCustomizations: { [type: string]: any } = {};
        apiItem.customizations.forEach(customization => {
          customization.options.forEach(option => {
            transformedCustomizations[customization.typeName] = {
              label: option.name,
              price: option.price,
              itemCustomizationId: option.itemCustomizationId,
            };
          });
        });

        // Transform delivery options
        const delivery: { [type: string]: { label: string; price: number } } = {};
        if (apiItem.privateFitting) {
          delivery['Private Fitting'] = {
            label: apiItem.privateFitting.name,
            price: apiItem.privateFitting.price,
          };
        }
        if (apiItem.processingTime) {
          delivery['Processing Time'] = {
            label: apiItem.processingTime.label,
            price: apiItem.processingTime.price,
          };
        }

        return {
          productId: product?.id || '',
          title: product?.name || '',
          image: (product as any)?.thumbnail,
          basePrice,
          customizations: transformedCustomizations,
          customizationTotal,
          totalPrice: apiItem.totalPrice,
          quantity: apiItem.quantity,
          delivery,
          measurements: apiItem.measurements ? {
            hasMeasurements: 'yes',
            earToEar: apiItem.measurements.earToEar || '',
            headCircumference: apiItem.measurements.headCircumference || '',
            foreheadToNape: '',
            hairlinePictures: apiItem.measurements.harlineImages || [], // Use actual URLs from API
            styleReference: apiItem.measurements.wigStyleImages || [], // Use actual URLs from API
          } : undefined,
          specifications: [], // Would need to be derived from product data
          apiData: {
            cartItemId: apiItem.id,
            ...apiItem,
          },
        };
      },
    }),
    {
      name: 'cart-storage',
    }
  )
) 