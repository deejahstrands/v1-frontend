import api from './api';
import { 
  Collection, 
  CollectionResponse, 
  FeaturedCollectionResponse,
  CollectionsResponse,
  GetCollectionsParams,
  GetFeaturedCollectionParams 
} from '@/types/collection';

class CollectionsService {
  private baseUrl = '/collections';

  /**
   * Get all collections with optional pagination and filters
   */
  async getCollections(params?: GetCollectionsParams): Promise<CollectionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get all active collections
   */
  async getActiveCollections(): Promise<{ message: string; data: Collection[] }> {
    const response = await api.get(`${this.baseUrl}?status=active`);
    return response.data;
  }

  /**
   * Get featured collection
   */
  async getFeaturedCollection(params?: GetFeaturedCollectionParams): Promise<FeaturedCollectionResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.customization !== undefined) queryParams.append('customization', params.customization.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.priceFrom) queryParams.append('priceFrom', params.priceFrom.toString());
    if (params?.priceTo) queryParams.append('priceTo', params.priceTo.toString());
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.page) queryParams.append('page', params.page.toString());

    const url = `${this.baseUrl}/featured${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
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
  async getCollectionWithProducts(id: string): Promise<FeaturedCollectionResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Search collections by name
   */
  async searchCollections(searchTerm: string): Promise<CollectionsResponse> {
    return this.getCollections({ search: searchTerm, status: 'active' });
  }

  /**
   * Get featured collections only
   */
  async getFeaturedCollections(): Promise<CollectionsResponse> {
    return this.getCollections({ featured: true, status: 'active' });
  }
}

export const collectionsService = new CollectionsService();
export default collectionsService;
