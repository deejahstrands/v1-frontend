/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { Eye, Edit, RefreshCw } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/common/button';
import { useOrderManagement } from '@/hooks/admin/use-order-management';
import { OrderStatusModal } from '@/components/admin/order-status-modal';
import { Order } from '@/services/admin/order.service';
import { useDebounce } from '@/hooks/use-debounce';

export default function AdminOrdersPage() {
  const router = useRouter();
  
  const {
    orders,
    isLoading,
    isUpdating,
    currentPage,
    totalPages,
    error,
    clearError,
    loadOrders,
    updateOrderStatus,
    handlePageChange,
  } = useOrderManagement();

  // Local state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Status update modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);

  // Prevent duplicate initial fetch: hook already loads initially
  const didRunFiltersOnce = useRef(false);

  // Handle search and filters with debouncing
  React.useEffect(() => {
    // Skip first run to avoid double call with initial hook load
    if (!didRunFiltersOnce.current) {
      didRunFiltersOnce.current = true;
      return;
    }
    const searchParams = {
      search: debouncedSearchTerm || undefined,
      page: 1,
      status: statusFilter as 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' | undefined,
    };
    
    loadOrders(searchParams);
  }, [debouncedSearchTerm, statusFilter]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  // Handle view order
  const handleView = (order: Order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  // Handle status update
  const handleStatusUpdate = (order: Order) => {
    setOrderToUpdate(order);
    setIsStatusModalOpen(true);
  };

  // Handle confirm status update
  const handleConfirmStatusUpdate = async (newStatus: string) => {
    if (!orderToUpdate) return;

    try {
      const success = await updateOrderStatus(orderToUpdate.id, { status: newStatus as any });
      if (success) {
        setIsStatusModalOpen(false);
        setOrderToUpdate(null);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
    
    loadOrders({
      page: 1,
      search: undefined,
      status: undefined,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter || searchTerm;

  // Format currency
  const formatCurrency = (amount: string) => {
    const numAmount = parseInt(amount);
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(numAmount);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Table columns
  const columns: TableColumn<Order>[] = [
    {
      label: 'ORDER',
      accessor: 'orderId',
      render: (row) => (
        <div className="space-y-1">
          <button
            onClick={() => handleView(row)}
            className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
          >
            {row.orderId}
          </button>
          <div className="text-sm text-gray-500">
            {new Date(row.createdAt).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </div>
        </div>
      ),
    },
    {
      label: 'CUSTOMER',
      accessor: 'user',
      render: (row) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {row.user.firstName} {row.user.lastName}
          </div>
          <div className="text-sm text-gray-500">{row.user.email}</div>
        </div>
      ),
    },
    {
      label: 'ITEMS',
      accessor: 'itemCount',
      render: (row) => (
        <div className="text-center">
          <div className="font-medium">{row.itemCount}</div>
          <div className="text-sm text-gray-500">items</div>
        </div>
      ),
    },
    {
      label: 'TOTAL',
      accessor: 'totalPrice',
      render: (row) => (
        <div className="font-medium text-gray-900">
          {formatCurrency(row.totalPrice)}
        </div>
      ),
    },
    {
      label: 'STATUS',
      accessor: 'status',
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      label: 'PAYMENT REF',
      accessor: 'paymentReference',
      render: (row) => (
        <div className="font-mono text-sm text-gray-600">
          {row.paymentReference}
        </div>
      ),
    },
  ];

  // Actions for each row
  const actions = (row: Order) => (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => handleView(row)}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        title="View Order Details"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleStatusUpdate(row)}
        className="p-1 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
        title="Update Status"
      >
        <Edit className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="w-full mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Orders</h1>
            <p className="text-gray-500">Manage customer orders and track fulfillment</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              icon={<RefreshCw className="w-4 h-4" />}
              variant="tertiary"
              onClick={() => loadOrders()}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="font-medium mb-3">Filter & Search</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by customer name, email, or order ID"
            />
          </div>
          <Select
            label="Status"
            placeholder="All Status"
            value={statusFilter}
            onChange={handleStatusFilter}
            options={[
              { label: 'All Status', value: '' },
              { label: 'Pending', value: 'pending' },
              { label: 'Processing', value: 'processing' },
              { label: 'Shipped', value: 'shipped' },
              { label: 'Completed', value: 'completed' },
              { label: 'Cancelled', value: 'cancelled' },
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
        data={orders}
        actions={actions}
        isLoading={isLoading}
        emptyMessage="No orders found"
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

      {/* Status Update Modal */}
      <OrderStatusModal
        open={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setOrderToUpdate(null);
        }}
        onConfirm={handleConfirmStatusUpdate}
        currentStatus={orderToUpdate?.status || ''}
        orderId={orderToUpdate?.orderId || ''}
        isLoading={isUpdating}
      />
    </div>
  );
} 