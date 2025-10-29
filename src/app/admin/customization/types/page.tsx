"use client";

import { useState, useEffect, useRef } from 'react';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Plus, Edit, Trash2 } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/common/button';
import { CustomizationType } from '@/services/admin';
import { useCustomizationTypesStore } from '@/store/admin';
import { useToast } from '@/hooks/use-toast';
import { CustomizationTypeModal } from '@/components/admin/customization/customization-type-modal';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useDebounce } from '@/hooks/use-debounce';

export default function CustomizationTypesPage() {
  const { toast } = useToast();
  const {
    types: customizationTypes,
    isLoading,
    isDeleting,
    error,
    currentPage,
    totalPages,
    fetchTypes,
    createType,
    updateType,
    deleteType,
    setCurrentPage,
    clearError
  } = useCustomizationTypesStore();

  // Local state for search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const fetchTypesRef = useRef(fetchTypes);
  const setCurrentPageRef = useRef(setCurrentPage);



  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedType, setSelectedType] = useState<CustomizationType | undefined>();

  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<CustomizationType | null>(null);

  // Update refs when functions change
  useEffect(() => {
    fetchTypesRef.current = fetchTypes;
    setCurrentPageRef.current = setCurrentPage;
  }, [fetchTypes, setCurrentPage]);

  // Load data on mount
  useEffect(() => {
    fetchTypesRef.current();
  }, []);

  // Handle search with debouncing
  useEffect(() => {

    // Always fetch when debouncedSearchTerm changes
    const searchParams = {
      search: debouncedSearchTerm || undefined,
      page: 1
    };
    fetchTypesRef.current(searchParams);
    setCurrentPageRef.current(1);
  }, [debouncedSearchTerm]);

  // Get paginated data - now handled by the API
  const getPaginatedTypes = () => {
    return customizationTypes;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTypesRef.current({
      page,
      search: searchTerm || undefined
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };


  const handleAddType = () => {
    setModalMode('add');
    setSelectedType(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (type: CustomizationType) => {
    setModalMode('edit');
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleDelete = (type: CustomizationType) => {
    setTypeToDelete(type);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!typeToDelete) return;

    try {
      const success = await deleteType(typeToDelete.id);
      if (success) {
        toast.success(`${typeToDelete.name} deleted successfully!`);
        setIsDeleteModalOpen(false);
        setTypeToDelete(null);
      } else {
        toast.error('Failed to delete customization type');
      }
    } catch {
      toast.error('Failed to delete customization type');
    }
  };

  const handleSaveType = async (typeData: { name: string; description: string }) => {
    try {
      if (modalMode === 'add') {
        // Add new type
        const newType = await createType(typeData);
        if (newType) {
          toast.success('Customization type created successfully!');
        }
      } else if (selectedType) {
        // Edit existing type
        const updatedType = await updateType(selectedType.id, typeData);
        if (updatedType) {
          toast.success('Customization type updated successfully!');
        }
      }

      setIsModalOpen(false);
      setSelectedType(undefined);
    } catch (error) {
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Table columns
  const columns: TableColumn<CustomizationType>[] = [
    {
      label: 'TYPE NAME',
      accessor: 'name'
    },
    {
      label: 'DESCRIPTION',
      accessor: 'description'
    },
    {
      label: '# OF OPTIONS',
      accessor: 'noOfOptions'
    },
    {
      label: 'ACTIONS',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center justify-center gap-4">
          <button
            className="text-green-600 hover:text-green-800 transition-colors cursor-pointer"
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
            <h1 className="text-2xl font-semibold mb-1">Customization Types</h1>
            <p className="text-gray-500">Manage categories of customization options</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">

            <Button
              icon={<Plus className="w-4 h-4" />}
              className='!bg-black text-white w-full sm:w-auto'
              onClick={handleAddType}
            >
              Add Type
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
        data={getPaginatedTypes()}
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
      <CustomizationTypeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        type={selectedType}
        onSave={handleSaveType}
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
        title="Delete Customization Type"
        message={`Are you sure you want to delete the type "${typeToDelete?.name}"?`}
        deletionItems={[
          "All Options associated with this Type will be permanently deleted",
          "All Product Customizations that depend on those Options will also be removed"
        ]}
        type="delete"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
