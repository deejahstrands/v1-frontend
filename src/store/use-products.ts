import { create } from "zustand";
import { 
  Product, 
  DetailedProduct,
  GetProductsParams 
} from "@/types/product";
import { productsService } from "@/services/products";

interface ProductsState {
  // State
  products: Product[];
  loading: boolean;
  error: string | null;
  
  // Filters
  filters: GetProductsParams;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  
  // Single product
  currentProduct: DetailedProduct | null;
  productLoading: boolean;
  productError: string | null;

  // Actions
  fetchProducts: (params?: GetProductsParams) => Promise<void>;
  fetchPublishedProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  searchProducts: (searchTerm: string, params?: Omit<GetProductsParams, 'search'>) => Promise<{ data: Product[] }>;
  getProductsByCategory: (categoryId: string, params?: Omit<GetProductsParams, 'categoryId'>) => Promise<void>;
  getProductsByPriceRange: (priceFrom: number, priceTo: number, params?: Omit<GetProductsParams, 'priceFrom' | 'priceTo'>) => Promise<void>;
  setFilters: (filters: Partial<GetProductsParams>) => void;
  clearFilters: () => void;
  clearError: () => void;
  clearProductError: () => void;
  reset: () => void;
  resetCurrentProduct: () => void;
  
  // Helper functions
  getProductById: (id: string) => Product | undefined;
  getAllProducts: () => Product[];
}

const initialState = {
  products: [],
  loading: false,
  error: null,
  
  // Filters
  filters: {},
  
  // Pagination
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrev: false,
  
  // Single product
  currentProduct: null,
  productLoading: false,
  productError: null,
};

export const useProducts = create<ProductsState>((set, get) => ({
  ...initialState,

  fetchProducts: async (params) => {
    set({ loading: true, error: null });
    
    try {
      const response = await productsService.getProducts(params);
      
      set({
        products: response.data,
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
        hasNext: response.meta.hasNext,
        hasPrev: response.meta.hasPrev,
        filters: params || {},
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
      });
    }
  },

  fetchPublishedProducts: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await productsService.getPublishedProducts();
      
      set({
        products: response.data,
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
        hasNext: response.meta.hasNext,
        hasPrev: response.meta.hasPrev,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
      });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await productsService.getFeaturedProducts();
      
      set({
        products: response.data,
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
        hasNext: response.meta.hasNext,
        hasPrev: response.meta.hasPrev,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
      });
    }
  },

  fetchProduct: async (id) => {
    set({ productLoading: true, productError: null });
    
    try {
      const response = await productsService.getDetailedProduct(id);
      
      set({
        currentProduct: response.data,
        productLoading: false,
        productError: null,
      });
    } catch (error) {
      set({
        productLoading: false,
        productError: error instanceof Error ? error.message : "Failed to fetch product",
      });
    }
  },

  searchProducts: async (searchTerm, params) => {
    try {
      const response = await productsService.searchProducts(searchTerm, params);
      return { data: response.data };
    } catch (error) {
      console.error("Failed to search products:", error);
      return { data: [] };
    }
  },

  getProductsByCategory: async (categoryId, params) => {
    set({ loading: true, error: null });
    
    try {
      const response = await productsService.getProductsByCategory(categoryId, params);
      
      set({
        products: response.data,
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
        hasNext: response.meta.hasNext,
        hasPrev: response.meta.hasPrev,
        filters: { ...params, categoryId },
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch products by category",
      });
    }
  },

  getProductsByPriceRange: async (priceFrom, priceTo, params) => {
    set({ loading: true, error: null });
    
    try {
      const response = await productsService.getProductsByPriceRange(priceFrom, priceTo, params);
      
      set({
        products: response.data,
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
        hasNext: response.meta.hasNext,
        hasPrev: response.meta.hasPrev,
        filters: { ...params, priceFrom, priceTo },
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch products by price range",
      });
    }
  },

  setFilters: (filters) => {
    set((state) => ({ 
      filters: { ...state.filters, ...filters } 
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => {
    set({ error: null });
  },

  clearProductError: () => {
    set({ productError: null });
  },

  reset: () => {
    set(initialState);
  },

  resetCurrentProduct: () => {
    set({
      currentProduct: null,
      productLoading: false,
      productError: null,
    });
  },

  // Helper functions
  getProductById: (id) => get().products.find((p) => p.id === id),
  getAllProducts: () => get().products,
  getCurrentProduct: () => get().currentProduct,
})); 