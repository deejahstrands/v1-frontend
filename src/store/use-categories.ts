import { create } from "zustand";
import { 
  Category, 
  CategoryWithProducts,
  GetCategoriesParams, 
  GetCategoryWithProductsParams 
} from "@/types/category";
import { categoriesService } from "@/services/categories";

interface CategoriesState {
  // State
  categories: Category[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
  
  // Single category with products
  currentCategory: CategoryWithProducts | null;
  categoryLoading: boolean;
  categoryError: string | null;
  
  // Pagination (for categories list)
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;

  // Product pagination (for single category)
  productPage: number;
  productTotalPages: number;
  productTotalItems: number;
  productHasNext: boolean;
  productHasPrev: boolean;

  // Actions
  fetchCategories: (params?: GetCategoriesParams) => Promise<void>;
  fetchActiveCategories: () => Promise<void>;
  fetchCategoryWithProducts: (id: string, params?: GetCategoryWithProductsParams) => Promise<void>;
  setSelectedCategory: (categoryId: string) => void;
  clearError: () => void;
  clearCategoryError: () => void;
  reset: () => void;
  resetCurrentCategory: () => void;
}

const initialState = {
  categories: [],
  selectedCategory: "All",
  loading: false,
  error: null,
  
  // Single category state
  currentCategory: null,
  categoryLoading: false,
  categoryError: null,
  
  // Categories pagination
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrev: false,
  
  // Products pagination
  productPage: 1,
  productTotalPages: 1,
  productTotalItems: 0,
  productHasNext: false,
  productHasPrev: false,
};

export const useCategories = create<CategoriesState>((set) => ({
  ...initialState,

  fetchCategories: async (params) => {
    set({ loading: true, error: null });
    
    try {
      const response = await categoriesService.getCategories(params);
      
      set({
        categories: response.data,
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
        error: error instanceof Error ? error.message : "Failed to fetch categories",
      });
    }
  },

  fetchActiveCategories: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await categoriesService.getActiveCategories();
      
      set({
        categories: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch categories",
      });
    }
  },

  fetchCategoryWithProducts: async (id, params) => {
    set({ categoryLoading: true, categoryError: null });
    
    try {
      const response = await categoriesService.getCategoryWithProducts(id, params);
      
      set({
        currentCategory: response.data,
        productPage: response.data.products.meta.page,
        productTotalPages: response.data.products.meta.totalPages,
        productTotalItems: response.data.products.meta.totalItems,
        productHasNext: response.data.products.meta.hasNext,
        productHasPrev: response.data.products.meta.hasPrev,
        categoryLoading: false,
        categoryError: null,
      });
    } catch (error) {
      set({
        categoryLoading: false,
        categoryError: error instanceof Error ? error.message : "Failed to fetch category",
      });
    }
  },

  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId });
  },

  clearError: () => {
    set({ error: null });
  },

  clearCategoryError: () => {
    set({ categoryError: null });
  },

  reset: () => {
    set(initialState);
  },

  resetCurrentCategory: () => {
    set({
      currentCategory: null,
      categoryLoading: false,
      categoryError: null,
      productPage: 1,
      productTotalPages: 1,
      productTotalItems: 0,
      productHasNext: false,
      productHasPrev: false,
    });
  },
}));
