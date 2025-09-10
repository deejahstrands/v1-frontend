/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/table';
import { Button } from '@/components/common/button';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { MessageSquare, Settings, Eye, Trash2 } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

// Mock data for consultation bookings - replace with actual API data
const mockConsultations = [
  {
    id: '1',
    customerName: 'Tony Reiley',
    consultationType: 'Virtual',
    date: '2025-05-01T09:00:00Z',
    orderId: '#23456',
    status: 'pending',
  },
  {
    id: '2',
    customerName: 'Dee Jah',
    consultationType: 'In-Studio',
    date: '2025-05-01T09:00:00Z',
    orderId: '#23456',
    status: 'scheduled',
  },
  {
    id: '3',
    customerName: 'Aramide Mojisola',
    consultationType: 'Home Visit',
    date: '2025-05-01T09:00:00Z',
    orderId: '#23456',
    status: 'canceled',
  },
];

export default function ConsultationPage() {
  const router = useRouter();
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [consultationToDelete, setConsultationToDelete] = useState<any>(null);

  // Filter consultations based on search and filters
  const filteredConsultations = mockConsultations.filter(consultation => {
    const matchesSearch = !searchTerm || 
      consultation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    const matchesType = typeFilter === 'all' || consultation.consultationType.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle type filter
  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  // Handle delete
  const handleDelete = (consultation: any) => {
    setConsultationToDelete(consultation);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    // TODO: Implement delete logic
    console.log('Delete consultation:', consultationToDelete);
    setIsDeleteModalOpen(false);
    setConsultationToDelete(null);
  };

  // Handle view
  const handleView = (consultation: any) => {
    router.push(`/admin/consultation/${consultation.id}`);
  };

  // Table columns
  const columns: TableColumn<any>[] = [
    {
      accessor: 'customerName',
      label: 'Customer Name',
      render: (row) => (
        <div className="font-medium text-gray-900">{row.customerName}</div>
      ),
    },
    {
      accessor: 'consultationType',
      label: 'Consultation Type',
      render: (row) => (
        <div className="text-gray-900">{row.consultationType}</div>
      ),
    },
    {
      accessor: 'date',
      label: 'Date',
      render: (row) => (
        <div className="text-gray-900">
          {new Date(row.date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </div>
      ),
    },
    {
      accessor: 'orderId',
      label: 'Order ID',
      render: (row) => (
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          {row.orderId}
        </button>
      ),
    },
    {
      accessor: 'status',
      label: 'Status',
      render: (row) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          scheduled: 'bg-green-100 text-green-800',
          canceled: 'bg-red-100 text-red-800',
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
  const actions = (row: any) => (
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
          <Button
            onClick={() => router.push('/admin/consultation/types')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Consultation Settings
          </Button>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchInput
            placeholder="Search customer name or order ID"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select
            value={statusFilter}
            onChange={handleStatusFilter}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Scheduled', value: 'scheduled' },
              { label: 'Canceled', value: 'canceled' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
          <Select
            value={typeFilter}
            onChange={handleTypeFilter}
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'Virtual', value: 'virtual' },
              { label: 'In-Studio', value: 'in-studio' },
              { label: 'Home Visit', value: 'home visit' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          data={filteredConsultations}
          columns={columns}
          actions={actions}
          isLoading={isLoading}
          emptyMessage="No consultation bookings found"
          footerContent={
            filteredConsultations.length > 0 && (
              <div className="flex justify-center py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={1}
                  onPageChange={setCurrentPage}
                />
              </div>
            )
          }
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setConsultationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Consultation Booking"
        message={`Are you sure you want to delete the consultation booking for "${consultationToDelete?.customerName}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={false}
      />
    </div>
  );
}