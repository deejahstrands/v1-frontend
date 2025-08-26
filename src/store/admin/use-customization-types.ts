import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  customizationTypeService,
  CustomizationType,
  CreateCustomizationTypeData,
  UpdateCustomizationTypeData,
} from "@/services/admin";

// Global flag to prevent multiple simultaneous fetches
let globalCustomizationTypesFetching = false;

interface CustomizationTypesState {
  // Data
  types: CustomizationType[];
  currentType: CustomizationType | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Frontend pagination
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;

  // Filters
  filters: {
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };

  // Error handling
  error: string | null;

  // Actions
  setTypes: (types: CustomizationType[]) => void;
  setCurrentType: (type: CustomizationType | null) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setFilters: (filters: Partial<CustomizationTypesState["filters"]>) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // CRUD Operations
  fetchTypes: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => Promise<void>;
  fetchType: (id: string) => Promise<void>;
  createType: (data: CreateCustomizationTypeData) => Promise<CustomizationType | null>;
  updateType: (id: string, data: UpdateCustomizationTypeData) => Promise<CustomizationType | null>;
  deleteType: (id: string) => Promise<boolean>;

  // Utility actions
  resetState: () => void;

  // Helper functions
  hasActiveFilters: () => boolean;
  getActiveFilters: () => Partial<CustomizationTypesState["filters"]>;
  getPaginatedTypes: () => CustomizationType[];

  // Computed values
  totalPages: number;
}

const initialState = {
  types: [],
  currentType: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  filters: {
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  },
  error: null,
};

