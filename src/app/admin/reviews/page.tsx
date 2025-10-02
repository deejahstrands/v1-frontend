"use client";

import React from "react";
import { useReviews } from "@/hooks/admin/use-reviews";
import { Button } from "@/components/common/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { MessageSquare, Star, StarOff, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminReviewsPage() {
  const { reviews, isLoading, error, meta, loadPage, featureReview, deleteReview, clearError } = useReviews();

  const [confirmState, setConfirmState] = React.useState<
    | { type: "feature"; reviewId: string; currentFeatured: boolean }
    | { type: "delete"; reviewId: string }
    | null
  >(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleConfirm = async () => {
    if (!confirmState) return;
    setIsProcessing(true);
    try {
      if (confirmState.type === "feature") {
        await featureReview(confirmState.reviewId, !confirmState.currentFeatured);
      } else if (confirmState.type === "delete") {
        await deleteReview(confirmState.reviewId);
      }
    } finally {
      setIsProcessing(false);
      setConfirmState(null);
    }
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-sm text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-sm sm:text-base text-red-500 mb-4">{error}</p>
        <Button
          onClick={() => {
            clearError();
            loadPage(1);
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold">All Reviews</h1>
        {isLoading && <span className="text-xs text-gray-500">Loading…</span>}
      </div>

      {reviews.length === 0 ? (
        <div className="p-8 text-center text-gray-600">
          <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 text-gray-400" />
          <div>No reviews yet.</div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs sm:text-sm text-gray-600">
                      {review.user.firstName.charAt(0)}
                      {review.user.lastName.charAt(0)}
                    </div>
                    <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                      {review.user.firstName} {review.user.lastName}
                    </div>
                    <div className="ml-2 text-xs sm:text-sm text-gray-600">{review.rating}/5</div>
                    {review.featuredReview && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] sm:text-xs rounded-full">Featured</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-gray-700 break-words">{review.review}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="tertiary"
                    onClick={() => setConfirmState({ type: "feature", reviewId: review.id, currentFeatured: review.featuredReview })}
                    icon={review.featuredReview ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                    className="text-xs px-2 py-1 sm:px-3"
                  >
                    {review.featuredReview ? "Unfeature" : "Feature"}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setConfirmState({ type: "delete", reviewId: review.id })}
                    icon={<Trash2 className="h-4 w-4" />}
                    className="text-xs px-2 py-1 sm:px-3"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing page {meta.page} of {meta.totalPages}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="tertiary"
              onClick={() => loadPage(meta.page - 1)}
              disabled={!meta.hasPrev}
              icon={<ChevronLeft className="h-4 w-4" />}
              className="text-xs"
            >
              Prev
            </Button>
            <Button
              variant="tertiary"
              onClick={() => loadPage(meta.page + 1)}
              disabled={!meta.hasNext}
              icon={<ChevronRight className="h-4 w-4" />}
              className="text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmationModal
        open={!!confirmState}
        onClose={() => !isProcessing && setConfirmState(null)}
        onConfirm={handleConfirm}
        title={confirmState?.type === "delete" ? "Delete review?" : confirmState?.currentFeatured ? "Unfeature review?" : "Feature review?"}
        message={confirmState?.type === "delete"
          ? "This action will permanently delete this review."
          : confirmState?.currentFeatured
            ? "This will remove the Featured label from this review."
            : "This will mark this review as Featured."}
        type={confirmState?.type === "delete" ? "delete" : confirmState?.currentFeatured ? "warning" : "info"}
        confirmText={confirmState?.type === "delete" ? "Delete" : confirmState?.currentFeatured ? "Unfeature" : "Feature"}
        cancelText="Cancel"
        isLoading={isProcessing}
      />
    </div>
  );
}


