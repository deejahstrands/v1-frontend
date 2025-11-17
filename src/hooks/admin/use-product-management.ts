"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  productService,
  categoryService,
  AdminProduct,
  CreateProductData,
  UpdateProductData,
} from "@/services/admin";

// Global flags to prevent duplicate API calls
let globalProductsFetching = false;
let globalCategoriesFetching = false;

export interface ProductFormData {
  name: string;
  basePrice: number;
  categoryId: string;
  description: string;
  thumbnail?: File | string;
  status: "available" | "sold_out";
  quantityAvailable: number;
  visibility: "hidden" | "published";
  customization: boolean;
  featured: boolean;
  collectionId?: string;
  gallery?: Array<{
    url: string;
    type: "image" | "video";
  }>;
  specifications?: {
    length: string;
    density: string;
    color: string;
  };
  customizationData?: {
    types: string[];
    options: Array<{
      optionId: string;
      typeId: string;
      price: string;
      numericPrice: number;
    }>;
  };
  deliveryPreferenceData?: {
    fittings: Array<{
      id: string;
      price: number;
    }>;
    processingTimes: Array<{
      id: string;
      price: number;
    }>;
  };
}

export interface CategoryOption {
  id: string;
  name: string;
}

export const useProductManagement = (options?: {
  loadOnMount?: boolean; // shorthand for both products and categories
  loadProductsOnMount?: boolean;
  loadCategoriesOnMount?: boolean;
}) => {
  const { toast } = useToast();
  const toastRef = useRef(toast);

  // Update toast ref when toast changes
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  // State
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Load products
  const loadProducts = useCallback(
    async (params?: {
      page?: number;
      search?: string;
      categoryId?: string;
      status?: "available" | "sold_out";
      visibility?: "hidden" | "published";
      customization?: boolean;
    }) => {
      if (globalProductsFetching || isLoadingProducts) return;

      try {
        globalProductsFetching = true;
        setIsLoadingProducts(true);
        setError(null);

        const response = await productService.getProducts({
          page: params?.page || currentPage,
          limit: 10,
          search: params?.search,
          categoryId: params?.categoryId,
          status: params?.status,
          visibility: params?.visibility,
          customization: params?.customization,
        });

        setProducts(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.totalItems);
        setCurrentPage(response.meta.page);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products");
        toastRef.current.error("Failed to load products");
      } finally {
        setIsLoadingProducts(false);
        globalProductsFetching = false;
      }
    },
    []
  ); // eslint-disable-line react-hooks/exhaustive-deps

  // Load categories for dropdown
  const loadCategories = useCallback(async () => {
    if (globalCategoriesFetching || isLoadingCategories) return;

    try {
      globalCategoriesFetching = true;
      setIsLoadingCategories(true);

      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Error loading categories:", err);
      toastRef.current.error("Failed to load categories");
    } finally {
      setIsLoadingCategories(false);
      globalCategoriesFetching = false;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Create product
  const createProduct = async (data: ProductFormData) => {
    try {
      setIsSaving(true);
      setError(null);

      // Prepare data for API
      const createData: CreateProductData = {
        thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : "",
        name: data.name,
        basePrice: data.basePrice,
        description: data.description,
        status: data.status,
        totalQuantity: data.quantityAvailable,
        quantityAvailable: data.quantityAvailable,
        quantitySold: 0,
        gallery: data.gallery || [],
        visibility: data.visibility,
        featured: data.featured,
        customizations:
          data.customizationData?.options.map((opt) => ({
            customizationId: opt.optionId,
            price: opt.numericPrice,
          })) || [],
        categoryId: data.categoryId,
        collections: data.collectionId ? [data.collectionId] : [],
        fittingOptions:
          data.deliveryPreferenceData?.fittings.map((fitting) => ({
            fittingOptionId: fitting.id,
            price: fitting.price,
          })) || [],
        processingTimes:
          data.deliveryPreferenceData?.processingTimes.map((time) => ({
            processingTimeId: time.id,
            price: time.price,
          })) || [],
        productSpecifications: {
          length: data.specifications?.length || "",
          color: data.specifications?.color || "",
          density: data.specifications?.density || "",
        },
      };

      const response = await productService.createProduct(createData);

      toastRef.current.success("Product created successfully!");
      return response.data;
    } catch (err) {
      console.error("Error creating product:", err);
      const errorMessage = "Failed to create product";
      setError(errorMessage);
      toastRef.current.error(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Update product
  const updateProduct = async (id: string, data: Partial<ProductFormData>) => {
    try {
      setIsSaving(true);
      setError(null);

      // Prepare data for API
      const updateData: UpdateProductData = {
        thumbnail:
          typeof data.thumbnail === "string" ? data.thumbnail : undefined,
        name: data.name,
        basePrice: data.basePrice,
        description: data.description,
        status: data.status,
        totalQuantity: data.quantityAvailable,
        quantityAvailable: data.quantityAvailable,
        quantitySold: 0,
        gallery: data.gallery,
        visibility: data.visibility,
        featured: data.featured,
        customizations:
          data.customizationData?.options?.map((opt) => ({
            customizationId: opt.optionId,
            price: opt.numericPrice,
          })) || undefined,
        categoryId: data.categoryId,
        collections: data.collectionId ? [data.collectionId] : undefined,
        fittingOptions:
          data.deliveryPreferenceData?.fittings.map((fitting) => ({
            fittingOptionId: fitting.id,
            price: fitting.price,
          })) || undefined,
        processingTimes:
          data.deliveryPreferenceData?.processingTimes.map((time) => ({
            processingTimeId: time.id,
            price: time.price,
          })) || undefined,
        productSpecifications: data.specifications
          ? {
              length: data.specifications.length,
              color: data.specifications.color,
              density: data.specifications.density,
            }
          : undefined,
      };

      const response = await productService.updateProduct(id, updateData);

      toastRef.current.success("Product updated successfully!");
      return response.data;
    } catch (err) {
      console.error("Error updating product:", err);
      const errorMessage = "Failed to update product";
      setError(errorMessage);
      toastRef.current.error(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      setIsDeleting(true);
      setError(null);

      await productService.deleteProduct(id);

      // Reload products to remove the deleted one
      await loadProducts();

      toastRef.current.success("Product deleted successfully!");
      return true;
    } catch (err) {
      console.error("Error deleting product:", err);
      const errorMessage = "Failed to delete product";
      setError(errorMessage);
      toastRef.current.error(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Get single product
  const getProduct = async (id: string) => {
    try {
      const response = await productService.getProduct(id);
      return response.data;
    } catch (err) {
      console.error("Error getting product:", err);
      toastRef.current.error("Failed to load product details");
      throw err;
    }
  };

  // Change product status
  const changeProductStatus = async (
    id: string,
    status: "available" | "sold_out"
  ) => {
    try {
      await productService.changeProductStatus(id, status);
      await loadProducts();
      toastRef.current.success(`Product status changed to ${status}`);
    } catch (err) {
      console.error("Error changing product status:", err);
      toastRef.current.error("Failed to change product status");
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Resolve mount loading options (default true for backward compatibility)
  const shouldLoadProductsOnMount =
    options?.loadProductsOnMount ?? options?.loadOnMount ?? true;
  const shouldLoadCategoriesOnMount =
    options?.loadCategoriesOnMount ?? options?.loadOnMount ?? true;

  // Load data on mount (configurable)
  useEffect(() => {
    if (shouldLoadProductsOnMount) {
      loadProducts();
    }
    if (shouldLoadCategoriesOnMount) {
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoadProductsOnMount, shouldLoadCategoriesOnMount]);

  return {
    // Data
    products,
    categories,

    // Loading states
    isLoadingProducts,
    isLoadingCategories,
    isSaving,
    isDeleting,

    // Pagination
    currentPage,
    totalPages,
    totalItems,

    // Error handling
    error,
    clearError,

    // Actions
    loadProducts,
    loadCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    changeProductStatus,
    setCurrentPage,
  };
};
