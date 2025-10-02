import api from './api';

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
  page?: number;
  limit?: number;
  featured?: boolean;
}

class ProductReviewsService {
  private baseUrl = '/products';

  /**
   * Get product reviews with pagination and filters
   */
  async getProductReviews(productId: string, params?: ProductReviewsParams): Promise<ProductReviewsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());

    const url = `${this.baseUrl}/${productId}/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }
}

export const productReviewsService = new ProductReviewsService();
