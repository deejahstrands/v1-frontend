import api from '../api';

// Collection interfaces
export interface Collection {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  thumbnail: string;
  name: string;
  status: 'active' | 'inactive';
  description: string;
  featured: boolean;
  noOfProducts: number;
}

export interface CollectionWithProducts extends Collection {
  products: {
    id: string;
    thumbnail: string;
    name: string;
    basePrice: number;
    visibility: 'published' | 'hidden';
  }[];
}

export interface CreateCollectionData {
  thumbnail: string;
  name: string;
  status: 'active' | 'inactive';
  description: string;
  featured: boolean;
  products: string[];
}

export interface UpdateCollectionData {
  name?: string;
  thumbnail?: string;
  status?: 'active' | 'inactive';
  description?: string;
  featured?: boolean;
  products?: string[];
}

export interface CollectionsResponse {
  message: string;
  data: Collection[];
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

export interface CollectionResponse {
  message: string;
  data: Collection;
}

export interface CollectionWithProductsResponse {
  message: string;
  data: CollectionWithProducts;
}

export interface DeleteCollectionResponse {
  message: string;
}

class CollectionService {
  private baseUrl = '/admin/collections';

  /**
   * Get all collections with optional filters
   */
  async getCollections(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive';
    featured?: boolean;
  }): Promise<CollectionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get all collections without pagination (for dropdowns)
   */
  async getAllCollections(params?: {
    search?: string;
    status?: 'active' | 'inactive';
    featured?: boolean;
  }): Promise<Collection[]> {
    const queryParams = new URLSearchParams();
    
    // Set a high limit to get all collections
    queryParams.append('limit', '1000');
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    
    const response = await api.get(url);
    return response.data.data; // Return just the data array, not the full response
  }

  /**
   * Get a single collection by ID
   */
  async getCollection(id: string): Promise<CollectionResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Get collection with products by ID
   */
  async getCollectionWithProducts(id: string): Promise<CollectionWithProductsResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create a new collection
   */
  async createCollection(data: CreateCollectionData): Promise<CollectionResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing collection
   */
  async updateCollection(id: string, data: UpdateCollectionData): Promise<CollectionResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a collection
   */
  async deleteCollection(id: string): Promise<DeleteCollectionResponse> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const collectionService = new CollectionService();
