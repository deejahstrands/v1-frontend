/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  wigUnitService,
  WigUnit,
  CreateWigUnitData,
  UpdateWigUnitData,
} from "@/services/admin/wig-unit.service";

// Global flag to prevent multiple simultaneous wig unit fetches
let globalWigUnitsFetching = false;

interface WigUnitsState {
  // Data
  wigUnits: WigUnit[];
  currentWigUnit: WigUnit | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;

  // Search
  searchTerm: string;

  // Error handling
  error: string | null;

  // Actions
  setWigUnits: (wigUnits: WigUnit[]) => void;
  setCurrentWigUnit: (wigUnit: WigUnit | null) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // CRUD Operations
  fetchWigUnits: (params?: {
    page?: number;
    limit?: number;
  }) => Promise<void>;

  fetchWigUnit: (id: string) => Promise<void>;

  createWigUnit: (data: CreateWigUnitData) => Promise<WigUnit | null>;

  updateWigUnit: (
    id: string,
    data: UpdateWigUnitData
  ) => Promise<WigUnit | null>;

  deleteWigUnit: (id: string) => Promise<boolean>;

  // Utility actions
  resetState: () => void;

  // Helper functions
  getFilteredWigUnits: () => WigUnit[];
  getPaginatedWigUnits: () => WigUnit[];
}

const initialState = {
  wigUnits: [],
  currentWigUnit: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
  searchTerm: "",
  error: null,
};

export const useWigUnitsStore = create<WigUnitsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setWigUnits: (wigUnits) => set({ wigUnits }),
      setCurrentWigUnit: (currentWigUnit) => set({ currentWigUnit }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      fetchWigUnits: async (params = {}) => {
        if (globalWigUnitsFetching) return;
        globalWigUnitsFetching = true;

        try {
          set({ isLoading: true, error: null });

          const response = await wigUnitService.getWigUnits({
            page: params.page || get().currentPage,
            limit: params.limit || get().itemsPerPage,
          });

          set({
            wigUnits: response.data,
            totalItems: response.meta.totalItems,
            totalPages: response.meta.totalPages,
            currentPage: response.meta.page,
            itemsPerPage: response.meta.limit || get().itemsPerPage,
            isLoading: false,
          });
        } catch (error: any) {
          console.error("Failed to fetch wig units:", error);
          set({
            error: error.response?.data?.message || "Failed to fetch wig units",
            isLoading: false,
          });
        } finally {
          globalWigUnitsFetching = false;
        }
      },

      fetchWigUnit: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const response = await wigUnitService.getWigUnit(id);
          set({ currentWigUnit: response.data, isLoading: false });
        } catch (error: any) {
          console.error("Failed to fetch wig unit:", error);
          set({
            error: error.response?.data?.message || "Failed to fetch wig unit",
            isLoading: false,
          });
        }
      },

      createWigUnit: async (data) => {
        try {
          set({ isCreating: true, error: null });
          const response = await wigUnitService.createWigUnit(data);
          set({ isCreating: false });
          
          // Refresh the wig units list
          get().fetchWigUnits();
          
          return response.data;
        } catch (error: any) {
          console.error("Failed to create wig unit:", error);
          set({
            error: error.response?.data?.message || "Failed to create wig unit",
            isCreating: false,
          });
          return null;
        }
      },

      updateWigUnit: async (id, data) => {
        try {
          set({ isUpdating: true, error: null });
          const response = await wigUnitService.updateWigUnit(id, data);
          set({ isUpdating: false });
          
          // Return success indicator since update only returns message
          return { success: true, message: response.message };
        } catch (error: any) {
          console.error("Failed to update wig unit:", error);
          set({
            error: error.response?.data?.message || "Failed to update wig unit",
            isUpdating: false,
          });
          return null;
        }
      },

      deleteWigUnit: async (id) => {
        try {
          set({ isDeleting: true, error: null });
          await wigUnitService.deleteWigUnit(id);
          set({ isDeleting: false });
          
          // Refresh the wig units list
          get().fetchWigUnits();
          
          return true;
        } catch (error: any) {
          console.error("Failed to delete wig unit:", error);
          set({
            error: error.response?.data?.message || "Failed to delete wig unit",
            isDeleting: false,
          });
          return false;
        }
      },

      resetState: () => set(initialState),

      getFilteredWigUnits: () => {
        const { wigUnits, searchTerm } = get();
        if (!searchTerm) return wigUnits;
        
        return wigUnits.filter(unit =>
          unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          unit.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      },

      getPaginatedWigUnits: () => {
        const { currentPage, itemsPerPage } = get();
        const filteredUnits = get().getFilteredWigUnits();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUnits.slice(startIndex, endIndex);
      },
    }),
    {
      name: "wig-units-store",
    }
  )
);
