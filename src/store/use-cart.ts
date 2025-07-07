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

interface CartItem {
  productId: string
  basePrice: number
  customizations: { [type: string]: CustomizationOption }
  customizationTotal: number
  totalPrice: number
  quantity: number
  consultation?: ConsultationData
  delivery?: { [type: string]: { label: string; price: number } }
}

interface CartState {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  getCartTotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => set((state) => ({
        items: [...state.items, item],
      })),
      removeFromCart: (productId) => set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => get().items.reduce((sum, item) => sum + item.totalPrice * item.quantity + (item.consultation?.price || 0), 0),
    }),
    {
      name: 'cart-storage',
    }
  )
) 