"use client";

import { useState } from "react";

export interface FilterOption {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export interface SubFilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  options: SubFilterOption[];
}

export function useFilter<T extends string>(
  configs: FilterConfig[],
  onFilterChange?: (filters: Record<T, string>) => void
) {
  const [filters, setFilters] = useState<Record<T, string>>({} as Record<T, string>);
  const [subDropdown, setSubDropdown] = useState<T | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Convert configs to filter options
  const filterOptions = configs.map(config => ({
    label: config.label,
    value: config.key,
    icon: config.icon,
  }));

  // Get sub-options for current filter
  const getSubOptions = (key: T) => {
    const config = configs.find(c => c.key === key);
    return config?.options || [];
  };

  // Only show filters not already active
  const availableFilters = filterOptions.filter(f => !(f.value in filters));

  const setFilter = (key: T, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const removeFilter = (key: T) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return {
    filters,          // current active filters
    subDropdown,      // current open sub-dropdown
    isFilterOpen,     // filter dropdown open state
    setIsFilterOpen,  // control filter dropdown
    setSubDropdown,   // control sub-dropdown
    setFilter,        // set a filter value
    removeFilter,     // remove a filter
    availableFilters, // filters not currently active
    getSubOptions,    // get options for a specific filter
  };
} 