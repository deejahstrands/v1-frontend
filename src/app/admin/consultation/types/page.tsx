/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/common/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ConsultationTypeModal } from '@/components/admin/consultation/consultation-type-modal';
import { useConsultationTypeManagement } from '@/hooks/admin/use-consultation-type-management';
import { ConsultationType } from '@/services/admin/consultation-type.service';

export default function ConsultationTypesPage() {
  const router = useRouter();

  // Use the consultation type management hook
  const {
    consultationTypes,
    isLoading,
    isDeleting,
    currentPage,
    totalPages,
    handlePageChange,
    createConsultationType,
    updateConsultationType,
    deleteConsultationType,
  } = useConsultationTypeManagement();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedType, setSelectedType] = useState<ConsultationType | undefined>();

  // Confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<ConsultationType | null>(null);

  // Handle add type
  const handleAddType = () => {
    setModalMode('add');
    setSelectedType(undefined);
    setIsModalOpen(true);
  };

  // Handle edit
  const handleEdit = (type: ConsultationType) => {
    setModalMode('edit');
    setSelectedType(type);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (type: ConsultationType) => {
    setTypeToDelete(type);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (typeToDelete) {
      await deleteConsultationType(typeToDelete.id);
      setIsDeleteModalOpen(false);
      setTypeToDelete(null);
    }
  };

  // Handle save type
  const handleSaveType = async (data: any) => {
    if (modalMode === 'add') {
      await createConsultationType(data);
    } else if (modalMode === 'edit' && selectedType) {
      await updateConsultationType(selectedType.id, data);
    }
    setIsModalOpen(false);
    setSelectedType(undefined);
  };

  // Table columns
  const columns: TableColumn<ConsultationType>[] = [
    {
      accessor: 'name',
      label: 'Consultation Type',
      render: (row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      ),
    },
    {
      accessor: 'price',
      label: 'Price',
      render: (row) => (
        <div className="text-gray-900">₦{parseInt(row.price).toLocaleString()}</div>
      ),
    },
    {
      accessor: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      accessor: 'createdAt',
      label: 'Date Added',
      render: (row) => (
        <div className="text-gray-500">
          {new Date(row.createdAt).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          })}
        </div>
      ),
    },
  ];

  // Actions for each row
  const actions = (row: ConsultationType) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEdit(row)}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDelete(row)}
        className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="w-full mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb and Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="tertiary"
            onClick={() => router.push('/admin/consultation')}
            className="flex items-center gap-2"
          >
            ← Go Back
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Consultation</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Types</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultation Types</h1>
            <p className="text-gray-600 mt-1">
              Manage all consultation types and their pricing
            </p>
          </div>
          <Button onClick={handleAddType} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Consultation Type
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          data={consultationTypes}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          emptyMessage="No consultation types found"
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <ConsultationTypeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedType(undefined);
        }}
        onSave={handleSaveType}
        mode={modalMode}
        consultationType={selectedType}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTypeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Consultation Type"
        message={`Are you sure you want to delete the consultation type "${typeToDelete?.name}"? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
