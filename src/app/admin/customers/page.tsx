"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo, useEffect } from 'react';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Filter } from '@/components/ui/filter';
import { FilterDropdown } from '@/components/ui/filter-dropdown';
import { SubDropdown } from '@/components/ui/sub-dropdown';
import { useUsers, type UserFilterKey } from '@/store/admin/use-users';
import { Eye, MessageSquare } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import Link from 'next/link';
import { useFilter, type FilterConfig } from "@/hooks/use-filter";

type User = {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpend: string;
  lastOrder: string;
  consultation: 'Yes' | 'No';
};

const filterConfigs: FilterConfig[] = [
  {
    key: "consultation" as UserFilterKey,
    label: "Consultation",
    icon: <MessageSquare className="w-5 h-5" />,
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
  },
];

const columns: TableColumn<User>[] = [
  { label: 'NAME', accessor: 'name' },
  { label: 'EMAIL', accessor: 'email' },
  { label: 'TOTAL ORDERS', accessor: 'totalOrders' },
  { label: 'TOTAL SPEND', accessor: 'totalSpend' },
  { label: 'LAST ORDER', accessor: 'lastOrder' },
  { label: 'CONSULTATION', accessor: 'consultation' },
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
    filteredUsers,
    search,
    setSearch,
    filters,
    setFilter,
    removeFilter,
    isLoading: isUsersLoading,
  } = useUsers();

  // Add logging for filtered results
  useEffect(() => {
    console.log('Table data status:', {
      filteredUsers: filteredUsers.map(u => u.name),
      searchTerm: search,
      filters,
      totalResults: filteredUsers.length
    });
  }, [filteredUsers, search, filters]);

  const {
    subDropdown,
    isFilterOpen,
    setIsFilterOpen,
    setSubDropdown,
    availableFilters,
    getSubOptions,
  } = useFilter<UserFilterKey>(filterConfigs);

  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);

  // Pagination configuration
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Get paginated data
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const slicedData = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    console.log('CustomersPage - Paginated data:', {
      totalFiltered: filteredUsers.length,
      currentPage,
      itemsPerPage,
      slicedDataCount: slicedData.length,
      slicedData: slicedData.map(u => u.name)
    });
    return slicedData;
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = async (page: number) => {
    setIsPaginationLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsPaginationLoading(false);
  };

  // Initial page load simulation
  useEffect(() => {
    const loadInitialData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsPageLoading(false);
    };
    loadInitialData();
  }, []);

  // Reset to first page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  const isLoading = isPageLoading || isPaginationLoading || isUsersLoading;

  // Add logging for filtered results
  useEffect(() => {
    console.log('Table data status:', {
      filteredUsers: filteredUsers.map(u => u.name),
      paginatedUsers: paginatedUsers.map(u => u.name),
      searchTerm: search,
      isLoading
    });
  }, [filteredUsers, paginatedUsers, search, isLoading]);

  return (
    <div className="w-full mx-auto" >
      <h1 className="text-2xl font-semibold mb-1">Customer</h1>
      <p className="text-gray-500 mb-6">View all registered customers</p>
      <Table 
        columns={columns} 
        data={paginatedUsers}
        isLoading={isLoading}
        footerContent={
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        }
      >
        <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 pb-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search Customer Name/Email"
            className="md:w-72"
          />
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {/* Active filters as pills */}
            {Object.entries(filters).map(([key, value]) => (
              <span key={key} className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs border border-gray-200">
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                <button
                  className="ml-1 text-gray-400 hover:text-gray-700"
                  onClick={() => removeFilter(key as UserFilterKey)}
                  aria-label="Remove filter"
                >
                  &times;
                </button>
              </span>
            ))}
            {/* Filter button and dropdown */}
            <Filter 
              buttonLabel="Filter" 
              hasSubDropdownOpen={!!subDropdown}
              onOpenChange={setIsFilterOpen}
            >
              {subDropdown !== 'consultation' ? (
                <FilterDropdown
                  options={availableFilters}
                  selected={subDropdown || undefined}
                  onSelect={(val) => {
                    setSubDropdown(val as UserFilterKey);
                    if (val === 'consultation') {
                      setIsFilterOpen(true);
                    }
                  }}
                />
              ) : (
                <SubDropdown
                  options={getSubOptions('consultation')}
                  selected={filters['consultation']}
                  onSelect={(val) => {
                    setFilter('consultation', val);
                    setSubDropdown(null);
                    setIsFilterOpen(false);
                  }}
                  onClose={() => {
                    setSubDropdown(null);
                    setIsFilterOpen(true);
                  }}
                  title="Consultation"
                />
              )}
            </Filter>
          </div>
        </div>
      </Table>
    </div>
  );
} 