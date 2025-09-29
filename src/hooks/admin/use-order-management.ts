/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { orderService, Order, UpdateOrderStatusData } from '@/services/admin/order.service';

// Global flags to prevent duplicate API calls
let globalOrdersFetching = false;
let globalOrderFetching = false;

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load orders
  const loadOrders = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  }) => {
    if (globalOrdersFetching || isLoading) return;

    try {
      globalOrdersFetching = true;
      setIsLoading(true);
      setError(null);
      
      const response = await orderService.getOrders({
        page: params?.page || currentPage,
        limit: params?.limit || 10,
        search: params?.search,
        status: params?.status,
      });
      
      setOrders(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.totalItems);
      setCurrentPage(response.meta.page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
      globalOrdersFetching = false;
    }
  }, [currentPage, isLoading]);

  // Load single order
  const loadOrder = useCallback(async (id: string): Promise<Order | null> => {
    if (globalOrderFetching) return null;

    try {
      globalOrderFetching = true;
      setIsLoading(true);
      setError(null);
      
      const response = await orderService.getOrder(id);
      setCurrentOrder(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order');
      console.error('Error loading order:', err);
      return null;
    } finally {
      setIsLoading(false);
      globalOrderFetching = false;
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (id: string, data: UpdateOrderStatusData): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    
    try {
      await orderService.updateOrderStatus(id, data);
      await loadOrders(); // Reload orders
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
      console.error('Error updating order status:', err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [loadOrders]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadOrders({ page });
  }, [loadOrders]);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Initial load
  useEffect(() => {
    loadOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    orders,
    currentOrder,
    isLoading,
    isUpdating,
    currentPage,
    totalPages,
    totalItems,
    error,
    loadOrders,
    loadOrder,
    updateOrderStatus,
    handlePageChange,
    clearError,
  };
};
