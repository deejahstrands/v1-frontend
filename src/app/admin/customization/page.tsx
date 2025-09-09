"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/table';
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/common/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { WigUnitModal } from '@/components/admin/customization/wig-unit-modal';
import { useWigUnitManagement } from '@/hooks/admin/use-wig-unit-management';
import { WigUnit } from '@/services/admin/wig-unit.service';

export default function CustomizationPage() {
  const router = useRouter();

  // Use the wig unit management hook
  const {
    wigUnits,
    isLoading,
    isDeleting,
    currentPage,
    totalPages,
    handlePageChange,
    createWigUnit,
    updateWigUnit,
    deleteWigUnit,
  } = useWigUnitManagement();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUnit, setSelectedUnit] = useState<WigUnit | undefined>();

  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<WigUnit | null>(null);

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

    const success = await deleteWigUnit(unitToDelete.id);
    if (success) {
      setIsDeleteModalOpen(false);
      setUnitToDelete(null);
    }
  };

  // Handle save unit
  const handleSaveUnit = async (unitData: { name: string; description?: string; basePrice: number }) => {
    try {
      if (modalMode === 'add') {
        await createWigUnit({
          name: unitData.name,
          description: unitData.description || '',
          basePrice: unitData.basePrice,
        });
      } else if (selectedUnit) {
        await updateWigUnit(selectedUnit.id, {
          name: unitData.name,
          description: unitData.description || '',
          basePrice: unitData.basePrice,
        });
      }

      setIsModalOpen(false);
      setSelectedUnit(undefined);
    } catch {
      // Error is handled by the hook
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
          ₦{row.basePrice.toLocaleString()}
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


      {/* Table with pagination in footer */}
      <Table
        columns={columns}
        data={wigUnits}
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