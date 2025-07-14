import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  productId: string
  title: string
  price: string
  image?: string
  category?: string
  addedAt: string
}

interface WishlistState {
  items: WishlistItem[]
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  getWishlistCount: () => number
}

const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (item) => {
        const { productId } = item
        const state = get()
        
        // Check if product is already in wishlist
        if (state.isInWishlist(productId)) {
          return // Don't add if already exists
        }
        
        set((state) => ({
          items: [...state.items, { ...item, addedAt: new Date().toISOString() }],
        }))
      },
      removeFromWishlist: (productId) => set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      })),
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (productId) => get().items.some((item) => item.productId === productId),
      getWishlistCount: () => get().items.length,
    }),
    {
      name: 'wishlist-storage',
      skipHydration: true,
    }
  )
)

export { useWishlist }