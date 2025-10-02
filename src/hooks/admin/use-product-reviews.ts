/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useRef } from "react";
import { productReviewsService, ProductReview, ProductReviewsParams } from "@/services/admin/product-reviews.service";

// Global flag to prevent duplicate in-flight requests across re-renders/StrictMode
let globalProductReviewsLoading = false;

export const useProductReviews = (productId: string) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
    nextPage: null as number | null,
    prevPage: null as number | null,
  });
  const initialLoadDoneRef = useRef(false);
  const lastProductIdRef = useRef<string | null>(null);

  // Load product reviews
  const loadReviews = useCallback(async (params?: ProductReviewsParams) => {
    if (!productId) return;

    try {
      if (globalProductReviewsLoading) return;
      globalProductReviewsLoading = true;
      setIsLoading(true);
      setError(null);

      const response = await productReviewsService.getProductReviews(productId, params);
      setReviews(response.data);
      setMeta({
        ...response.meta,
        limit: response.meta.limit ?? 5, // Default to 5 if null
      });
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load product reviews";
      setError(errorMessage);
      console.error("Error loading product reviews:", err);
      return [];
    } finally {
      setIsLoading(false);
      globalProductReviewsLoading = false;
    }
  }, [productId]);

  // Load reviews for a specific page
  const loadPage = useCallback(async (page: number) => {
    await loadReviews({ page, limit: meta.limit || 5 });
  }, [loadReviews, meta.limit]);

  // Load featured reviews only
  const loadFeaturedReviews = useCallback(async () => {
    await loadReviews({ featured: true });
  }, [loadReviews]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset and load reviews when productId changes
  useEffect(() => {
    if (!productId) return;

    // If productId changed, reset the initial load flag
    if (lastProductIdRef.current !== productId) {
      initialLoadDoneRef.current = false;
      lastProductIdRef.current = productId;
    }

    // Guard to avoid duplicate calls (e.g., React Strict Mode double effect)
    if (initialLoadDoneRef.current) return;
    initialLoadDoneRef.current = true;

    void loadReviews({ page: 1, limit: 5 });
  }, [productId, loadReviews]);

  return {
    reviews,
    isLoading,
    error,
    meta,
    loadReviews,
    loadPage,
    loadFeaturedReviews,
    clearError,
  };
};
