"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/common/button';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { WigUnitModal } from '@/components/admin/customization/wig-unit-modal';

// Wig Unit interface
interface WigUnit {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  createdAt: string;
  updatedAt: string;
}

// Mock data for demonstration
const mockWigUnits: WigUnit[] = [
  {
    id: '1',
    name: 'Straight',
    description: 'Different types of lace for wigs',
    basePrice: 3000000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Curly',
    description: '',
    basePrice: 2500000,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Bob',
    description: '',
    basePrice: 3000000,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
];



export default function CustomizationPage() {
  const { toast } = useToast();
  const router = useRouter();

  // Local state
  const [wigUnits, setWigUnits] = useState<WigUnit[]>(mockWigUnits);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUnit, setSelectedUnit] = useState<WigUnit | undefined>();

  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<WigUnit | null>(null);

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Filter units based on search
  const filteredUnits = wigUnits.filter(unit =>
    unit.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    unit.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUnits = filteredUnits.slice(startIndex, endIndex);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle add unit
  const handleAddUnit = () => {
    setModalMode('add');
    setSelectedUnit(undefined);
    setIsModalOpen(true);
  };

  // Handle edit
  const handleEdit = (unit: WigUnit) => {
    setModalMode('edit');
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (unit: WigUnit) => {
    setUnitToDelete(unit);
    setIsDeleteModalOpen(true);
  };

  // Handle customize - navigate to customization page
  const handleCustomize = (unit: WigUnit) => {
    router.push(`/admin/customization/${unit.id}`);
  };

  // Handle unit name click - also navigate to customization page
  const handleUnitNameClick = (unit: WigUnit) => {
    router.push(`/admin/customization/${unit.id}`);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!unitToDelete) return;

    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setWigUnits(prev => prev.filter(unit => unit.id !== unitToDelete.id));
      toast.success(`${unitToDelete.name} deleted successfully!`);
      setIsDeleteModalOpen(false);
      setUnitToDelete(null);
    } catch {
      toast.error('Failed to delete wig unit');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle save unit
  const handleSaveUnit = async (unitData: { name: string; description?: string; basePrice: number }) => {
    try {
      if (modalMode === 'add') {
        // Add new unit
        const newUnit: WigUnit = {
          id: Date.now().toString(),
          name: unitData.name,
          description: unitData.description || '',
          basePrice: unitData.basePrice,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setWigUnits(prev => [...prev, newUnit]);
        toast.success('Wig unit created successfully!');
      } else if (selectedUnit) {
        // Edit existing unit
        setWigUnits(prev => prev.map(unit =>
          unit.id === selectedUnit.id
            ? {
              ...unit,
              name: unitData.name,
              description: unitData.description || '',
              basePrice: unitData.basePrice,
              updatedAt: new Date().toISOString()
            }
            : unit
        ));
        toast.success('Wig unit updated successfully!');
      }

      setIsModalOpen(false);
      setSelectedUnit(undefined);
    } catch {
      // Error is handled by the parent component
    }
  };

  // Table columns
  const columns: TableColumn<WigUnit>[] = [
    {
      label: 'TYPE NAME',
      accessor: 'name',
      render: (row) => (
        <button
          onClick={() => handleUnitNameClick(row)}
          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer hover:underline transition-colors"
        >
          {row.name}
        </button>
      )
    },
    {
      label: 'DESCRIPTION',
      accessor: 'description',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.description || '--'}
        </span>
      )
    },
    {
      label: 'BASE PRICE',
      accessor: 'basePrice',
      render: (row) => (
        <span className="text-sm text-gray-600">
          ₦{(row.basePrice / 1000000).toFixed(1)}M
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
            className="text-green-600 hover:text-green-800 transition-colors cursor-pointer p-1 rounded hover:bg-green-50"
            title="Customize"
            onClick={() => handleCustomize(row)}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer p-1 rounded hover:bg-red-50 "
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
            <h1 className="text-2xl font-semibold mb-1">Wig Customization</h1>
            <p className="text-gray-500">Manage categories of customization options</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              icon={<Plus className="w-4 h-4" />}
              className='!bg-black text-white w-full sm:w-auto'
              onClick={handleAddUnit}
            >
              Add Unit
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
        data={paginatedUnits}
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
      <WigUnitModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        unit={selectedUnit}
        onSave={handleSaveUnit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Wig Unit"
        message={`Are you sure you want to delete the unit "${unitToDelete?.name}"?`}
        deletionItems={[
          "This wig unit will be permanently removed",
          "All associated customization data will be lost"
        ]}
        type="delete"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
} 