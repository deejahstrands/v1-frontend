import { create } from 'zustand';
import { ordersService, type Order, type OrderFilters, type ReviewData } from '@/services/orders';
import { toast } from 'react-toastify';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  currentFilter: string;
  currentPage: number;
  meta: {
    page: number;
    limit: number | null;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  
  // Actions
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchOrder: (orderId: string) => Promise<void>;
  addReview: (itemId: string, reviewData: ReviewData) => Promise<void>;
  setFilter: (filter: string) => void;
  setPage: (page: number) => void;
  setSelectedOrder: (order: Order | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  currentFilter: 'all',
  currentPage: 1,
  meta: null,
};

export const useOrders = create<OrdersState>((set) => ({
  ...initialState,

  fetchOrders: async (filters) => {
    set({ loading: true, error: null });
    try {
      const response = await ordersService.getOrders(filters);
      const { data: orders, meta } = response;
      
      set({
        orders,
        currentPage: meta.page,
        meta: {
          page: meta.page,
          limit: meta.limit,
          totalItems: meta.totalItems,
          totalPages: meta.totalPages,
          hasNext: meta.hasNext,
          hasPrev: meta.hasPrev,
        },
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      });
    }
  },

  fetchOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await ordersService.getOrder(orderId);
      const order = response.data;
      
      set({
        selectedOrder: order,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch order',
      });
    }
  },

  addReview: async (itemId, reviewData) => {
    set({ loading: true, error: null });
    try {
      await ordersService.addReview(itemId, reviewData);
      
      // Update the selected order with the new review
      set((state) => {
        if (!state.selectedOrder) return { loading: false };
        
        const updatedOrder = {
          ...state.selectedOrder,
          items: state.selectedOrder.items.map(item =>
            item.id === itemId
              ? { ...item, review: reviewData.review, rating: reviewData.rating.toString() }
              : item
          )
        };
        
        return {
          selectedOrder: updatedOrder,
          loading: false,
        };
      });
      
      toast.success('Review added successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add review';
      set({
        loading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw error; // Re-throw to let the component handle it if needed
    }
  },

  setFilter: (filter) => {
    set({ currentFilter: filter, currentPage: 1 });
  },

  setPage: (page) => {
    set({ currentPage: page });
  },

  setSelectedOrder: (order) => {
    set({ selectedOrder: order });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
