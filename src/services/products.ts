import api from './api';
import {  
  ProductsResponse,
  ProductResponse,
  DetailedProductResponse,
  GetProductsParams 
} from '@/types/product';

class ProductsService {
  private baseUrl = '/products';

  private buildQueryParams(params?: GetProductsParams): string {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.customization !== undefined) queryParams.append('customization', params.customization.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.visibility) queryParams.append('visibility', params.visibility);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.priceFrom) queryParams.append('priceFrom', params.priceFrom.toString());
    if (params?.priceTo) queryParams.append('priceTo', params.priceTo.toString());
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.search) queryParams.append('search', params.search);

    return queryParams.toString();
  }

  /**
   * Get all products with optional pagination and filters
   */
  async getProducts(params?: GetProductsParams): Promise<ProductsResponse> {
    const query = this.buildQueryParams(params);
    const response = await api.get(`${this.baseUrl}${query ? `?${query}` : ''}`);
    return response.data;
  }

  /**
   * Get all published products
   */
  async getPublishedProducts(params?: Omit<GetProductsParams, 'visibility' | 'status'>): Promise<ProductsResponse> {
    return this.getProducts({ ...params, visibility: 'published', status: 'available' });
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(params?: Omit<GetProductsParams, 'featured'>): Promise<ProductsResponse> {
    return this.getProducts({ ...params, featured: true, visibility: 'published', status: 'available' });
  }

  /**
   * Get a single product by ID (basic info)
   */
  async getProduct(id: string): Promise<ProductResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Get detailed product by ID (with customizations, specifications, etc.)
   */
  async getDetailedProduct(id: string): Promise<DetailedProductResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Search products by name
   */
  async searchProducts(searchTerm: string, params?: Omit<GetProductsParams, 'search'>): Promise<ProductsResponse> {
    return this.getProducts({ ...params, search: searchTerm, visibility: 'published', status: 'available' });
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string, params?: Omit<GetProductsParams, 'categoryId'>): Promise<ProductsResponse> {
    return this.getProducts({ ...params, categoryId });
  }

  /**
   * Get products by price range
   */
  async getProductsByPriceRange(priceFrom: number, priceTo: number, params?: Omit<GetProductsParams, 'priceFrom' | 'priceTo'>): Promise<ProductsResponse> {
    return this.getProducts({ ...params, priceFrom, priceTo });
  }
}

export const productsService = new ProductsService();
export default productsService;
