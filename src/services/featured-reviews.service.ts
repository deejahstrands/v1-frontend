import  api  from './api';

export interface FeaturedReview {
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

export interface FeaturedReviewsResponse {
  message: string;
  data: FeaturedReview[];
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

export interface FeaturedReviewsParams {
  page?: number;
  limit?: number;
}

class FeaturedReviewsService {
  async getFeaturedReviews(params: FeaturedReviewsParams = {}): Promise<FeaturedReviewsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`/reviews/featured?${searchParams.toString()}`);
    return response.data;
  }
}

export const featuredReviewsService = new FeaturedReviewsService();
