/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useRef } from "react";
import {
  productReviewsService,
  ProductReview,
} from "@/services/product-reviews.service";

interface UseProductReviewsParams {
  productId: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

// Global flags to prevent duplicate API calls per product
const fetchingFlags = new Map<string, boolean>();

export const useProductReviews = ({
  productId,
  page = 1,
  limit = 5,
  featured,
}: UseProductReviewsParams) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Track if we've loaded initially for this product
  const hasLoadedInitially = useRef(false);
  const lastLoadedProductId = useRef<string | null>(null);

  const loadReviews = useCallback(async () => {
    if (!productId) return;

    // Create unique key for this product and params
    const fetchKey = `${productId}-${currentPage}-${limit}-${featured}`;

    if (fetchingFlags.get(fetchKey)) {
      return;
    }

    try {
      fetchingFlags.set(fetchKey, true);
      setIsLoading(true);
      setError(null);

      const response = await productReviewsService.getProductReviews(
        productId,
        {
          page: currentPage,
          limit,
          featured,
        }
      );

      setReviews(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.totalItems);
    } catch (err: any) {
      console.error("Error loading product reviews:", err);
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setIsLoading(false);
      fetchingFlags.set(fetchKey, false);
    }
  }, [productId, currentPage, limit, featured]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const refreshReviews = useCallback(() => {
    loadReviews();
  }, [loadReviews]);

  // Load reviews when dependencies change
  useEffect(() => {
    // Reset if product changed
    if (lastLoadedProductId.current !== productId) {
      hasLoadedInitially.current = false;
      lastLoadedProductId.current = productId;
    }

    // Only load if we haven't loaded this product yet, or if page changed
    if (!hasLoadedInitially.current || currentPage !== page) {
      loadReviews();
      hasLoadedInitially.current = true;
    }
  }, [productId, currentPage, page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all fetching flags for this product
      const keysToDelete = Array.from(fetchingFlags.keys()).filter((key) =>
        key.startsWith(`${productId}-`)
      );
      keysToDelete.forEach((key) => fetchingFlags.delete(key));
    };
  }, [productId]);

  return {
    reviews,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    refreshReviews,
  };
};
