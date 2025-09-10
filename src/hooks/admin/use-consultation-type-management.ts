"use client";

import { useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useConsultationTypesStore } from '@/store/admin/use-consultation-types';
import { CreateConsultationTypeData, UpdateConsultationTypeData } from '@/services/admin/consultation-type.service';

export const useConsultationTypeManagement = () => {
  const { toast } = useToast();
  
  // Ref to prevent duplicate calls
  const loadedTypes = useRef<boolean>(false);
  
  // Get store state and actions
  const {
    consultationTypes,
    currentConsultationType,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    searchTerm,
    statusFilter,
    error,
    setCurrentPage,
    setItemsPerPage,
    setSearchTerm,
    setStatusFilter,
    clearError,
    fetchConsultationTypes,
    createConsultationType: storeCreateConsultationType,
    updateConsultationType: storeUpdateConsultationType,
    deleteConsultationType: storeDeleteConsultationType,
    getFilteredConsultationTypes,
    getPaginatedConsultationTypes,
  } = useConsultationTypesStore();

  // Load consultation types on mount
  useEffect(() => {
    if (!loadedTypes.current) {
      loadedTypes.current = true;
      fetchConsultationTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, [setSearchTerm, setCurrentPage]);

  // Handle status filter
  const handleStatusFilter = useCallback((status: 'active' | 'inactive' | 'all') => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  }, [setStatusFilter, setCurrentPage]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
  }, [setItemsPerPage, setCurrentPage]);

  // Create consultation type with toast notifications
  const createConsultationType = useCallback(async (data: CreateConsultationTypeData) => {
    try {
      const result = await storeCreateConsultationType(data);
      if (result) {
        toast.success('Consultation type created successfully!');
        return result;
      } else {
        toast.error('Failed to create consultation type');
        return null;
      }
    } catch (error) {
      console.error('Error creating consultation type:', error);
      toast.error('Failed to create consultation type');
      return null;
    }
  }, [storeCreateConsultationType, toast]);

  // Update consultation type with toast notifications
  const updateConsultationType = useCallback(async (id: string, data: UpdateConsultationTypeData) => {
    try {
      const result = await storeUpdateConsultationType(id, data);
      if (result) {
        toast.success('Consultation type updated successfully!');
        return result;
      } else {
        toast.error('Failed to update consultation type');
        return null;
      }
    } catch (error) {
      console.error('Error updating consultation type:', error);
      toast.error('Failed to update consultation type');
      return null;
    }
  }, [storeUpdateConsultationType, toast]);

  // Delete consultation type with toast notifications
  const deleteConsultationType = useCallback(async (id: string) => {
    try {
      const success = await storeDeleteConsultationType(id);
      if (success) {
        toast.success('Consultation type deleted successfully!');
        return true;
      } else {
        toast.error('Failed to delete consultation type');
        return false;
      }
    } catch (error) {
      console.error('Error deleting consultation type:', error);
      toast.error('Failed to delete consultation type');
      return false;
    }
  }, [storeDeleteConsultationType, toast]);


  // Refresh consultation types
  const refreshConsultationTypes = useCallback(() => {
    fetchConsultationTypes();
  }, [fetchConsultationTypes]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  }, [setSearchTerm, setStatusFilter, setCurrentPage]);

  // Get filtered and paginated data
  const filteredConsultationTypes = getFilteredConsultationTypes();
  const paginatedConsultationTypes = getPaginatedConsultationTypes();

  return {
    // Data
    consultationTypes: paginatedConsultationTypes,
    allConsultationTypes: consultationTypes,
    currentConsultationType,
    filteredConsultationTypes,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Pagination
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    
    // Search and filters
    searchTerm,
    statusFilter,
    
    // Error handling
    error,
    clearError,
    
    // Actions
    handleSearch,
    handleStatusFilter,
    handlePageChange,
    handleItemsPerPageChange,
    createConsultationType,
    updateConsultationType,
    deleteConsultationType,
    refreshConsultationTypes,
    clearFilters,
  };
};
