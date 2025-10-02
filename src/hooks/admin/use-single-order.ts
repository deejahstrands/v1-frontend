/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  // Load single order
  const loadOrder = useCallback(async (id: string): Promise<Order | null> => {
    if (globalOrderFetching) return null;

    try {
      globalOrderFetching = true;
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

  // Update order status
  const updateOrderStatus = useCallback(
    async (id: string, data: UpdateOrderStatusData): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);

      try {
        await orderService.updateOrderStatus(id, data);
        // Reload the order to get updated data
        await loadOrder(id);
        toast.success("Order updated successfully");
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
    [loadOrder, toast]
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
