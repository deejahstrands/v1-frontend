import { useState, useMemo, useEffect } from 'react';
import { useAdminFilter, type FilterConfig } from './use-admin-filter';
import { adminCategories, type AdminCategory } from '@/data/admin-categories';

export const useCategories = (filterConfigs: FilterConfig[] = []) => {
  // Admin filter hook for search and filtering
  const {
    filteredData: filteredCategories,
    search,
    setSearch,
    filters,
    setFilter,
    removeFilter,
    clearAllFilters,
    getFilterOptions,
  } = useAdminFilter({
    data: adminCategories,
    filterConfigs,
    searchFields: ['name', 'description'],
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);

  // Pagination configuration
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Get paginated data
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = async (page: number) => {
    setIsPaginationLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsPaginationLoading(false);
  };

  // Initial page load simulation
  useEffect(() => {
    const loadInitialData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsPageLoading(false);
    };
    loadInitialData();
  }, []);

  // Reset to first page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  // Loading states
  const isLoading = isPageLoading || isPaginationLoading;

  // Category management functions
  const addCategory = (category: Omit<AdminCategory, 'id'>) => {
    const newCategory: AdminCategory = {
      ...category,
      id: Date.now().toString(), // Simple ID generation for demo
    };
    // In real app, this would be an API call
    console.log('Adding category:', newCategory);
  };

  const updateCategory = (id: string, updates: Partial<AdminCategory>) => {
    // In real app, this would be an API call
    console.log('Updating category:', id, updates);
  };

  const deleteCategory = (id: string) => {
    // In real app, this would be an API call
    console.log('Deleting category:', id);
  };

  const toggleCategoryStatus = (id: string) => {
    const category = adminCategories.find(c => c.id === id);
    if (category) {
      const newStatus = category.status === 'Active' ? 'Inactive' : 'Active';
      updateCategory(id, { status: newStatus });
    }
  };

  // Get category by ID
  const getCategoryById = (id: string) => {
    return adminCategories.find(category => category.id === id);
  };

  // Get categories by status
  const getCategoriesByStatus = (status: 'Active' | 'Inactive') => {
    return adminCategories.filter(category => category.status === status);
  };

  // Get categories with most products
  const getTopCategories = (limit: number = 5) => {
    return [...adminCategories]
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, limit);
  };

  // Get recently added categories
  const getRecentCategories = (limit: number = 5) => {
    return [...adminCategories]
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, limit);
  };

  return {
    // Data
    categories: adminCategories,
    filteredCategories,
    paginatedCategories,
    
    // Search and filtering
    search,
    setSearch,
    filters,
    setFilter,
    removeFilter,
    clearAllFilters,
    getFilterOptions,
    
    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    
    // Loading states
    isLoading,
    isPageLoading,
    isPaginationLoading,
    
    // Category management
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    getCategoryById,
    getCategoriesByStatus,
    getTopCategories,
    getRecentCategories,
  };
};
