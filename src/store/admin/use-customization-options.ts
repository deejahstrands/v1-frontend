import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  customizationOptionService,
  CustomizationOption,
  CreateCustomizationOptionData,
  UpdateCustomizationOptionData,
} from "@/services/admin";

// Global flag to prevent multiple simultaneous fetches
let globalCustomizationOptionsFetching = false;

interface CustomizationOptionsState {
  // Data
  options: CustomizationOption[];
  currentOption: CustomizationOption | null;

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
    status: string;
    typeId: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };

  // Error handling
  error: string | null;

  // Actions
  setOptions: (options: CustomizationOption[]) => void;
  setCurrentOption: (option: CustomizationOption | null) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setFilters: (filters: Partial<CustomizationOptionsState["filters"]>) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // CRUD Operations
  fetchOptions: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    typeId?: string;
  }) => Promise<void>;
  fetchOption: (id: string) => Promise<void>;
  createOption: (data: CreateCustomizationOptionData) => Promise<CustomizationOption | null>;
  updateOption: (id: string, data: UpdateCustomizationOptionData) => Promise<CustomizationOption | null>;
  deleteOption: (id: string) => Promise<boolean>;

  // Utility actions
  resetState: () => void;

  // Helper functions
  hasActiveFilters: () => boolean;
  getActiveFilters: () => Partial<CustomizationOptionsState["filters"]>;
  getPaginatedOptions: () => CustomizationOption[];

  // Computed values
  totalPages: number;
}

const initialState = {
  options: [],
  currentOption: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  filters: {
    search: "",
    status: "",
    typeId: "",
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  },
  error: null,
};

