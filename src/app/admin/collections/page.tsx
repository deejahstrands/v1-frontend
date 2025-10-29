/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/common/button';
import { useCollectionManagement } from '@/hooks/admin/use-collection-management';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Collection } from '@/services/admin/collection.service';
import { useDebounce } from '@/hooks/use-debounce';
import Image from 'next/image';

export default function CollectionsPage() {
  const router = useRouter();
  
  const {
    collections,
    isLoading,
    isDeleting,
    currentPage,
    totalPages,
    error,
    clearError,
    loadCollections,
    deleteCollection,
    handlePageChange,
  } = useCollectionManagement();

  // Local state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);

  // Load collections on mount
  React.useEffect(() => {
    loadCollections();
  }, []);

  // Handle search and filters with debouncing
  React.useEffect(() => {
    const searchParams = {
      search: debouncedSearchTerm || undefined,
      page: 1,
      status: statusFilter as 'active' | 'inactive' | undefined,
      featured: featuredFilter === 'featured' ? true : featuredFilter === 'not-featured' ? false : undefined,
    };
    
    loadCollections(searchParams);
  }, [debouncedSearchTerm, statusFilter, featuredFilter]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  // Handle featured filter
  const handleFeaturedFilter = (featured: string) => {
    setFeaturedFilter(featured);
  };

  // Handle add collection
  const handleAddCollection = () => {
    router.push('/admin/collections/create');
  };

  // Handle edit
  const handleEdit = (collection: Collection) => {
    router.push(`/admin/collections/create?mode=edit&id=${collection.id}`);
  };

  // Handle delete
  const handleDelete = (collection: Collection) => {
    setCollectionToDelete(collection);
    setIsDeleteModalOpen(true);
  };

  // Handle view
  const handleView = (collection: Collection) => {
    router.push(`/admin/collections/${collection.id}`);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!collectionToDelete) return;

    try {
      const success = await deleteCollection(collectionToDelete.id);
      if (success) {
        setIsDeleteModalOpen(false);
        setCollectionToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };


  // Clear filters
  const clearFilters = () => {
    setStatusFilter('');
    setFeaturedFilter('');
    setSearchTerm('');
    
    loadCollections({
      page: 1,
      search: undefined,
      status: undefined,
      featured: undefined,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter || featuredFilter || searchTerm;

  // Table columns
  const columns: TableColumn<Collection>[] = [
    {
      label: 'COLLECTION',
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
              onClick={() => handleView(row)}
              className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
            >
              {row.name}
            </button>
            <div className="text-sm text-gray-500">{row.description}</div>
          </div>
        </div>
      ),
    },
    {
      label: 'FEATURE TAGS',
      accessor: 'featured',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.featured
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.featured ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      label: 'STATUS',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      label: '# OF PRODUCT',
      accessor: 'noOfProducts',
      render: (row) => (
        <span className="font-medium">{row.noOfProducts}</span>
      ),
    },
    {
      label: 'DATE ADDED',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          })}
        </span>
      ),
    },
    {
      label: 'ACTIONS',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleView(row)}
            className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            title="View collection details"
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
            <h1 className="text-2xl font-semibold mb-1">Collections</h1>
            <p className="text-gray-500">Manage product collections and promotional displays</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              icon={<Plus className="w-4 h-4" />}
              className='!bg-black text-white w-full sm:w-auto'
              onClick={handleAddCollection}
            >
              Create New Collections
            </Button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="font-medium mb-3">Filter & Search</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search collections"
            />
          </div>
          <Select
            label="Status"
            placeholder="All Status"
            value={statusFilter}
            onChange={handleStatusFilter}
            options={[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
          <Select
            label="Featured"
            placeholder="All Collections"
            value={featuredFilter}
            onChange={handleFeaturedFilter}
            options={[
              { label: 'All Collections', value: '' },
              { label: 'Featured', value: 'featured' },
              { label: 'Not Featured', value: 'not-featured' },
            ]}
          />
        </div>
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
        {isLoading && (
          <div className="mt-2 text-sm text-gray-500">
            Loading...
          </div>
        )}
      </div>

      {/* Table with pagination in footer */}
      <Table
        columns={columns}
        data={collections}
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
        title="Delete Collection"
        message={`Are you sure you want to delete the collection "${collectionToDelete?.name}"?`}
        deletionItems={[
          "This action cannot be undone",
          "All collection data will be permanently removed"
        ]}
        type="delete"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
