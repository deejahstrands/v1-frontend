/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';

export type AdminFilterKey = 'status' | 'dateAdded' | 'consultation' | 'totalOrders' | 'totalSpend';

export interface FilterConfig {
  key: AdminFilterKey;
  label: string;
  icon: React.ReactNode;
  options: { label: string; value: string }[];
}

export interface UseAdminFilterOptions<T> {
  data: T[];
  filterConfigs: FilterConfig[];
  searchFields: (keyof T)[];
}

export function useAdminFilter<T extends Record<string, any>>({
  data,
  filterConfigs,
  searchFields
}: UseAdminFilterOptions<T>) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Partial<Record<AdminFilterKey, string>>>({});

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          return false;
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = item[key];
          if (typeof itemValue === 'string') {
            return itemValue === value;
          }
          return false;
        });
      }
    });

    return result;
  }, [data, search, filters, searchFields]);

  const setFilter = (key: AdminFilterKey, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key: AdminFilterKey) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const getFilterOptions = (key: AdminFilterKey) => {
    const config = filterConfigs.find(c => c.key === key);
    return config?.options || [];
  };

  return {
    filteredData,
    search,
    setSearch,
    filters,
    setFilter,
    removeFilter,
    clearAllFilters,
    getFilterOptions,
    filterConfigs,
  };
}
