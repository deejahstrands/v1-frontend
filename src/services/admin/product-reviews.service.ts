import api from '../api';

export interface ProductReview {
  id: string;
  rating: string;
  review: string;
  featuredReview: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

export interface ProductReviewsResponse {
  message: string;
  data: ProductReview[];
  meta: {
    page: number;
    limit: number | null;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface ProductReviewsParams {
  limit?: number;
  page?: number;
  featured?: boolean;
}

class ProductReviewsService {
  private baseUrl = '/admin/products';
  private reviewsBaseUrl = '/admin/reviews';

  /**
   * Get product reviews with pagination
   */
  async getProductReviews(
    productId: string,
    params?: ProductReviewsParams
  ): Promise<ProductReviewsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.featured !== undefined) {
      queryParams.append('featured', params.featured.toString());
    }

    const url = `${this.baseUrl}/${productId}/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get all reviews with pagination
   */
  async getAllReviews(params?: ProductReviewsParams): Promise<ProductReviewsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.featured !== undefined) {
      queryParams.append('featured', params.featured.toString());
    }

    const url = `${this.reviewsBaseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Feature/unfeature a review
   */
  async featureReview(reviewId: string, feature: boolean): Promise<{ message: string }> {
    const response = await api.patch(`${this.reviewsBaseUrl}/${reviewId}`, { feature });
    return response.data;
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.reviewsBaseUrl}/${reviewId}`);
    return response.data;
  }
}

export const productReviewsService = new ProductReviewsService();
