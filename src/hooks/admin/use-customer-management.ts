"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { customerService, AdminCustomer } from '@/services/admin/customer.service';

// Global flags to prevent duplicate API calls
let globalCustomersFetching = false;

export const useCustomerManagement = () => {
  const { toast } = useToast();
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  // State
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Load customers
  const loadCustomers = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) => {
    if (globalCustomersFetching || isLoading) return;

    try {
      globalCustomersFetching = true;
      setIsLoading(true);
      setError(null);

      const response = await customerService.getCustomers({
        page: params?.page || currentPage,
        limit: params?.limit || 10,
        search: params?.search,
        isActive: params?.isActive,
      });

      setCustomers(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.totalItems);
      setCurrentPage(response.meta.page);
    } catch (err) {
      console.error('Error loading customers:', err);
      setError('Failed to load customers');
    } finally {
      setIsLoading(false);
      globalCustomersFetching = false;
    }
  }, [currentPage, isLoading]);

  // Update customer status
  const updateCustomerStatus = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      await customerService.updateCustomerStatus(id, isActive);
      // Reload customers after updating
      await loadCustomers();
      return true;
    } catch (err) {
      console.error('Error updating customer status:', err);
      setError('Failed to update customer status');
      return false;
    }
  }, [loadCustomers]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadCustomers({ page });
  }, [loadCustomers]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    customers,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    loadCustomers,
    updateCustomerStatus,
    handlePageChange,
    clearError,
  };
};
