/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { overviewService, OverviewData } from '@/services/admin/overview.service';

interface OverviewState {
  overviewData: OverviewData | null;
  isLoading: boolean;
  error: string | null;
  currentPeriod: string;
  isFiltering: boolean;
  isApiCallInProgress: boolean;
  
  // Actions
  setCurrentPeriod: (period: string) => void;
  setFiltering: (isFiltering: boolean) => void;
  loadOverview: (params?: {
    since?: 'last_seven_days' | 'last_thirty_days' | 'last_three_months' | 'last_year';
  }) => Promise<OverviewData | null>;
  clearError: () => void;
  reset: () => void;
}

export const useOverviewStore = create<OverviewState>((set, get) => ({
  overviewData: null,
  isLoading: false,
  error: null,
  currentPeriod: 'all',
  isFiltering: false,
  isApiCallInProgress: false,

  setCurrentPeriod: (period: string) => {
    set({ currentPeriod: period });
  },

  setFiltering: (isFiltering: boolean) => {
    set({ isFiltering });
  },

  loadOverview: async (params) => {
    const { isApiCallInProgress, currentPeriod, isFiltering } = get();
    const paramsKey = params?.since || 'all';
    
    // Prevent duplicate calls
    if (isApiCallInProgress) {
      console.log('API call already in progress, skipping duplicate call');
      return null;
    }

    // If we're filtering and switching periods, show loading
    if (isFiltering && currentPeriod !== paramsKey) {
      set({ 
        isLoading: true, 
        overviewData: null, 
        error: null,
        currentPeriod: paramsKey,
        isApiCallInProgress: true
      });
    } else if (!isFiltering) {
      // Initial load
      set({ 
        isLoading: true, 
        overviewData: null, 
        error: null,
        currentPeriod: paramsKey,
        isApiCallInProgress: true
      });
    } else {
      // Same period, just set loading state
      set({ 
        isLoading: true,
        isApiCallInProgress: true
      });
    }

    try {
      const response = await overviewService.getOverview(params);
      set({ 
        overviewData: response.data, 
        isLoading: false, 
        error: null,
        isFiltering: false,
        isApiCallInProgress: false
      });
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load overview data";
      set({ 
        error: errorMessage, 
        isLoading: false,
        isFiltering: false,
        isApiCallInProgress: false
      });
      console.error("Error loading overview data:", err);
      return null;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({ 
      overviewData: null, 
      isLoading: false, 
      error: null, 
      currentPeriod: 'all',
      isFiltering: false,
      isApiCallInProgress: false
    });
  },
}));
