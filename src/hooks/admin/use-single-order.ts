/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef, useEffect } from "react";
import {
  orderService,
  Order,
  UpdateOrderStatusData,
} from "@/services/admin/order.service";

// Global flag to prevent duplicate API calls
let globalOrderFetching = false;

export const useSingleOrder = () => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentOrderRef = useRef<Order | null>(null);
  const loadOrderRef = useRef<((id: string) => Promise<Order | null>) | null>(
    null
  );
  const isInitialized = useRef(false);

  // Load single order
  const loadOrder = useCallback(async (id: string): Promise<Order | null> => {
    if (globalOrderFetching) {
      return null;
    }

    if (isInitialized.current) {
      return null;
    }

    try {
      globalOrderFetching = true;
      isInitialized.current = true;
      setIsLoading(true);
      setError(null);

      const response = await orderService.getOrder(id);
      setCurrentOrder(response.data);
      currentOrderRef.current = response.data;
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load order");
      return null;
    } finally {
      setIsLoading(false);
      globalOrderFetching = false;
    }
  }, []);

  // Store the loadOrder function in ref for stable reference
  loadOrderRef.current = loadOrder;

  // Update order status
  const updateOrderStatus = useCallback(
    async (id: string, data: UpdateOrderStatusData): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);

      try {
        await orderService.updateOrderStatus(id, data);
        // Reload the current order to get updated data
        if (currentOrderRef.current && loadOrderRef.current) {
          await loadOrderRef.current(currentOrderRef.current.id);
        }
        return true;
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to update order status"
        );
        console.error("Error updating order status:", err);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      globalOrderFetching = false;
    };
  }, []);

  return {
    currentOrder,
    isLoading,
    isUpdating,
    error,
    loadOrder,
    updateOrderStatus,
    clearError,
  };
};
