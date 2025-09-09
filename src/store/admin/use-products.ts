/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  productService,
  AdminProduct,
  CreateProductData,
  UpdateProductData,
} from "@/services/admin";

// Global flag to prevent multiple simultaneous product fetches
let globalProductsFetching = false;

interface ProductsState {
  // Data
  products: AdminProduct[];
  currentProduct: AdminProduct | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Frontend pagination
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;

  // Filters
  filters: {
    search: string;
    categoryId: string;
    customization: string;
    visibility: string;
    status: string;
    featured: string;
    priceFrom: string;
    priceTo: string;
    sortBy: string;
  };

  // Error handling
  error: string | null;

  // Actions
  setProducts: (products: AdminProduct[]) => void;
  setCurrentProduct: (product: AdminProduct | null) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setFilters: (filters: Partial<ProductsState["filters"]>) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // CRUD Operations
  fetchProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    customization?: boolean;
    visibility?: 'hidden' | 'published';
    status?: 'available' | 'sold_out';
    featured?: boolean;
    priceFrom?: number;
    priceTo?: number;
    sortBy?: string;
  }) => Promise<void>;

  fetchProduct: (id: string) => Promise<void>;

  createProduct: (data: CreateProductData) => Promise<AdminProduct | null>;

  updateProduct: (
    id: string,
    data: UpdateProductData
  ) => Promise<AdminProduct | null>;

  deleteProduct: (id: string) => Promise<boolean>;

  changeProductStatus: (
    id: string,
    status: "available" | "sold_out"
  ) => Promise<boolean>;

  addToCollection: (
    productId: string,
    collectionId: string
  ) => Promise<boolean>;

  // Utility actions
  resetState: () => void;

  // Helper functions
  hasActiveFilters: () => boolean;
  getActiveFilters: () => Partial<ProductsState["filters"]>;

  testSetProducts: (testProducts: AdminProduct[]) => void;
  getPaginatedProducts: () => AdminProduct[];
}

const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  currentPage: 1,
  itemsPerPage: 12,
  totalItems: 0,
  totalPages: 0,
  filters: {
    search: "",
    categoryId: "",
    customization: "",
    visibility: "",
    status: "",
    featured: "",
    priceFrom: "",
    priceTo: "",
    sortBy: "",
  },
  error: null,
};

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setProducts: (products) => set({ products }),
      setCurrentProduct: (currentProduct) => set({ currentProduct }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      fetchProducts: async (params = {}) => {
        if (globalProductsFetching) return;
        globalProductsFetching = true;

        try {
          set({ isLoading: true, error: null });

          const response = await productService.getProducts({
            page: params.page || get().currentPage,
            limit: params.limit || get().itemsPerPage,
            search: params.search || get().filters.search || undefined,
            categoryId: params.categoryId || get().filters.categoryId || undefined,
            customization: params.customization !== undefined ? params.customization : 
              get().filters.customization ? get().filters.customization === 'true' : undefined,
            visibility: params.visibility || (get().filters.visibility as 'hidden' | 'published') || undefined,
            status: params.status || (get().filters.status as 'available' | 'sold_out') || undefined,
            featured: params.featured !== undefined ? params.featured : 
              get().filters.featured ? get().filters.featured === 'true' : undefined,
            priceFrom: params.priceFrom || (get().filters.priceFrom ? Number(get().filters.priceFrom) : undefined),
            priceTo: params.priceTo || (get().filters.priceTo ? Number(get().filters.priceTo) : undefined),
            sortBy: params.sortBy || get().filters.sortBy || undefined,
          });

          set({
            products: response.data,
            totalItems: response.meta.totalItems,
            totalPages: response.meta.totalPages,
            currentPage: response.meta.page,
            itemsPerPage: response.meta.limit || get().itemsPerPage,
            isLoading: false,
          });
        } catch (error: any) {
          console.error("Failed to fetch products:", error);
          set({
            error: error.response?.data?.message || "Failed to fetch products",
            isLoading: false,
          });
        } finally {
          globalProductsFetching = false;
        }
      },

      fetchProduct: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const response = await productService.getProduct(id);
          set({ currentProduct: response.data, isLoading: false });
        } catch (error: any) {
          console.error("Failed to fetch product:", error);
          set({
            error: error.response?.data?.message || "Failed to fetch product",
            isLoading: false,
          });
        }
      },

      createProduct: async (data) => {
        try {
          set({ isCreating: true, error: null });
          const response = await productService.createProduct(data);
          set({ isCreating: false });
          
          // Refresh the products list
          get().fetchProducts();
          
          return response.data;
        } catch (error: any) {
          console.error("Failed to create product:", error);
          set({
            error: error.response?.data?.message || "Failed to create product",
            isCreating: false,
          });
          return null;
        }
      },

      updateProduct: async (id, data) => {
        try {
          set({ isUpdating: true, error: null });
          const response = await productService.updateProduct(id, data);
          set({ isUpdating: false });
          
          // Refresh the products list
          get().fetchProducts();
          
          return response.data;
        } catch (error: any) {
          console.error("Failed to update product:", error);
          set({
            error: error.response?.data?.message || "Failed to update product",
            isUpdating: false,
          });
          return null;
        }
      },

      deleteProduct: async (id) => {
        try {
          set({ isDeleting: true, error: null });
          await productService.deleteProduct(id);
          set({ isDeleting: false });
          
          // Refresh the products list
          get().fetchProducts();
          
          return true;
        } catch (error: any) {
          console.error("Failed to delete product:", error);
          set({
            error: error.response?.data?.message || "Failed to delete product",
            isDeleting: false,
          });
          return false;
        }
      },

      changeProductStatus: async (id, status) => {
        try {
          set({ isUpdating: true, error: null });
          await productService.changeProductStatus(id, status);
          set({ isUpdating: false });
          
          // Refresh the products list
          get().fetchProducts();
          
          return true;
        } catch (error: any) {
          console.error("Failed to change product status:", error);
          set({
            error: error.response?.data?.message || "Failed to change product status",
            isUpdating: false,
          });
          return false;
        }
      },

      addToCollection: async (productId, collectionId) => {
        try {
          set({ isUpdating: true, error: null });
          await productService.addToCollection(productId, collectionId);
          set({ isUpdating: false });
          
          return true;
        } catch (error: any) {
          console.error("Failed to add product to collection:", error);
          set({
            error: error.response?.data?.message || "Failed to add product to collection",
            isUpdating: false,
          });
          return false;
        }
      },

      resetState: () => set(initialState),

      hasActiveFilters: () => {
        const { filters } = get();
        return !!(filters.search || filters.categoryId || filters.customization || 
                 filters.visibility || filters.status || filters.featured || 
                 filters.priceFrom || filters.priceTo);
      },

      getActiveFilters: () => {
        const { filters } = get();
        const activeFilters: Partial<ProductsState["filters"]> = {};
        
        if (filters.search) activeFilters.search = filters.search;
        if (filters.categoryId) activeFilters.categoryId = filters.categoryId;
        if (filters.customization) activeFilters.customization = filters.customization;
        if (filters.visibility) activeFilters.visibility = filters.visibility;
        if (filters.status) activeFilters.status = filters.status;
        if (filters.featured) activeFilters.featured = filters.featured;
        if (filters.priceFrom) activeFilters.priceFrom = filters.priceFrom;
        if (filters.priceTo) activeFilters.priceTo = filters.priceTo;
        
        return activeFilters;
      },

      testSetProducts: (testProducts) => set({ products: testProducts }),
      getPaginatedProducts: () => get().products,
    }),
    {
      name: "products-store",
    }
  )
);
