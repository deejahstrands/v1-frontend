/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, Grid3X3, List, Filter, Settings, FolderPlus } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/common/button';
import { useProductManagement } from '@/hooks/admin/use-product-management';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Modal } from '@/components/ui/modal';
import { useDebounce } from '@/hooks/use-debounce';
import { AdminProduct } from '@/services/admin';
import { ProductCard } from '@/components/admin/products/product-card';
import { AddToCollectionModal } from '@/components/admin/products/add-to-collection-modal';
import Image from 'next/image';

export default function ProductsListPage() {
  const router = useRouter();
  
  const {
    products,
    categories,
    isLoadingProducts,
    isDeleting,
    isSaving,
    currentPage,
    totalPages,
    error,
    clearError,
    loadProducts,
    deleteProduct,
    updateProduct,
    changeProductStatus,
    setCurrentPage,
  } = useProductManagement();

  // Local state for search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCustomization, setSelectedCustomization] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState('');

  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);

  // Status change modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<AdminProduct | null>(null);
  const [statusForm, setStatusForm] = useState({
    status: 'available' as 'available' | 'sold_out',
    visibility: 'published' as 'published' | 'hidden',
    featured: false,
  });

  // Add to collection modal state
  const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] = useState(false);
  const [productToAddToCollection, setProductToAddToCollection] = useState<AdminProduct | null>(null);
  const [isAddingToCollection, setIsAddingToCollection] = useState(false);

  // Initial load
  React.useEffect(() => {
    loadProducts();
  }, []); // Empty dependency array - only run once on mount

  // Handle search and filters with debouncing
  React.useEffect(() => {
    const searchParams = {
      search: debouncedSearchTerm || undefined,
      page: 1,
      categoryId: selectedCategory || undefined,
      customization: selectedCustomization === 'customization' ? true : selectedCustomization === 'no-customization' ? false : undefined,
      visibility: selectedVisibility as 'hidden' | 'published' | undefined,
    };
    
    loadProducts(searchParams);
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, selectedCustomization, selectedVisibility]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadProducts({
      page,
      search: searchTerm || undefined
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddProduct = () => {
    router.push('/admin/products?mode=add');
  };

  const handleEdit = (product: AdminProduct) => {
    router.push(`/admin/products?mode=edit&id=${product.id}`);
  };

  const handleDelete = (product: AdminProduct) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const success = await deleteProduct(productToDelete.id);
      if (success) {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };


  const handleToggleStatus = async (product: AdminProduct) => {
    const newStatus = product.status === 'available' ? 'sold_out' : 'available';
    await changeProductStatus(product.id, newStatus);
  };

  const handleOpenStatusModal = (product: AdminProduct) => {
    setProductToUpdate(product);
    setStatusForm({
      status: product.status,
      visibility: product.visibility,
      featured: product.featured || false,
    });
    setIsStatusModalOpen(true);
  };

  const handleStatusFormChange = (field: string, value: string | boolean) => {
    setStatusForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateStatus = async () => {
    if (!productToUpdate) return;

    try {
      await updateProduct(productToUpdate.id, {
        status: statusForm.status,
        visibility: statusForm.visibility,
        featured: statusForm.featured,
      });
      setIsStatusModalOpen(false);
      setProductToUpdate(null);
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleOpenAddToCollectionModal = (product: AdminProduct) => {
    setProductToAddToCollection(product);
    setIsAddToCollectionModalOpen(true);
  };

  const handleAddToCollection = async (productId: string, collectionId: string) => {
    setIsAddingToCollection(true);
    try {
      // TODO: Implement actual API call to add product to collection
      console.log(`Adding product ${productId} to collection ${collectionId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal and reset state
      setIsAddToCollectionModalOpen(false);
      setProductToAddToCollection(null);
      
      // Show success message (you can add toast notification here)
      console.log('Product added to collection successfully');
    } catch (error) {
      console.error('Error adding product to collection:', error);
      throw error;
    } finally {
      setIsAddingToCollection(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedCustomization('');
    setSelectedVisibility('');
    setSearchTerm('');
    
    // Trigger a new fetch with cleared filters
    loadProducts({
      page: 1,
      search: undefined,
      categoryId: undefined,
      customization: undefined,
      visibility: undefined,
    });
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory || selectedCustomization || selectedVisibility || searchTerm;

  // Table columns
  const columns: TableColumn<AdminProduct>[] = [
    {
      label: 'PRODUCT',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <Image
            src={row.thumbnail}
            alt={row.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <button
              onClick={() => router.push(`/admin/products/${row.id}`)}
              className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
            >
              {row.name}
            </button>
            <div className="text-sm text-gray-500">{row.category.name}</div>
          </div>
        </div>
      ),
    },
    {
      label: 'PRICE',
      accessor: 'basePrice',
      render: (row) => (
        <span className="font-medium">₦{row.basePrice.toLocaleString()}</span>
      ),
    },
    {
      label: 'STATUS',
      accessor: 'status',
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row)}
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'available'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status === 'available' ? 'Available' : 'Sold Out'}
        </button>
      ),
    },
    {
      label: 'CUSTOMIZATION',
      accessor: 'customization',
      render: (row) => (
        <span className={row.customization ? 'text-green-600' : 'text-gray-400'}>
          {row.customization ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      label: 'VISIBILITY',
      accessor: 'visibility',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.visibility === 'published'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.visibility === 'published' ? 'Published' : 'Hidden'}
        </span>
      ),
    },
    {
      label: 'FEATURED',
      accessor: 'featured',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.featured
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.featured ? 'Featured' : 'Regular'}
        </span>
      ),
    },
    {
      label: 'ACTIONS',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.push(`/admin/products/${row.id}`)}
            className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            title="View product details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenStatusModal(row)}
            className="text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
            title="Change product status"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenAddToCollectionModal(row)}
            className="text-green-600 hover:text-green-800 transition-colors cursor-pointer"
            title="Add to collection"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
            title="Delete"
            onClick={() => handleDelete(row)}
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Products</h1>
            <p className="text-gray-500">Manage your store products</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-amber-300 text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-amber-300 text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </button>
            </div>
            
            {/* Filter Button */}
            <Button
              icon={<Filter className="w-4 h-4" />}
              variant="tertiary"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto cursor-pointer"
            >
              Filters
            </Button>
            
            <Button
              icon={<Plus className="w-4 h-4" />}
              className='!bg-black text-white w-full sm:w-auto'
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="font-medium mb-3">Search</h3>
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search products"
          className="w-full"
        />
        {isLoadingProducts && (
          <div className="mt-2 text-sm text-gray-500">
            Searching...
          </div>
        )}
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filters</h3>
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`text-sm cursor-pointer transition-colors ${
                hasActiveFilters 
                  ? 'text-blue-600 hover:text-blue-800' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <Select
              label="Category"
              placeholder="All Categories"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { label: 'All Categories', value: '' },
                ...categories.map((category) => ({
                  label: category.name,
                  value: category.id
                }))
              ]}
            />

            {/* Customization Filter */}
            <Select
              label="Customization"
              placeholder="All Products"
              value={selectedCustomization}
              onChange={setSelectedCustomization}
              options={[
                { label: 'All Products', value: '' },
                { label: 'With Customization', value: 'customization' },
                { label: 'Without Customization', value: 'no-customization' }
              ]}
            />

            {/* Visibility Filter */}
            <Select
              label="Visibility"
              placeholder="All Products"
              value={selectedVisibility}
              onChange={setSelectedVisibility}
              options={[
                { label: 'All Products', value: '' },
                { label: 'Published', value: 'published' },
                { label: 'Hidden', value: 'hidden' }
              ]}
            />
          </div>
        </div>
      )}

      {/* Products Display */}
      {viewMode === 'list' ? (
        <Table
          columns={columns}
          data={products}
          isLoading={isLoadingProducts}
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
      ) : (
        <div className="space-y-6">
          {/* Grid View */}
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Loading skeleton */}
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={(product) => router.push(`/admin/products/${product.id}`)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddToCollection={handleOpenAddToCollectionModal}
                  onChangeStatus={handleOpenStatusModal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Grid3X3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory || selectedCustomization || selectedVisibility
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Get started by creating your first product.'}
              </p>
              <Button
                icon={<Plus className="w-4 h-4" />}
                className='!bg-black text-white'
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </div>
          )}

          {/* Pagination for Grid View */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Error handling */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete the product "${productToDelete?.name}"?`}
        deletionItems={[
          "This action cannot be undone",
          "All product data will be permanently removed"
        ]}
        type="delete"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />

      {/* Status Change Modal */}
      <Modal
        open={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        size="md"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Change Product Status
          </h3>
          <p className="text-gray-600 mb-6">
            Update the status, visibility, and featured settings for &quot;{productToUpdate?.name}&quot;
          </p>
          
          <div className="space-y-4">
            {/* Status */}
            <Select
              label="Product Status"
              value={statusForm.status}
              onChange={(value) => handleStatusFormChange('status', value)}
              options={[
                { label: 'Available', value: 'available' },
                { label: 'Sold Out', value: 'sold_out' }
              ]}
            />

            {/* Visibility */}
            <Select
              label="Visibility"
              value={statusForm.visibility}
              onChange={(value) => handleStatusFormChange('visibility', value)}
              options={[
                { label: 'Published', value: 'published' },
                { label: 'Hidden', value: 'hidden' }
              ]}
            />

            {/* Featured */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Featured Product
              </label>
              <button
                onClick={() => handleStatusFormChange('featured', !statusForm.featured)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  statusForm.featured ? 'bg-black' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    statusForm.featured ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="tertiary"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateStatus}
              disabled={isSaving}
              className="!bg-black text-white"
            >
              {isSaving ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add to Collection Modal */}
      <AddToCollectionModal
        open={isAddToCollectionModalOpen}
        onClose={() => setIsAddToCollectionModalOpen(false)}
        product={productToAddToCollection}
        onAddToCollection={handleAddToCollection}
        isAdding={isAddingToCollection}
      />
    </div>
  );
}
