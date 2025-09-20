/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { wishlistService, type WishlistProduct } from '@/services/wishlist'

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
  apiItems: WishlistProduct[]
  loading: boolean
  error: string | null
  totalItems: number
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
  addToWishlistApi: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => void
  removeFromWishlistApi: (productId: string) => Promise<void>
  moveToCart: (productId: string) => Promise<void>
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  getWishlistCount: () => number
  fetchWishlist: (page?: number, limit?: number) => Promise<void>
  clearError: () => void
}

const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      apiItems: [],
      loading: false,
      error: null,
      totalItems: 0,
      currentPage: 1,
      hasNext: false,
      hasPrev: false,
      
      // Local storage methods (for unauthenticated users)
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
      isInWishlist: (productId) => {
        const state = get()
        return state.items.some((item) => item.productId === productId) || 
               state.apiItems.some((item) => item.id === productId)
      },
      getWishlistCount: () => {
        const state = get()
        return state.items.length + state.apiItems.length
      },
      
      // API methods (for authenticated users)
      addToWishlistApi: async (productId: string) => {
        set({ loading: true, error: null })
        try {
          await wishlistService.addToWishlist({ productId })
          // Refresh wishlist after adding
          await get().fetchWishlist()
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to add to wishlist' })
          throw error
        } finally {
          set({ loading: false })
        }
      },
      
      removeFromWishlistApi: async (productId: string) => {
        set({ loading: true, error: null })
        try {
          await wishlistService.removeFromWishlist(productId)
          // Update local state immediately
          set((state) => ({
            apiItems: state.apiItems.filter((item) => item.id !== productId),
            totalItems: state.totalItems - 1
          }))
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to remove from wishlist' })
          throw error
        } finally {
          set({ loading: false })
        }
      },
      
      moveToCart: async (productId: string) => {
        set({ loading: true, error: null })
        try {
          await wishlistService.moveToCart(productId)
          // Remove from wishlist after moving to cart
          await get().removeFromWishlistApi(productId)
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to move to cart' })
          throw error
        } finally {
          set({ loading: false })
        }
      },
      
      fetchWishlist: async (page = 1, limit = 20) => {
        set({ loading: true, error: null })
        try {
          const response = await wishlistService.getWishlist({ page, limit })
          set({
            apiItems: response.data,
            totalItems: response.meta.totalItems,
            currentPage: response.meta.page,
            hasNext: response.meta.hasNext,
            hasPrev: response.meta.hasPrev
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to fetch wishlist' })
        } finally {
          set({ loading: false })
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'wishlist-storage',
      skipHydration: true,
      partialize: (state) => ({ items: state.items }), // Only persist local items
    }
  )
)

export { useWishlist }