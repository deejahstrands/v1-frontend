import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  hairlinePictures: File | null;
  styleReference: File | null;
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
}

export type { CartItem };

interface CartState {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  clearCartStorage: () => void
  getCartTotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => set((state) => {
        console.log('=== ADD TO CART DEBUG ===');
        console.log('Adding item:', {
          productId: item.productId,
          quantity: item.quantity,
          title: item.title
        });
        console.log('Current cart items:', state.items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          title: i.title
        })));
        
        const existingItemIndex = state.items.findIndex(
          (existingItem) => {
            const match = existingItem.productId === item.productId;
            console.log(`Comparing: "${existingItem.productId}" === "${item.productId}" = ${match}`);
            return match;
          }
        );

        console.log('Existing item index:', existingItemIndex);

        if (existingItemIndex !== -1) {
          console.log('Found existing item, updating quantity from', state.items[existingItemIndex].quantity, 'to', item.quantity);
          // Update existing item quantity
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
          console.log('Updated cart:', updatedItems.map(i => ({ productId: i.productId, quantity: i.quantity })));
          return { items: updatedItems };
        } else {
          console.log('No existing item found, adding new item');
          // Add new item
          const newItems = [...state.items, item];
          console.log('New cart:', newItems.map(i => ({ productId: i.productId, quantity: i.quantity })));
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
    }),
    {
      name: 'cart-storage',
    }
  )
) 