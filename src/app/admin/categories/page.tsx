"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Filter } from '@/components/ui/filter';
import { FilterDropdown } from '@/components/ui/filter-dropdown';
import { SubDropdown } from '@/components/ui/sub-dropdown';
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/common/button';
import { useFilter } from "@/hooks/use-filter";
import { AdminFilterKey } from '@/hooks/admin';
import { CategoryModal } from '@/components/admin/categories';
import { AdminCategory, CreateCategoryData } from '@/services/admin';
import { useCategoriesStore } from '@/store/admin/use-categories';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/ui';
import Image from 'next/image';

const filterConfigs = [
  {
    key: "status" as AdminFilterKey,
    label: "Status",
    icon: <div className="w-5 h-5 rounded-full bg-gray-300" />,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

export default function AdminCategoriesPage() {
  console.log('🚀 AdminCategoriesPage component rendering');

  const router = useRouter();
  const { toast } = useToast();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | undefined>();

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the categories store directly
  const {
    // Data
    categories,
    totalPages,
    currentPage,

    // Loading states
    isLoading,

    // Actions
    fetchCategories: fetchCategoriesFromStore,
    createCategory,
    updateCategory,
    deleteCategory,
    setCurrentPage,

    // Filters
    filters,
    setFilters,

    // Helper functions
    getActiveFilters,
  } = useCategoriesStore();

  // Debug: Log the store values
  console.log('🔍 Store values:', {
    categories: categories,
    categoriesLength: categories?.length,
    totalPages: totalPages,
    isLoading: isLoading
  });
  
  // Debug: Log the raw store state
  const storeState = useCategoriesStore.getState();
  console.log('🔍 Raw store state:', {
    categories: storeState.categories,
    categoriesLength: storeState.categories?.length,
    totalPages: storeState.totalPages,
    isLoading: storeState.isLoading
  });

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    console.log('🔍 Page changed to:', page);
    setCurrentPage(page);
    
    // Only send parameters that are actually set
    const params: { page: number; limit: number; search?: string; status?: string } = { page, limit: 10 };
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    
    fetchCategoriesFromStore(params);
  }, [setCurrentPage, fetchCategoriesFromStore, filters]);
  
  // Handle immediate search input change (for UI)
  const handleSearchChange = useCallback((value: string) => {
    console.log('🔍 Search input changed:', value);
    setFilters({ search: value });
  }, [setFilters]);
  
  // Handle debounced search with API call
  const handleDebouncedSearch = useCallback((value: string) => {
    console.log('🔍 Debounced search triggered:', value);
    
    // Only send search if there's a value, otherwise fetch without search
    if (value.trim()) {
      console.log('🔍 Searching for:', value.trim());
      fetchCategoriesFromStore({ search: value.trim(), page: 1 });
    } else {
      // Clear search - fetch without search parameter
      console.log('🔍 Clearing search, fetching all categories');
      fetchCategoriesFromStore({ page: 1, limit: 10 });
    }
  }, [fetchCategoriesFromStore]);
  
  // Handle status filter change
  const handleStatusFilterChange = useCallback((status: string) => {
    console.log('🔍 Status filter changed:', status);
    setFilters({ status });
    
    // Only send status if it's set, otherwise fetch without status
    if (status) {
      console.log('🔍 Filtering by status:', status);
      fetchCategoriesFromStore({ status, page: 1 });
    } else {
      // Clear status filter - fetch without status parameter
      console.log('🔍 Clearing status filter, fetching all categories');
      fetchCategoriesFromStore({ page: 1, limit: 10 });
    }
  }, [setFilters, fetchCategoriesFromStore]);

  console.log('🎯 Categories page render:', {
    categories,
    totalPages,
    currentPage,
    isLoading,
    filters
  });

  const {
    subDropdown,
    setIsFilterOpen,
    setSubDropdown,
    availableFilters,
    getSubOptions,
  } = useFilter<AdminFilterKey>(filterConfigs);

  // Fetch categories on component mount - only once
  useEffect(() => {
    console.log('🚀 Categories page mounted - calling fetchCategories');
    fetchCategoriesFromStore({
      page: 1,
      limit: 10
    });
  }, [fetchCategoriesFromStore]); // Include fetchCategoriesFromStore in dependencies

  // Modal handlers
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: AdminCategory) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(undefined);
  };

  const handleSaveCategory = async (categoryData: AdminCategory) => {
    try {
      if (modalMode === 'add') {
        await createCategory({
          name: categoryData.name,
          coverImage: categoryData.coverImage,
          description: categoryData.description,
          status: categoryData.status,
        });
        // Toast is now handled by the modal
      } else if (modalMode === 'edit' && selectedCategory) {
        // For edit mode, only send the fields that actually changed
        const updateData: Partial<CreateCategoryData> = {};
        
        if (categoryData.name !== selectedCategory.name) {
          updateData.name = categoryData.name;
        }
        
        if (categoryData.description !== selectedCategory.description) {
          updateData.description = categoryData.description;
        }
        
        if (categoryData.status !== selectedCategory.status) {
          updateData.status = categoryData.status;
        }
        
        if (categoryData.coverImage !== selectedCategory.coverImage) {
          updateData.coverImage = categoryData.coverImage;
        }
        
        // Only call update if there are actual changes
        if (Object.keys(updateData).length > 0) {
          await updateCategory(selectedCategory.id, updateData);
          // Toast is now handled by the modal
        }
      }

      // Refresh the categories list with only necessary parameters
      const refreshParams: { page: number; limit: number; search?: string; status?: string } = { 
        page: currentPage, 
        limit: 10 
      };
      if (filters.search) refreshParams.search = filters.search;
      if (filters.status) refreshParams.status = filters.status;
      
      fetchCategoriesFromStore(refreshParams);
      // Don't close modal here - let the modal handle it after success
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category. Please try again.');
    }
  };

  // Delete handlers
  const handleDeleteClick = (category: AdminCategory) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCategory(categoryToDelete.id);
      toast.success('Category deleted successfully!');
      
      // Refresh the categories list with only necessary parameters
      const refreshParams: { page: number; limit: number; search?: string; status?: string } = { 
        page: currentPage, 
        limit: 10 
      };
      if (filters.search) refreshParams.search = filters.search;
      if (filters.status) refreshParams.status = filters.status;
      
      fetchCategoriesFromStore(refreshParams);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Table columns definition
  const columns: TableColumn<AdminCategory>[] = [
    {
      label: 'IMAGE',
      accessor: 'coverImage',
      render: (row) => (
        <div className="flex items-center justify-center">
          <Image
            src={row.coverImage}
            alt={row.name}
            width={40}
            height={40}
            className="rounded-lg object-cover"
          />
        </div>
      )
    },
    { label: 'CATEGORY NAME', accessor: 'name' },
    { label: 'DESCRIPTION', accessor: 'description' },
    { label: '# OF PRODUCTS', accessor: 'noOfProducts' },
    {
      label: 'STATUS',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'active'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
          }`}>
          {row.status}
        </span>
      )
    },

    {
      label: 'ACTION',
      accessor: 'action',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="View"
            onClick={() => router.push(`/admin/categories/${row.id}`)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="text-green-600 hover:text-green-800 transition-colors"
            title="Edit"
            onClick={() => handleOpenEditModal(row)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete"
            onClick={() => handleDeleteClick(row)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold mb-1">Categories</h1>
          <p className="text-gray-500">Manage product categories and subcategories</p>
        </div>
        <div className="flex justify-start">
          <Button icon={<Plus className="w-4 h-4" />} className='!bg-black text-white' onClick={handleOpenAddModal}>
            Add Category
          </Button>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="font-medium mb-3">Filter & Search</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <SearchInput
            value={filters.search}
            onChange={handleSearchChange}
            onDebouncedChange={handleDebouncedSearch}
            placeholder="Search Categories"
            className="md:w-80"
            debounceDelay={500}
          />
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {/* Active filters as pills - only show user-selected filters, not defaults */}
            {Object.entries(getActiveFilters()).length > 0 ? (
              Object.entries(getActiveFilters()).map(([key, value]) => (
                <span key={key} className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs border border-gray-200">
                  {key === 'sortBy' ? 'Sort By' : key === 'sortOrder' ? 'Order' : key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-700"
                    onClick={() => {
                      if (key === 'sortBy') {
                        setFilters({ [key]: 'createdAt' }); // Reset to default
                      } else if (key === 'sortOrder') {
                        setFilters({ [key]: 'desc' }); // Reset to default
                      } else {
                        // Clear the filter
                        setFilters({ [key]: '' });
                        
                        // Refresh data when clearing search or status filter
                        if (key === 'search' || key === 'status') {
                          console.log('🔄 Clearing filter:', key, 'refreshing data');
                          // Reset to first page and fetch without the cleared filter
                          setCurrentPage(1);
                          fetchCategoriesFromStore({ page: 1, limit: 10 });
                        }
                      }
                    }}
                    aria-label="Remove filter"
                  >
                    &times;
                  </button>
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500 px-3 py-1">No filters applied</span>
            )}
            {/* Filter button and dropdown */}
            <Filter
              buttonLabel="Filter"
              hasSubDropdownOpen={!!subDropdown}
              onOpenChange={setIsFilterOpen}
            >
              {subDropdown !== 'status' ? (
                <FilterDropdown
                  options={availableFilters}
                  selected={subDropdown || undefined}
                  onSelect={(val) => {
                    setSubDropdown(val as AdminFilterKey);
                    if (val === 'status') {
                      setIsFilterOpen(true);
                    }
                  }}
                />
              ) : (
                <SubDropdown
                  options={getSubOptions(subDropdown!)}
                  selected={filters[subDropdown!]}
                  onSelect={(val) => {
                    if (subDropdown === 'status') {
                      handleStatusFilterChange(val);
                    } else {
                    setFilters({ [subDropdown!]: val });
                    }
                    setSubDropdown(null);
                    setIsFilterOpen(false);
                  }}
                  onClose={() => {
                    setSubDropdown(null);
                    setIsFilterOpen(true);
                  }}
                  title="Status"
                />
              )}
            </Filter>
          </div>
        </div>
      </div>

      {/* Table with pagination in footer */}
      <Table
        columns={columns}
        data={categories || []}
        isLoading={isLoading}
        footerContent={
          totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )
        }
      />

      {/* Category Modal */}
      <CategoryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        type="delete"
        confirmText="Delete Category"
        isLoading={isDeleting}
      />
    </div>
  );
}


