/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { customerService, AdminCustomer } from "@/services/admin/customer.service";

// Global state to prevent duplicate calls across all instances
let globalLoadingRef = false;
let globalLastLoadedIdRef: string | null = null;
let globalCurrentCustomerRef: AdminCustomer | null = null;

export const useSingleCustomer = () => {
  const [currentCustomer, setCurrentCustomer] = useState<AdminCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load single customer
  const loadCustomer = useCallback(async (id: string): Promise<AdminCustomer | null> => {

    if (globalCurrentCustomerRef && globalCurrentCustomerRef.id === id && globalLastLoadedIdRef === id) {
      setCurrentCustomer(globalCurrentCustomerRef);
      return globalCurrentCustomerRef;
    }

    // Prevent duplicate calls for the same customer
    if (globalLoadingRef && globalLastLoadedIdRef === id) {
      return null;
    }

    // If already loading any customer, wait for it to complete
    if (globalLoadingRef) {
      return null;
    }

    try {
      globalLoadingRef = true;
      globalLastLoadedIdRef = id;
      setIsLoading(true);
      setError(null);

      const response = await customerService.getCustomer(id);
      setCurrentCustomer(response.data);
      globalCurrentCustomerRef = response.data;
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load customer";
      setError(errorMessage);
      console.error("Error loading customer:", err);
      return null;
    } finally {
      setIsLoading(false);
      globalLoadingRef = false;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset customer data when component unmounts
  useEffect(() => {
    return () => {
      setCurrentCustomer(null);
    };
  }, []);

  return {
    currentCustomer,
    isLoading,
    error,
    loadCustomer,
    clearError,
  };
};

