import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  categoryService,
  AdminCategory,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/services/admin";

// Global flag to prevent multiple simultaneous category fetches
let globalCategoriesFetching = false;

interface CategoriesState {
  // Data
  categories: AdminCategory[];
  currentCategory: AdminCategory | null;

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
    sortBy: string;
    sortOrder: "asc" | "desc";
  };

  // Error handling
  error: string | null;

  // Actions
  setCategories: (categories: AdminCategory[]) => void;
  setCurrentCategory: (category: AdminCategory | null) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setFilters: (filters: Partial<CategoriesState["filters"]>) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // CRUD Operations
  fetchCategories: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => Promise<void>;

  fetchCategory: (id: string) => Promise<void>;

  createCategory: (data: CreateCategoryData) => Promise<AdminCategory | null>;

  updateCategory: (
    id: string,
    data: UpdateCategoryData
  ) => Promise<AdminCategory | null>;

  deleteCategory: (id: string) => Promise<boolean>;

  restoreCategory: (id: string) => Promise<boolean>;

  bulkUpdateStatus: (
    categoryIds: string[],
    status: "active" | "inactive"
  ) => Promise<boolean>;

  bulkDelete: (categoryIds: string[]) => Promise<boolean>;

  // Utility actions
  resetState: () => void;

  // Helper functions
  hasActiveFilters: () => boolean;
  getActiveFilters: () => Partial<CategoriesState["filters"]>;

  testSetCategories: (testCategories: AdminCategory[]) => void;
  getPaginatedCategories: () => AdminCategory[];

  // Computed values
  totalPages: number;
}

const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  filters: {
    search: "",
    status: "", // Empty means "all statuses"
    sortBy: "createdAt", // Default sort
    sortOrder: "desc" as const, // Default order
  },
  error: null,
};

