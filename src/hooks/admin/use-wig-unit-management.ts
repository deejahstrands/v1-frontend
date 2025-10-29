"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWigUnitsStore } from '@/store/admin/use-wig-units';
import { CreateWigUnitData, UpdateWigUnitData } from '@/services/admin/wig-unit.service';

export const useWigUnitManagement = () => {
  const { toast } = useToast();
  
  // Get store state and actions
  const {
    wigUnits,
    currentWigUnit,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    currentPage,
    itemsPerPage,
    searchTerm,
    error,
    setCurrentPage,
    setItemsPerPage,
    setSearchTerm,
    clearError,
    fetchWigUnits,
    fetchWigUnit,
    createWigUnit: storeCreateWigUnit,
    updateWigUnit: storeUpdateWigUnit,
    deleteWigUnit: storeDeleteWigUnit,
    getFilteredWigUnits,
    getPaginatedWigUnits,
  } = useWigUnitsStore();

  // Local state for search
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Load wig units on mount
  useEffect(() => {
    fetchWigUnits();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search with debouncing
  const handleSearch = useCallback((term: string) => {
    setLocalSearchTerm(term);
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, [setSearchTerm, setCurrentPage]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  }, [setItemsPerPage, setCurrentPage]);

  // Create wig unit with toast notifications
  const createWigUnit = useCallback(async (data: CreateWigUnitData) => {
    try {
      const result = await storeCreateWigUnit(data);
      if (result) {
        toast.success('Wig unit created successfully!');
        return result;
      } else {
        toast.error('Failed to create wig unit');
        return null;
      }
    } catch (error) {
      console.error('Error creating wig unit:', error);
      toast.error('Failed to create wig unit');
      return null;
    }
  }, [storeCreateWigUnit, toast]);

  // Update wig unit with toast notifications
  const updateWigUnit = useCallback(async (id: string, data: UpdateWigUnitData) => {
    try {
      const result = await storeUpdateWigUnit(id, data);
      if (result) {
        toast.success('Wig unit updated successfully!');
        return result;
      } else {
        toast.error('Failed to update wig unit');
        return null;
      }
    } catch (error) {
      console.error('Error updating wig unit:', error);
      toast.error('Failed to update wig unit');
      return null;
    }
  }, [storeUpdateWigUnit, toast]);

  // Delete wig unit with toast notifications
  const deleteWigUnit = useCallback(async (id: string) => {
    try {
      const success = await storeDeleteWigUnit(id);
      if (success) {
        toast.success('Wig unit deleted successfully!');
        return true;
      } else {
        toast.error('Failed to delete wig unit');
        return false;
      }
    } catch (error) {
      console.error('Error deleting wig unit:', error);
      toast.error('Failed to delete wig unit');
      return false;
    }
  }, [storeDeleteWigUnit, toast]);

  // Get single wig unit
  const getWigUnit = useCallback(async (id: string) => {
    try {
      await fetchWigUnit(id);
      return currentWigUnit;
    } catch (error) {
      console.error('Error fetching wig unit:', error);
      toast.error('Failed to load wig unit');
      return null;
    }
  }, [fetchWigUnit, currentWigUnit, toast]);

  // Refresh wig units
  const refreshWigUnits = useCallback(() => {
    fetchWigUnits({
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [fetchWigUnits, currentPage, itemsPerPage]);

  // Get filtered and paginated wig units
  const filteredWigUnits = getFilteredWigUnits();
  const paginatedWigUnits = getPaginatedWigUnits();

  // Calculate pagination info for filtered results
  const filteredTotalPages = Math.ceil(filteredWigUnits.length / itemsPerPage);
  const filteredTotalItems = filteredWigUnits.length;

  return {
    // Data
    wigUnits: paginatedWigUnits,
    currentWigUnit,
    allWigUnits: wigUnits,
    filteredWigUnits,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Pagination
    currentPage,
    itemsPerPage,
    totalPages: filteredTotalPages,
    totalItems: filteredTotalItems,
    
    // Search
    searchTerm: localSearchTerm,
    
    // Error handling
    error,
    clearError,
    
    // Actions
    handleSearch,
    handlePageChange,
    handleItemsPerPageChange,
    createWigUnit,
    updateWigUnit,
    deleteWigUnit,
    getWigUnit,
    refreshWigUnits,
  };
};
