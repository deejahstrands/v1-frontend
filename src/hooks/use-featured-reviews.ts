/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { featuredReviewsService, FeaturedReview } from '@/services/featured-reviews.service';

interface UseFeaturedReviewsParams {
  page?: number;
  limit?: number;
}

export const useFeaturedReviews = ({ page = 1, limit = 5 }: UseFeaturedReviewsParams = {}) => {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadFeaturedReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await featuredReviewsService.getFeaturedReviews({
        page,
        limit,
      });

      setReviews(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.totalItems);
    } catch (err: any) {
      console.error('Error loading featured reviews:', err);
      setError(err.response?.data?.message || 'Failed to load featured reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  return {
    reviews,
    isLoading,
    error,
    totalPages,
    totalItems,
    refreshReviews: loadFeaturedReviews,
  };
};
