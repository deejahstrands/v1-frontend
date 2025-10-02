"use client";

import React from 'react';
import { Star, ChevronLeft, ChevronRight, MessageSquare, StarOff } from 'lucide-react';
import { Button } from '@/components/common/button';
import { useProductReviews } from '@/hooks/admin/use-product-reviews';
import { productReviewsService } from '@/services/admin/product-reviews.service';
import { useToast } from '@/hooks/use-toast';
import { ProductReview } from '@/services/admin/product-reviews.service';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface ProductReviewsProps {
  productId: string;
  onClose: () => void;
}

export function ProductReviews({ productId, onClose }: ProductReviewsProps) {
  const { reviews, isLoading, error, meta, loadPage, clearError } = useProductReviews(productId);
  const { toast } = useToast();

  // Confirmation modal state for feature/unfeature
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [targetReview, setTargetReview] = React.useState<{ id: string; featured: boolean } | null>(null);

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= numRating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      );
    }
    
    return stars;
  };

  const handlePageChange = (page: number) => {
    loadPage(page);
  };

  const handleFeatureReview = async (reviewId: string, currentFeatured: boolean) => {
    try {
      await productReviewsService.featureReview(reviewId, !currentFeatured);
      toast.success(`Review ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`);
      // Reload reviews to get updated data
      loadPage(meta.page);
    } catch (error) {
      console.error('Error featuring review:', error);
      toast.error('Failed to update review feature status');
    }
  };

  const openConfirm = (reviewId: string, currentFeatured: boolean) => {
    setTargetReview({ id: reviewId, featured: currentFeatured });
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!targetReview) return;
    setConfirmLoading(true);
    await handleFeatureReview(targetReview.id, targetReview.featured);
    setConfirmLoading(false);
    setConfirmOpen(false);
    setTargetReview(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <p className="text-sm sm:text-base text-red-500 mb-4">Failed to load reviews</p>
          <Button
            onClick={() => {
              clearError();
              loadPage(1);
            }}
            className="px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600 mb-4">No reviews found for this product</p>
          <Button
            variant="tertiary"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Back to Product Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Product Reviews</h2>
          <p className="text-sm sm:text-base text-gray-600">
            {meta.totalItems} review{meta.totalItems !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button
          variant="tertiary"
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          Back to Product Details
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-3 sm:space-y-4">
        {reviews.map((review: ProductReview) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 relative">
            {review.featuredReview && (
              <span className="absolute  right-2 lg:bottom-4 sm:right-4 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Featured
              </span>
            )}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {review.user.firstName} {review.user.lastName}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                    <span className="text-xs sm:text-sm text-gray-600 ml-2">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end sm:justify-start">
                <Button
                  variant="tertiary"
                  onClick={() => openConfirm(review.id, review.featuredReview)}
                  icon={review.featuredReview ? <StarOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Star className="h-3 w-3 sm:h-4 sm:w-4" />}
                  className="text-xs px-2 py-1 sm:px-3"
                >
                  <span className="hidden sm:inline">{review.featuredReview ? 'Unfeature' : 'Feature'}</span>
                  <span className="sm:hidden">{review.featuredReview ? 'Unfeature' : 'Feature'}</span>
                </Button>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{review.review}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing page {meta.page} of {meta.totalPages}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="tertiary"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={!meta.hasPrev}
              icon={<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />}
              className="text-xs px-3 py-1 sm:px-4 sm:py-2"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            <Button
              variant="tertiary"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={!meta.hasNext}
              icon={<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />}
              className="text-xs px-3 py-1 sm:px-4 sm:py-2"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </Button>
          </div>
        </div>
      )}
      {/* Confirm feature/unfeature modal */}
      <ConfirmationModal
        open={confirmOpen}
        onClose={() => {
          if (!confirmLoading) {
            setConfirmOpen(false);
            setTargetReview(null);
          }
        }}
        onConfirm={handleConfirm}
        title={`${targetReview?.featured ? 'Unfeature' : 'Feature'} review?`}
        message={targetReview?.featured
          ? 'This will remove the Featured label from the selected review.'
          : 'This will mark the selected review as Featured.'}
        type={targetReview?.featured ? 'warning' : 'info'}
        confirmText={targetReview?.featured ? 'Unfeature' : 'Feature'}
        cancelText="Cancel"
        isLoading={confirmLoading}
      />
    </div>
  );
}
