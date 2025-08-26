"use client";

import { useState, useEffect, useRef } from 'react';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Plus, Edit, Trash2 } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/common/button';
import { CustomizationOption } from '@/services/admin';
import { useCustomizationOptionsStore } from '@/store/admin';
import { useToast } from '@/hooks/use-toast';
import { CustomizationOptionModal } from '@/components/admin/customization/customization-option-modal';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useDebounce } from '@/hooks/use-debounce';

export default function CustomizationOptionsPage() {
  const { toast } = useToast();
  const {
    options: customizationOptions,
    isLoading,
    isDeleting,
    error,
    currentPage,
    totalPages,
    fetchOptions,
    createOption,
    updateOption,
    deleteOption,
    setCurrentPage,
    clearError
  } = useCustomizationOptionsStore();

  // Local state for search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const fetchOptionsRef = useRef(fetchOptions);
  const setCurrentPageRef = useRef(setCurrentPage);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedOption, setSelectedOption] = useState<CustomizationOption | undefined>();

  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState<CustomizationOption | null>(null);

  // Update refs when functions change
  useEffect(() => {
    fetchOptionsRef.current = fetchOptions;
    setCurrentPageRef.current = setCurrentPage;
  }, [fetchOptions, setCurrentPage]);

  // Load data on mount
  useEffect(() => {
    fetchOptionsRef.current();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const searchParams = {
      search: debouncedSearchTerm || undefined,
      page: 1
    };
    fetchOptionsRef.current(searchParams);
    setCurrentPageRef.current(1);
  }, [debouncedSearchTerm]);

  // Get paginated data - now handled by the API
  const getPaginatedOptions = () => {
    return customizationOptions;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOptionsRef.current({
      page,
      search: searchTerm || undefined
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddOption = () => {
    setModalMode('add');
    setSelectedOption(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (option: CustomizationOption) => {
    setModalMode('edit');
    setSelectedOption(option);
    setIsModalOpen(true);
  };

  const handleDelete = (option: CustomizationOption) => {
    setOptionToDelete(option);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!optionToDelete) return;

    try {
      const success = await deleteOption(optionToDelete.id);
      if (success) {
        toast.success(`${optionToDelete.name} deleted successfully!`);
        setIsDeleteModalOpen(false);
        setOptionToDelete(null);
      } else {
        toast.error('Failed to delete customization option');
      }
    } catch {
      toast.error('Failed to delete customization option');
    }
  };

  const handleSaveOption = async (optionData: { 
    name: string; 
    description?: string; 
    typeId: string; 
    status: 'active' | 'hidden';
  }) => {
    try {
      if (modalMode === 'add') {
        // Add new option
        const newOption = await createOption(optionData);
        if (newOption) {
          toast.success('Customization option created successfully!');
        }
      } else if (selectedOption) {
        // Edit existing option
        const updatedOption = await updateOption(selectedOption.id, optionData);
        if (updatedOption) {
          toast.success('Customization option updated successfully!');
        }
      }

      setIsModalOpen(false);
      setSelectedOption(undefined);
    } catch (error) {
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Table columns
  const columns: TableColumn<CustomizationOption>[] = [
    {
      label: 'OPTION NAME',
      accessor: 'name'
    },
    {
      label: 'DESCRIPTION',
      accessor: 'description'
    },
    {
      label: 'TYPE',
      accessor: 'customizationType',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.customizationType.name}
        </span>
      )
    },
    {
      label: 'ASSIGNED PRODUCTS',
      accessor: 'assignedProducts',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.assignedProducts} Products
        </span>
      )
    },
    {
      label: 'STATUS',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {row.status === 'active' ? 'Active' : 'Hidden'}
        </span>
      )
    },
    {
      label: 'ACTIONS',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer p-1 rounded hover:bg-blue-50"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
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
            <h1 className="text-2xl font-semibold mb-1">Customization Options</h1>
            <p className="text-gray-500">Manage categories of customization options</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              icon={<Plus className="w-4 h-4" />}
              className='!bg-black text-white w-full sm:w-auto'
              onClick={handleAddOption}
            >
              Add Option
            </Button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="font-medium mb-3">Filter & Search</h3>
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Types"
          className="w-full"
        />
        {isLoading && (
          <div className="mt-2 text-sm text-gray-500">
            Searching...
          </div>
        )}
      </div>

      {/* Table with pagination in footer */}
      <Table
        columns={columns}
        data={getPaginatedOptions()}
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

      {/* Add/Edit Modal */}
      <CustomizationOptionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        option={selectedOption}
        onSave={handleSaveOption}
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
        title="Delete Customization Option"
        message={`Are you sure you want to delete the option "${optionToDelete?.name}"?`}
        deletionItems={[
          "All Product Customizations that depend on this Option will also be removed"
        ]}
        type="delete"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
