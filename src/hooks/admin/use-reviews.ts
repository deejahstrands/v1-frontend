/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useRef } from "react";
import { productReviewsService, ProductReview, ProductReviewsParams } from "@/services/admin/product-reviews.service";
import { useToast } from "@/hooks/use-toast";

export const useReviews = () => {
  const { toast } = useToast();
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

  // Load all reviews
  const loadReviews = useCallback(async (params?: ProductReviewsParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await productReviewsService.getAllReviews(params);
      setReviews(response.data);
      setMeta({
        ...response.meta,
        limit: response.meta.limit ?? 5, // Default to 5 if null
      });
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load reviews";
      setError(errorMessage);
      console.error("Error loading reviews:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load reviews for a specific page
  const loadPage = useCallback(async (page: number) => {
    await loadReviews({ page, limit: meta.limit || 5 });
  }, [loadReviews, meta.limit]);

  // Load featured reviews only
  const loadFeaturedReviews = useCallback(async () => {
    await loadReviews({ featured: true });
  }, [loadReviews]);

  // Feature/unfeature a review
  const featureReview = useCallback(async (reviewId: string, feature: boolean) => {
    try {
      await productReviewsService.featureReview(reviewId, feature);
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, featuredReview: feature }
          : review
      ));
      
      toast.success(`Review ${feature ? 'featured' : 'unfeatured'} successfully!`);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update review feature status";
      console.error("Error featuring review:", err);
      toast.error(errorMessage);
      return false;
    }
  }, [toast]);

  // Delete a review
  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      await productReviewsService.deleteReview(reviewId);
      
      // Remove from local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      
      // Update meta
      setMeta(prev => ({
        ...prev,
        totalItems: prev.totalItems - 1,
      }));
      
      toast.success("Review deleted successfully!");
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete review";
      console.error("Error deleting review:", err);
      toast.error(errorMessage);
      return false;
    }
  }, [toast]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load reviews on mount
  useEffect(() => {
    if (initialLoadDoneRef.current) return;
    initialLoadDoneRef.current = true;
    void loadReviews({ page: 1, limit: 5 });
  }, [loadReviews]);

  return {
    reviews,
    isLoading,
    error,
    meta,
    loadReviews,
    loadPage,
    loadFeaturedReviews,
    featureReview,
    deleteReview,
    clearError,
  };
};
