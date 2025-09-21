import { create } from 'zustand';
import { ordersService, type Order, type OrderFilters } from '@/services/orders';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

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
