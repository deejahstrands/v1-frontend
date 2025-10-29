import { create } from "zustand";

type CategoryFilterState = {
  selectedCategory: string;
  selectedCategoryId: string | null;
  setCategory: (category: string, categoryId?: string) => void;
  setCategoryById: (categoryId: string, categoryName?: string) => void;
  clearFilter: () => void;
};

export const useCategoryFilter = create<CategoryFilterState>((set) => ({
  selectedCategory: "All",
  selectedCategoryId: null,
  
  setCategory: (category, categoryId) => set({ 
    selectedCategory: category,
    selectedCategoryId: categoryId || null
  }),
  
  setCategoryById: (categoryId, categoryName) => set({
    selectedCategoryId: categoryId,
    selectedCategory: categoryName || "Selected Category"
  }),
  
  clearFilter: () => set({
    selectedCategory: "All",
    selectedCategoryId: null
  })
})); 