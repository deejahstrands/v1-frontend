import { create } from "zustand";

type CategoryFilterState = {
  selectedCategory: string;
  setCategory: (category: string) => void;
};

export const useCategoryFilter = create<CategoryFilterState>((set) => ({
  selectedCategory: "All",
  setCategory: (category) => set({ selectedCategory: category }),
})); 