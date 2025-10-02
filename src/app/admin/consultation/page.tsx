"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/table';
import { Button } from '@/components/common/button';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { MessageSquare, Settings, Eye, Trash2, RefreshCw } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useConsultationManagement } from '@/hooks/admin/use-consultation-management';
import { useDebounce } from '@/hooks/use-debounce';
import { ConsultationListItem } from '@/services/admin/consultation.service';
import { consultationTypeService, ConsultationType } from '@/services/admin/consultation-type.service';

export default function ConsultationPage() {
  const router = useRouter();
  
  const {
    consultations,
    isLoadingConsultations,
    isDeleting,
    currentPage,
    totalPages,
    error,
    clearError,
    loadConsultations,
    deleteConsultation,
    setCurrentPage,
  } = useConsultationManagement();

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'confirmed' | 'completed' | 'cancelled' | ''>('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Consultation types state
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [consultationToDelete, setConsultationToDelete] = useState<ConsultationListItem | null>(null);

  // Load consultation types
  const loadConsultationTypes = async () => {
    try {
      setIsLoadingTypes(true);
      const response = await consultationTypeService.getConsultationTypes({
        status: 'active', // Only get active types
        limit: 100 // Get all active types
      });
      setConsultationTypes(response.data);
    } catch (error) {
      console.error('Error loading consultation types:', error);
    } finally {
      setIsLoadingTypes(false);
    }
  };

  // Load consultations on mount
  useEffect(() => {
    loadConsultations();
    loadConsultationTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load consultations with filters
  useEffect(() => {
    const params = {
      search: debouncedSearchTerm || undefined,
      status: statusFilter || undefined,
      type: typeFilter || undefined,
      page: 1,
    };
    
    loadConsultations(params);
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, typeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status as 'pending' | 'confirmed' | 'completed' | 'cancelled' | '');
  };

  // Handle type filter
  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadConsultations({
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      type: typeFilter || undefined,
      page,
    });
  };

  // Handle refresh
  const handleRefresh = () => {
    loadConsultations({
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      type: typeFilter || undefined,
      page: currentPage,
    });
  };

  // Handle delete
  const handleDelete = (consultation: ConsultationListItem) => {
    setConsultationToDelete(consultation);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!consultationToDelete) return;
    
    const success = await deleteConsultation(consultationToDelete.id);
    if (success) {
      setIsDeleteModalOpen(false);
      setConsultationToDelete(null);
    }
  };

  // Handle view
  const handleView = (consultation: ConsultationListItem) => {
    router.push(`/admin/consultation/${consultation.id}`);
  };

  // Table columns
  const columns: TableColumn<ConsultationListItem>[] = [
    {
      accessor: 'user',
      label: 'Customer Name',
      render: (row) => (
        <div className="font-medium text-gray-900">
          {row.user.firstName} {row.user.lastName}
        </div>
      ),
    },
    {
      accessor: 'consultationType',
      label: 'Consultation Type',
      render: (row) => (
        <div className="text-gray-900">{row.consultationType.name}</div>
      ),
    },
    {
      accessor: 'date',
      label: 'Date',
      render: (row) => (
        <div className="text-gray-900">
          {row.date ? new Date(row.date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }) : 'Not scheduled'}
        </div>
      ),
    },
    {
      accessor: 'amount',
      label: 'Amount',
      render: (row) => (
        <div className="text-gray-900 font-medium">
          ₦{parseInt(row.amount).toLocaleString()}
        </div>
      ),
    },
    {
      accessor: 'status',
      label: 'Status',
      render: (row) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          confirmed: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800',
          completed: 'bg-blue-100 text-blue-800',
        };
        
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[row.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
    },
  ];

  // Actions for each row
  const actions = (row: ConsultationListItem) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleView(row)}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        title="View"
      >
        <Eye className="w-4 h-4" />
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary rounded-lg">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Consultation Bookings</h1>
              <p className="text-gray-600 mt-1">
                Manage all wig consultation appointments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              icon={<RefreshCw className="w-4 h-4" />}
              variant="tertiary"
              onClick={handleRefresh}
              disabled={isLoadingConsultations}
            >
              {isLoadingConsultations ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              onClick={() => router.push('/admin/consultation/types')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Consultation Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchInput
            placeholder="Search customer name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select
            value={statusFilter}
            onChange={handleStatusFilter}
            placeholder="All Status"
            options={[
              { label: 'All Status', value: '' },
              { label: 'Pending', value: 'pending' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Cancelled', value: 'cancelled' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
          <Select
            value={typeFilter}
            onChange={handleTypeFilter}
            placeholder={isLoadingTypes ? "Loading types..." : "All Types"}
            disabled={isLoadingTypes}
            options={[
              { label: 'All Types', value: '' },
              ...consultationTypes.map(type => ({
                label: type.name,
                value: type.name
              }))
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          data={consultations}
          columns={columns}
          actions={actions}
          isLoading={isLoadingConsultations}
          emptyMessage="No consultation bookings found"
          footerContent={
            totalPages > 1 && (
              <div className="flex justify-center py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )
          }
        />
      </div>

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
        onClose={() => {
          setIsDeleteModalOpen(false);
          setConsultationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Consultation Booking"
        message={`Are you sure you want to delete the consultation booking for "${consultationToDelete?.user.firstName} ${consultationToDelete?.user.lastName}"? This action cannot be undone.`}
        type="delete"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}