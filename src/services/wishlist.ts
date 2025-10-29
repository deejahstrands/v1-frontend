import api from './api';

export interface WishlistProduct {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  thumbnail: string;
  name: string;
  basePrice: number;
  featured: boolean;
  status: string;
  quantityAvailable: number;
  visibility: string;
  customization: boolean;
  category: {
    id: string;
    name: string;
  };
}

export interface WishlistResponse {
  message: string;
  data: WishlistProduct[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface AddToWishlistResponse {
  message: string;
}

class WishlistService {
  private baseUrl = '/wishlist';

  async addToWishlist(data: AddToWishlistRequest): Promise<AddToWishlistResponse> {
    const response = await api.post(`${this.baseUrl}`, data);
    return response.data;
  }

  async getWishlist(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<WishlistResponse> {
    const response = await api.get(`${this.baseUrl}`, { params });
    return response.data;
  }

  async moveToCart(productId: string): Promise<{ message: string }> {
    const response = await api.patch(`${this.baseUrl}/${productId}`);
    return response.data;
  }

  async removeFromWishlist(productId: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${productId}`);
    return response.data;
  }

  async clearWishlist(): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}`);
    return response.data;
  }
}

export const wishlistService = new WishlistService();
