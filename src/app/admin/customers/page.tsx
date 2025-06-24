"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import { Table, TableColumn } from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { Filter } from '@/components/ui/filter';
import { FilterDropdown, FilterOption } from '@/components/ui/filter-dropdown';
import { SubDropdown } from '@/components/ui/sub-dropdown';
import { useUsers, UserFilterKey } from '@/store/admin/use-users';
import { Eye } from "lucide-react";
import { Pagination } from '@/components/ui/pagination';
import Link from 'next/link';

const consultationOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const filterOptions: FilterOption[] = [
  {
    label: 'Consultation',
    value: 'consultation',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M8 12h8M12 8v8" /></svg>
    ),
  },
];

const columns: TableColumn<any>[] = [
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

export default function AdminUsersPage() {
  const {
    filteredUsers,
    search,
    setSearch,
    filters,
    setFilter,
    removeFilter,
  } = useUsers();

  const [currentPage, setCurrentPage] = useState(1);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [subDropdown, setSubDropdown] = useState<UserFilterKey | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);

  // Pagination configuration
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Get paginated data
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

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

  // Only show filters not already active
  const availableFilters = filterOptions.filter(f => !(f.value in filters));

  return (
    <div className="w-full mx-auto" >
      <h1 className="text-2xl font-semibold mb-1">Customer</h1>
      <p className="text-gray-500 mb-6">View all registered customers</p>
      <Table 
        columns={columns} 
        data={paginatedUsers}
        isLoading={isPageLoading || isPaginationLoading}
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
            onSearch={setSearch}
            placeholder="Search Order ID"
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
            <Filter buttonLabel="Filter">
              <FilterDropdown
                options={availableFilters}
                selected={subDropdown || undefined}
                onSelect={(val) => setSubDropdown(val as UserFilterKey)}
              />
              {/* SubDropdown for filter value selection */}
              {subDropdown === 'consultation' && (
                <SubDropdown
                  options={consultationOptions}
                  selected={filters['consultation']}
                  onSelect={(val) => {
                    setFilter('consultation', val);
                    setSubDropdown(null);
                  }}
                  onClose={() => setSubDropdown(null)}
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