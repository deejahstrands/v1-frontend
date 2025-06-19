import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  updateQuantity: (id: string, quantity: number) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      clearCart: () => set({ items: [] }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),
    }),
    {
      name: 'cart-storage',
    }
  )
) 