export const useCustomizationOptionsStore = create<CustomizationOptionsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Setters
      setOptions: (options) => set({ options }),
      setCurrentOption: (option) => set({ currentOption: option }),
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

        let filteredCount = state.options?.length || 0;

        // Apply search filter
        if (state.filters?.search) {
          filteredCount = (state.options || []).filter(
            (option) =>
              option.name
                .toLowerCase()
                .includes(state.filters.search.toLowerCase()) ||
              option.description
                .toLowerCase()
                .includes(state.filters.search.toLowerCase())
          ).length;
        }

        // Apply status filter
        if (state.filters?.status) {
          filteredCount = (state.options || []).filter(
            (option) => option.status === state.filters.status
          ).length;
        }

        // Apply type filter
        if (state.filters?.typeId) {
          filteredCount = (state.options || []).filter(
            (option) => option.customizationType.id === state.filters.typeId
          ).length;
        }

        return Math.ceil(filteredCount / (state.itemsPerPage || 10));
      },

      // Function version of paginatedOptions
      getPaginatedOptions: () => {
        const state = get();
        if (!state) {
          return [];
        }

        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;

        let filteredOptions = state.options || [];

        // Apply search filter
        if (state.filters?.search) {
          filteredOptions = filteredOptions.filter(
            (option) =>
              option.name
                .toLowerCase()
                .includes(state.filters.search.toLowerCase()) ||
              option.description
                .toLowerCase()
                .includes(state.filters.search.toLowerCase())
          );
        }

        // Apply status filter
        if (state.filters?.status) {
          filteredOptions = filteredOptions.filter(
            (option) => option.status === state.filters.status
          );
        }

        // Apply type filter
        if (state.filters?.typeId) {
          filteredOptions = filteredOptions.filter(
            (option) => option.customizationType.id === state.filters.typeId
          );
        }

        // Apply sorting
        if (state.filters?.sortBy) {
          filteredOptions = [...filteredOptions].sort((a, b) => {
            const aValue = a[state.filters.sortBy as keyof CustomizationOption];
            const bValue = b[state.filters.sortBy as keyof CustomizationOption];

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

        const result = filteredOptions.slice(startIndex, endIndex);
        return result;
      },

      // Fetch all options
      fetchOptions: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        typeId?: string;
      }) => {
        const state = get();
        if (globalCustomizationOptionsFetching || state.isLoading) {
          return;
        }

        try {
          globalCustomizationOptionsFetching = true;
          set({ isLoading: true, error: null });

          const response = await customizationOptionService.getCustomizationOptions(params);

          set({
            options: response.data,
            totalItems: response.meta.totalItems,
            currentPage: response.meta.page,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch customization options";
          set({ error: errorMessage });
          console.error("❌ Error fetching customization options:", error);
        } finally {
          globalCustomizationOptionsFetching = false;
          set({ isLoading: false });
        }
      },

      // Fetch single option
      fetchOption: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          // For now, find from local state since we don't have a single option endpoint
          const state = get();
          const option = state.options.find(o => o.id === id);
          
          if (option) {
            set({ currentOption: option });
          } else {
            set({ error: "Customization option not found" });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch customization option";
          set({ error: errorMessage });
          console.error("Error fetching customization option:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Create option
      createOption: async (data: CreateCustomizationOptionData) => {
        try {
          set({ isCreating: true, error: null });

          const response = await customizationOptionService.createCustomizationOption(data);

          // Refetch options to get the latest data
          await get().fetchOptions();

          return response.option;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create customization option";
          set({ error: errorMessage });
          console.error("Error creating customization option:", error);
          return null;
        } finally {
          set({ isCreating: false });
        }
      },

      // Update option
      updateOption: async (id: string, data: UpdateCustomizationOptionData) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await customizationOptionService.updateCustomizationOption(id, data);

          // Refetch options to get the latest data
          await get().fetchOptions();

          return response.option;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update customization option";
          set({ error: errorMessage });
          console.error("Error updating customization option:", error);
          return null;
        } finally {
          set({ isUpdating: false });
        }
      },

      // Delete option
      deleteOption: async (id: string) => {
        try {
          set({ isDeleting: true, error: null });

          await customizationOptionService.deleteCustomizationOption(id);

          // Refetch options to get the latest data
          await get().fetchOptions();

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to delete customization option";
          set({ error: errorMessage });
          console.error("Error deleting customization option:", error);
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
          state.filters.status !== "" ||
          state.filters.typeId !== "" ||
          state.filters.sortBy !== "createdAt" ||
          state.filters.sortOrder !== "desc"
        );
      },

      getActiveFilters: () => {
        const state = get();
        const activeFilters: Partial<CustomizationOptionsState["filters"]> = {};

        if (state.filters.search !== "")
          activeFilters.search = state.filters.search;
        if (state.filters.status !== "")
          activeFilters.status = state.filters.status;
        if (state.filters.typeId !== "")
          activeFilters.typeId = state.filters.typeId;
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
      name: "admin-customization-options-store",
    }
  )
);

// Selector functions to compute derived state
export const selectPaginatedOptions = (
  state: CustomizationOptionsState
): CustomizationOption[] => {
  if (!state || !state.options) {
    return [];
  }

  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const endIndex = startIndex + state.itemsPerPage;

  let filteredOptions = state.options || [];

  // Apply search filter
  if (state.filters?.search) {
    filteredOptions = filteredOptions.filter(
      (option) =>
        option.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        option.description
          .toLowerCase()
          .includes(state.filters.search.toLowerCase())
    );
  }

  // Apply status filter
  if (state.filters?.status) {
    filteredOptions = filteredOptions.filter(
      (option) => option.status === state.filters.status
    );
  }

  // Apply type filter
  if (state.filters?.typeId) {
    filteredOptions = filteredOptions.filter(
      (option) => option.customizationType.id === state.filters.typeId
    );
  }

  // Apply sorting
  if (state.filters?.sortBy) {
    filteredOptions = [...filteredOptions].sort((a, b) => {
      const aValue = a[state.filters.sortBy as keyof CustomizationOption];
      const bValue = b[state.filters.sortBy as keyof CustomizationOption];

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

  const result = filteredOptions.slice(startIndex, endIndex);
  return result;
};

export const selectTotalPages = (state: CustomizationOptionsState): number => {
  let filteredCount = state.options?.length || 0;

  // Apply search filter
  if (state.filters?.search) {
    filteredCount = (state.options || []).filter(
      (option) =>
        option.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        option.description
          .toLowerCase()
          .includes(state.filters.search.toLowerCase())
    ).length;
  }

  // Apply status filter
  if (state.filters?.status) {
    filteredCount = (state.options || []).filter(
      (option) => option.status === state.filters.status
    ).length;
  }

  // Apply type filter
  if (state.filters?.typeId) {
    filteredCount = (state.options || []).filter(
      (option) => option.customizationType.id === state.filters.typeId
    ).length;
  }

  return Math.ceil(filteredCount / (state.itemsPerPage || 10));
};
