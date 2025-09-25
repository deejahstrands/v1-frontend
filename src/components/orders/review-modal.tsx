'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { type OrderItem, type ReviewData } from '@/services/orders';
import { toast } from 'react-toastify';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  orderItem: OrderItem;
  onSuccess: (itemId: string, reviewData: ReviewData) => Promise<void>;
}

export function ReviewModal({ open, onClose, orderItem, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setRating(0);
    setHoverRating(0);
    setReview('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!review.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const reviewData: ReviewData = {
        review: review.trim(),
        rating
      };

      await onSuccess(orderItem.id, reviewData);
      handleClose();
    } catch (error: unknown) {
      console.error('Error adding review:', error);
      // Error handling is managed by the store
      // Just show a generic error message if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            <Star
              size={24}
              className={`transition-colors ${
                star <= (hoverRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 && `${rating} out of 5 stars`}
        </span>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      className="max-w-lg"
    >
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Add Review
          </h2>
          <p className="text-gray-600">
            Share your experience with <span className="font-medium">{orderItem.itemName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <StarRating />
          </div>

          {/* Review Section */}
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A898] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
              placeholder="Tell us about your experience with this item..."
              maxLength={500}
            />
            <div className="mt-1 text-right">
              <span className="text-xs text-gray-500">
                {review.length}/500 characters
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !review.trim()}
              className="bg-[#C9A898] hover:bg-[#b88b6d] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
