import { create } from "zustand";
import { products } from "@/data/products";

export type Product = typeof products[number];

interface ProductsState {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  getAllProducts: () => Product[];
}

export const useProducts = create<ProductsState>((set, get) => ({
  products,
  getProductById: (id) => get().products.find((p) => p.id === id),
  getAllProducts: () => get().products,
})); 