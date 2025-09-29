"use client";

import { StatsCards } from "@/components/admin/overview/stats-cards";
import { QuickActions } from "@/components/admin/overview/quick-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useOverviewStore } from "@/store/admin/use-overview";
import { useState } from "react";

export default function AdminDashboardPage() {
  const { loadOverview, isLoading } = useOverviewStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadOverview(); // No since parameter = get all data
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePeriodChange = async (period: string) => {
    // Don't make API call if it's the same period
    if (period === selectedPeriod) {
      return;
    }
    
    setSelectedPeriod(period);
    setIsRefreshing(true);
    try {
      if (period === 'all') {
        await loadOverview(); // No since parameter = get all data
      } else {
        await loadOverview({ since: period as 'last_seven_days' | 'last_thirty_days' | 'last_three_months' | 'last_year' });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base lg:text-xl xl:text-2xl font-bold tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 text-xs xl:text-sm">
            {selectedPeriod === 'all' ? 'Showing all data' : `Showing data over the last ${selectedPeriod.replace('last_', '').replace('_', ' ')}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${(isRefreshing || isLoading) ? 'animate-spin' : ''}`} />
            <span>{(isRefreshing || isLoading) ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm">
                <span>{selectedPeriod === 'all' ? 'All Time' : selectedPeriod.replace('last_', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => handlePeriodChange('all')}>All Time</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange('last_seven_days')}>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange('last_thirty_days')}>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange('last_three_months')}>Last 3 Months</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange('last_year')}>Last Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <StatsCards selectedPeriod={selectedPeriod} />
      <QuickActions />
    </div>
  );
} 