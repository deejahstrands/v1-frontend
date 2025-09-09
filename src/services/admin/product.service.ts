import api from '../api';

export interface AdminProduct {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  thumbnail: string;
  name: string;
  basePrice: number;
  status: 'available' | 'sold_out';
  quantityAvailable: number;
  visibility: 'hidden' | 'published';
  category: {
    id: string;
    name: string;
  };
  customization: boolean;
  featured?: boolean;
}

export interface CreateProductData {
  thumbnail: string;
  name: string;
  basePrice: number;
  description: string;
  status: 'available' | 'sold_out';
  totalQuantity: number;
  quantityAvailable: number;
  quantitySold: number;
  gallery: string[];
  visibility: 'hidden' | 'published';
  featured: boolean;
  customizations: Array<{
    customizationId: string;
    price: number;
  }>;
  categoryId: string;
  collections: string[];
  fittingOptions: Array<{
    fittingOptionId: string;
    price: number;
  }>;
  processingTimes: Array<{
    processingTimeId: string;
    price: number;
  }>;
  productSpecifications: {
    length: string;
    color: string;
    density: string;
  };
}

export interface UpdateProductData {
  thumbnail?: string;
  name?: string;
  basePrice?: number;
  description?: string;
  status?: 'available' | 'sold_out';
  totalQuantity?: number;
  quantityAvailable?: number;
  quantitySold?: number;
  gallery?: string[];
  visibility?: 'hidden' | 'published';
  featured?: boolean;
  customizations?: Array<{
    customizationId: string;
    price: number;
  }>;
  categoryId?: string;
  collections?: string[];
  fittingOptions?: Array<{
    fittingOptionId: string;
    price: number;
  }>;
  processingTimes?: Array<{
    processingTimeId: string;
    price: number;
  }>;
  productSpecifications?: {
    length: string;
    color: string;
    density: string;
  };
}

export interface ProductResponse {
  message: string;
  data: AdminProduct;
}

export interface ProductsResponse {
  message: string;
  data: AdminProduct[];
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

class ProductService {
  private baseUrl = '/admin/products';

  /**
   * Get all products with optional pagination and filters
   */
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    customization?: boolean;
    visibility?: 'hidden' | 'published';
    status?: 'available' | 'sold_out';
    featured?: boolean;
    priceFrom?: number;
    priceTo?: number;
    sortBy?: string;
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.customization !== undefined) queryParams.append('customization', params.customization.toString());
    if (params?.visibility) queryParams.append('visibility', params.visibility);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.priceFrom) queryParams.append('priceFrom', params.priceFrom.toString());
    if (params?.priceTo) queryParams.append('priceTo', params.priceTo.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<ProductResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductData): Promise<ProductResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, data: UpdateProductData): Promise<ProductResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a product (soft delete)
   */
  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Change product status
   */
  async changeProductStatus(id: string, status: 'available' | 'sold_out'): Promise<ProductResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}/status`, { status });
    return response.data;
  }

  /**
   * Add product to collection
   */
  async addToCollection(productId: string, collectionId: string): Promise<{ message: string }> {
    const response = await api.post(`${this.baseUrl}/${productId}/collections`, { collectionId });
    return response.data;
  }
}

export const productService = new ProductService();
export default productService;