export const useCategoriesStore = create<CategoriesState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Setters
      setCategories: (categories) => set({ categories }),
      setCurrentCategory: (category) => set({ currentCategory: category }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
          currentPage: 1, // Reset to first page when filters change
        })),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Computed values
      get totalPages() {
        const state = get();
        if (!state) return 1;

        let filteredCount = state.categories?.length || 0;

        // Apply search filter
        if (state.filters?.search) {
          filteredCount = (state.categories || []).filter(
            (cat) =>
              cat.name
                .toLowerCase()
                .includes(state.filters.search.toLowerCase()) ||
              cat.description
                .toLowerCase()
                .includes(state.filters.search.toLowerCase())
          ).length;
        }

        // Apply status filter
        if (state.filters?.status) {
          filteredCount = (state.categories || []).filter(
            (cat) => cat.status === state.filters.status
          ).length;
        }

        return Math.ceil(filteredCount / (state.itemsPerPage || 10));
      },

      // Function version of paginatedCategories
      getPaginatedCategories: () => {
        const state = get();
        if (!state) {
          return [];
        }

        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;

        let filteredCategories = state.categories || [];

        // Apply search filter
        if (state.filters?.search) {
          filteredCategories = filteredCategories.filter(
            (cat) =>
              cat.name
                .toLowerCase()
                .includes(state.filters.search.toLowerCase()) ||
              cat.description
                .toLowerCase()
                .includes(state.filters.search.toLowerCase())
          );
        }

        // Apply status filter
        if (state.filters?.status) {
          filteredCategories = filteredCategories.filter(
            (cat) => cat.status === state.filters.status
          );
        }

        // Apply sorting
        if (state.filters?.sortBy) {
          filteredCategories = [...filteredCategories].sort((a, b) => {
            const aValue = a[state.filters.sortBy as keyof AdminCategory];
            const bValue = b[state.filters.sortBy as keyof AdminCategory];

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

        const result = filteredCategories.slice(startIndex, endIndex);
        return result;
      },

      // Fetch all categories
      fetchCategories: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }) => {
        const state = get();
        // Prevent multiple simultaneous calls using global flag
        if (globalCategoriesFetching || state.isLoading) {
          return;
        }

        try {
          globalCategoriesFetching = true;
          set({ isLoading: true, error: null });

          // Use provided params or current state filters, but only include non-empty values
          const queryParams: {
            page: number;
            limit: number;
            search?: string;
            status?: string;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
          } = {
            page: params?.page || state.currentPage,
            limit: params?.limit || state.itemsPerPage,
          };

          // Only add search if provided or if current state has a non-empty search
          if (params?.search !== undefined) {
            queryParams.search = params.search;
          } else if (state.filters.search) {
            queryParams.search = state.filters.search;
          }

          // Only add status if provided or if current state has a non-empty status
          if (params?.status !== undefined) {
            queryParams.status = params.status;
          } else if (state.filters.status) {
            queryParams.status = state.filters.status;
          }

          // Only add sorting if explicitly provided
          if (params?.sortBy) {
            queryParams.sortBy = params.sortBy;
          }
          if (params?.sortOrder) {
            queryParams.sortOrder = params.sortOrder;
          }

          const response = await categoryService.getCategories(queryParams);

          const newState = {
            categories: response.data,
            totalItems: response.data.length,
            currentPage: queryParams.page,
          };

          // Test the set function
          set(newState);

          // Wait a bit and check the state
          setTimeout(() => {
            get(); // Check state without assigning to unused variable
          }, 100);

          // Verify the state was updated
          get(); // Check state without assigning to unused variable
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch categories";
          set({ error: errorMessage });
          console.error("❌ Error fetching categories:", error);
        } finally {
          globalCategoriesFetching = false;
          set({ isLoading: false });
        }
      },

      // Fetch single category
      fetchCategory: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await categoryService.getCategory(id);

          set({ currentCategory: response.data });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch category";
          set({ error: errorMessage });
          console.error("Error fetching category:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Create category
      createCategory: async (data: CreateCategoryData) => {
        try {
          set({ isCreating: true, error: null });

          const response = await categoryService.createCategory(data);

          // Add to local state
          set((state) => ({
            categories: [response.data, ...state.categories],
            currentCategory: response.data,
          }));

          return response.data;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to create category";
          set({ error: errorMessage });
          console.error("Error creating category:", error);
          return null;
        } finally {
          set({ isCreating: false });
        }
      },

      // Update category
      updateCategory: async (id: string, data: UpdateCategoryData) => {
        try {
          set({ isUpdating: true, error: null });

          const response = await categoryService.updateCategory(id, data);

          // Update in local state
          set((state) => ({
            categories: state.categories.map((cat) =>
              cat.id === id ? response.data : cat
            ),
            currentCategory: response.data,
          }));

          return response.data;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update category";
          set({ error: errorMessage });
          console.error("Error updating category:", error);
          return null;
        } finally {
          set({ isUpdating: false });
        }
      },

      // Delete category
      deleteCategory: async (id: string) => {
        try {
          set({ isDeleting: true, error: null });

          await categoryService.deleteCategory(id);

          // Remove from local state
          set((state) => ({
            categories: state.categories.filter((cat) => cat.id !== id),
            currentCategory:
              state.currentCategory?.id === id ? null : state.currentCategory,
          }));

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to delete category";
          set({ error: errorMessage });
          console.error("Error deleting category:", error);
          return false;
        } finally {
          set({ isDeleting: false });
        }
      },

      // Restore category
      restoreCategory: async (id: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await categoryService.restoreCategory(id);

          // Update in local state
          set((state) => ({
            categories: state.categories.map((cat) =>
              cat.id === id ? response.data : cat
            ),
            currentCategory: response.data,
          }));

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to restore category";
          set({ error: errorMessage });
          console.error("Error restoring category:", error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // Bulk update status
      bulkUpdateStatus: async (
        categoryIds: string[],
        status: "active" | "inactive"
      ) => {
        try {
          set({ isLoading: true, error: null });

          await categoryService.bulkUpdateStatus(categoryIds, status);

          // Update in local state
          set((state) => ({
            categories: state.categories.map((cat) =>
              categoryIds.includes(cat.id) ? { ...cat, status } : cat
            ),
          }));

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to bulk update status";
          set({ error: errorMessage });
          console.error("Error bulk updating status:", error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // Bulk delete
      bulkDelete: async (categoryIds: string[]) => {
        try {
          set({ isLoading: true, error: null });

          await categoryService.bulkDelete(categoryIds);

          // Remove from local state
          set((state) => ({
            categories: state.categories.filter(
              (cat) => !categoryIds.includes(cat.id)
            ),
            currentCategory:
              state.currentCategory &&
              categoryIds.includes(state.currentCategory.id)
                ? null
                : state.currentCategory,
          }));

          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to bulk delete categories";
          set({ error: errorMessage });
          console.error("Error bulk deleting categories:", error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // Helper functions
      hasActiveFilters: () => {
        const state = get();
        return (
          state.filters.search !== "" ||
          state.filters.status !== "" ||
          state.filters.sortBy !== "createdAt" ||
          state.filters.sortOrder !== "desc"
        );
      },

      getActiveFilters: () => {
        const state = get();
        const activeFilters: Partial<CategoriesState["filters"]> = {};

        if (state.filters.search !== "")
          activeFilters.search = state.filters.search;
        if (state.filters.status !== "")
          activeFilters.status = state.filters.status;
        if (state.filters.sortBy !== "createdAt")
          activeFilters.sortBy = state.filters.sortBy;
        if (state.filters.sortOrder !== "desc")
          activeFilters.sortOrder = state.filters.sortOrder;

        return activeFilters;
      },

      // Test function to manually set categories
      testSetCategories: (testCategories: AdminCategory[]) => {
        set({ categories: testCategories, totalItems: testCategories.length });
      },

      // Reset state
      resetState: () => set(initialState),
    }),
    {
      name: "admin-categories-store",
    }
  )
);

// Selector functions to compute derived state
export const selectPaginatedCategories = (
  state: CategoriesState
): AdminCategory[] => {
  // Ensure state exists and has required properties
  if (!state || !state.categories) {
    return [];
  }

  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const endIndex = startIndex + state.itemsPerPage;

  let filteredCategories = state.categories || [];

  // Apply search filter
  if (state.filters?.search) {
    filteredCategories = filteredCategories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        cat.description
          .toLowerCase()
          .includes(state.filters.search.toLowerCase())
    );
  }

  // Apply status filter
  if (state.filters?.status) {
    filteredCategories = filteredCategories.filter(
      (cat) => cat.status === state.filters.status
    );
  }

  // Apply sorting
  if (state.filters?.sortBy) {
    filteredCategories = [...filteredCategories].sort((a, b) => {
      const aValue = a[state.filters.sortBy as keyof AdminCategory];
      const bValue = b[state.filters.sortBy as keyof AdminCategory];

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

  const result = filteredCategories.slice(startIndex, endIndex);

  return result;
};

export const selectTotalPages = (state: CategoriesState): number => {
  let filteredCount = state.categories?.length || 0;

  // Apply search filter
  if (state.filters?.search) {
    filteredCount = (state.categories || []).filter(
      (cat) =>
        cat.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        cat.description
          .toLowerCase()
          .includes(state.filters.search.toLowerCase())
    ).length;
  }

  // Apply status filter
  if (state.filters?.status) {
    filteredCount = (state.categories || []).filter(
      (cat) => cat.status === state.filters.status
    ).length;
  }

  return Math.ceil(filteredCount / (state.itemsPerPage || 10));
};
