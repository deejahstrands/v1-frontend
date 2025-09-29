/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { orderService, Order, UpdateOrderStatusData } from '@/services/admin/order.service';

interface OrdersState {
  // Data
  orders: Order[];
  currentOrder: Order | null;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  
  // Search and filters
  searchTerm: string;
  statusFilter: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'all';
  
  // Error handling
  error: string | null;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'all') => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // API calls
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<Order | null>;
  updateOrderStatus: (id: string, data: UpdateOrderStatusData) => Promise<{ success: boolean; message: string } | null>;
  
  // Utility functions
  resetState: () => void;
  getFilteredOrders: () => Order[];
  getPaginatedOrders: () => Order[];
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  // Initial state
  orders: [],
  currentOrder: null,
  isLoading: false,
  isUpdating: false,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
  searchTerm: '',
  statusFilter: 'all',
  error: null,

  // Setters
  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (limit) => set({ itemsPerPage: limit }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // API calls
  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const { currentPage, itemsPerPage, searchTerm, statusFilter } = get();
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await orderService.getOrders(params);
      
      set({
        orders: response.data,
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch orders",
        isLoading: false,
      });
    }
  },

  fetchOrder: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await orderService.getOrder(id);
      set({ currentOrder: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch order:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch order",
        isLoading: false,
      });
      return null;
    }
  },

  updateOrderStatus: async (id, data) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await orderService.updateOrderStatus(id, data);
      set({ isUpdating: false });
      
      // Refresh the orders list
      get().fetchOrders();
      
      return { success: true, message: response.message };
    } catch (error: any) {
      console.error("Failed to update order status:", error);
      set({
        error: error.response?.data?.message || "Failed to update order status",
        isUpdating: false,
      });
      return null;
    }
  },

  // Utility functions
  resetState: () => set({
    orders: [],
    currentOrder: null,
    isLoading: false,
    isUpdating: false,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    searchTerm: '',
    statusFilter: 'all',
    error: null,
  }),

  getFilteredOrders: () => {
    const { orders, searchTerm, statusFilter } = get();
    
    return orders.filter(order => {
      const matchesSearch = !searchTerm || 
        order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  },

  getPaginatedOrders: () => {
    const { currentPage, itemsPerPage } = get();
    const filtered = get().getFilteredOrders();
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filtered.slice(startIndex, endIndex);
  },
}));
