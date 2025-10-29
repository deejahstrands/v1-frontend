"use client";

import { useState, useEffect } from 'react';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { useCustomerManagement } from '@/hooks/admin/use-customer-management';
import { Eye } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import Link from 'next/link';
import { useDebounce } from '@/hooks/use-debounce';
import { AdminCustomer } from '@/services/admin/customer.service';

const columns: TableColumn<AdminCustomer>[] = [
  { 
    label: 'NAME', 
    accessor: 'firstName',
    render: (row) => `${row.firstName} ${row.lastName}`
  },
  { label: 'EMAIL', accessor: 'email' },
  { label: 'TOTAL ORDERS', accessor: 'totalOrders' },
  { 
    label: 'TOTAL SPEND', 
    accessor: 'totalSpend',
    render: (row) => `₦${row.totalSpend.toLocaleString()}`
  },
  { 
    label: 'LAST ORDER', 
    accessor: 'lastOrderDate',
    render: (row) => row.lastOrderDate 
      ? new Date(row.lastOrderDate).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        })
      : 'No orders'
  },
  {
    label: 'STATUS',
    accessor: 'isActive',
    render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {row.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    label: 'ACTION',
    accessor: 'action',
    render: (row) => (
      <Link 
        href={`/admin/customers/${row.id}`} 
        className="text-primary text-xs flex items-center justify-center hover:text-primary/80 transition-colors" 
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </Link>
    ),
  },
];

export default function AdminCustomersPage() {
  const {
    customers,
    isLoading,
    error,
    currentPage,
    totalPages,
    loadCustomers,
    handlePageChange,
    clearError,
  } = useCustomerManagement();

  // Local state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('');

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search and filters with debouncing
  useEffect(() => {
    const searchParams = {
      search: debouncedSearchTerm || undefined,
      page: 1,
      isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
    };
    
    loadCustomers(searchParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, statusFilter]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  // Clear filters
  const clearFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
    
    loadCustomers({
      page: 1,
      search: undefined,
      isActive: undefined,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter || searchTerm;

  return (
    <div className="w-full mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Customers</h1>
        <p className="text-gray-500">View all registered customers</p>
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
              placeholder="Search customers"
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
        data={customers}
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
    </div>
  );
} 