export const useCustomizationTypesStore = create<CustomizationTypesState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Setters
      setTypes: (types) => set({ types }),
      setCurrentType: (type) => set({ currentType: type }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
          currentPage: 1,
        })),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Computed values
      get totalPages() {
        const state = get();
        if (!state) return 1;

        let filteredCount = state.types?.length || 0;

        // Apply search filter
        if (state.filters?.search) {
          filteredCount = (state.types || []).filter(
            (type) =>
              type.name
                .toLowerCase()
                .includes(state.filters.search.toLowerCase()) ||
              type.description
                .toLowerCase()
                .includes(state.filters.search.toLowerCase())
          ).length;
        }

        return Math.ceil(filteredCount / (state.itemsPerPage || 10));
      },

      // Function version of paginatedTypes
      getPaginatedTypes: () => {
        const state = get();
        if (!state) {
          return [];
        }

        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;

        let filteredTypes = state.types || [];

        // Apply search filter
        if (state.filters?.search) {
          filteredTypes = filteredTypes.filter(
            (type) =>
              type.name
                .toLowerCase()
                .includes(state.filters.search.toLowerCase()) ||
              type.description
                .toLowerCase()
                .includes(state.filters.search.toLowerCase())
          );
        }

        // Apply sorting
        if (state.filters?.sortBy) {
          filteredTypes = [...filteredTypes].sort((a, b) => {
            const aValue = a[state.filters.sortBy as keyof CustomizationType];
            const bValue = b[state.filters.sortBy as keyof CustomizationType];

            if (typeof aValue === "string" && typeof bValue === "string") {
              return state.filters.sortOrder === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }

            if (typeof aValue === "number" && typeof bValue === "number") {
              return state.filters.sortOrder === "asc"
                ? aValue - bValue
                : bValue - aValue;
            }

            return 0;
          });
        }

        const result = filteredTypes.slice(startIndex, endIndex);
        return result;
      },

      // Fetch all types
      fetchTypes: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
      }) => {
        const state = get();
        if (globalCustomizationTypesFetching || state.isLoading) {
          return;
        }

        try {
          globalCustomizationTypesFetching = true;
          set({ isLoading: true, error: null });

          const response = await customizationTypeService.getCustomizationTypes(params);

          set({
            types: response.data,
            totalItems: response.meta.totalItems,
            currentPage: response.meta.page,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch customization types";
          set({ error: errorMessage });
          console.error("❌ Error fetching customization types:", error);
        } finally {
          globalCustomizationTypesFetching = false;
          set({ isLoading: false });
        }
      },

      // Fetch single type
      fetchType: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          // For now, find from local state since we don't have a single type endpoint
          const state = get();
          const type = state.types.find(t => t.id === id);
          
          if (type) {
            set({ currentType: type });
          } else {
            set({ error: "Customization type not found" });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch customization type";
          set({ error: errorMessage });
          console.error("Error fetching customization type:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Create type
      createType: async (data: CreateCustomizationTypeData) => {
        try {
          set({ isCreating: true, error: null });

          const response = await customizationTypeService.createCustomizationType(data);

          // Refetch types to get the latest data
          await get().fetchTypes();

          return response.type;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create customization type";
          set({ error: errorMessage });
          console.error("Error creating customization type:", error);
          return null;
        } finally {
          set({ isCreating: false });
        }
      },

      // Update type
      updateType: async (id: string, data: UpdateCustomizationTypeData) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await customizationTypeService.updateCustomizationType(id, data);

          // Refetch types to get the latest data
          await get().fetchTypes();

          return response.type;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update customization type";
          set({ error: errorMessage });
          console.error("Error updating customization type:", error);
          return null;
        } finally {
          set({ isUpdating: false });
        }
      },

      // Delete type
      deleteType: async (id: string) => {
        try {
          set({ isDeleting: true, error: null });

          await customizationTypeService.deleteCustomizationType(id);

          // Refetch types to get the latest data
          await get().fetchTypes();

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to delete customization type";
          set({ error: errorMessage });
          console.error("Error deleting customization type:", error);
          return false;
        } finally {
          set({ isDeleting: false });
        }
      },

      // Helper functions
      hasActiveFilters: () => {
        const state = get();
        return (
          state.filters.search !== "" ||
          state.filters.sortBy !== "createdAt" ||
          state.filters.sortOrder !== "desc"
        );
      },

      getActiveFilters: () => {
        const state = get();
        const activeFilters: Partial<CustomizationTypesState["filters"]> = {};

        if (state.filters.search !== "")
          activeFilters.search = state.filters.search;
        if (state.filters.sortBy !== "createdAt")
          activeFilters.sortBy = state.filters.sortBy;
        if (state.filters.sortOrder !== "desc")
          activeFilters.sortOrder = state.filters.sortOrder;

        return activeFilters;
      },

      // Reset state
      resetState: () => set(initialState),
    }),
    {
      name: "admin-customization-types-store",
    }
  )
);

// Selector functions to compute derived state
export const selectPaginatedTypes = (
  state: CustomizationTypesState
): CustomizationType[] => {
  if (!state || !state.types) {
    return [];
  }

  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const endIndex = startIndex + state.itemsPerPage;

  let filteredTypes = state.types || [];

  // Apply search filter
  if (state.filters?.search) {
    filteredTypes = filteredTypes.filter(
      (type) =>
        type.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        type.description
          .toLowerCase()
          .includes(state.filters.search.toLowerCase())
    );
  }

  // Apply sorting
  if (state.filters?.sortBy) {
    filteredTypes = [...filteredTypes].sort((a, b) => {
      const aValue = a[state.filters.sortBy as keyof CustomizationType];
      const bValue = b[state.filters.sortBy as keyof CustomizationType];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return state.filters.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return state.filters.sortOrder === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }

  const result = filteredTypes.slice(startIndex, endIndex);
  return result;
};

export const selectTotalPages = (state: CustomizationTypesState): number => {
  let filteredCount = state.types?.length || 0;

  // Apply search filter
  if (state.filters?.search) {
    filteredCount = (state.types || []).filter(
      (type) =>
        type.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        type.description
          .toLowerCase()
          .includes(state.filters.search.toLowerCase())
    ).length;
  }

  return Math.ceil(filteredCount / (state.itemsPerPage || 10));
};
