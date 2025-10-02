/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { overviewService, OverviewData } from "@/services/admin/overview.service";

// Global state to prevent duplicate calls across all instances
let globalLoadingRef = false;

export const useOverview = () => {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load overview data
  const loadOverview = useCallback(async (params?: {
    since?:
      | 'this_week'
      | 'this_month'
      | 'last_seven_days'
      | 'last_thirty_days'
      | 'last_three_months'
      | 'last_six_months'
      | 'last_year';
  }): Promise<OverviewData | null> => {
    // Clear current data to show loading state
    setOverviewData(null);

    // Prevent duplicate calls
    if (globalLoadingRef) {
      return null;
    }

    try {
      globalLoadingRef = true;
      setIsLoading(true);
      setError(null);

      const response = await overviewService.getOverview(params);
      setOverviewData(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load overview data";
      setError(errorMessage);
      console.error("Error loading overview data:", err);
      return null;
    } finally {
      setIsLoading(false);
      globalLoadingRef = false;
    }
  }, []);

  // Refresh overview data
  const refreshOverview = useCallback(async (since?:
    | 'this_week'
    | 'this_month'
    | 'last_seven_days'
    | 'last_thirty_days'
    | 'last_three_months'
    | 'last_six_months'
    | 'last_year'
  ) => {
    return loadOverview({ since });
  }, [loadOverview]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset overview data when component unmounts
  useEffect(() => {
    return () => {
      setOverviewData(null);
      // Don't reset global state on unmount as other components might need it
    };
  }, []);

  return {
    overviewData,
    isLoading,
    error,
    loadOverview,
    refreshOverview,
    clearError,
  };
};
