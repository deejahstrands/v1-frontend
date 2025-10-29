import api from './api';
import { 
  Category, 
  CategoryResponse, 
  CategoriesResponse, 
  CategoryWithProductsResponse,
  GetCategoriesParams,
  GetCategoryWithProductsParams 
} from '@/types/category';

class CategoriesService {
  private baseUrl = '/categories';

  /**
   * Get all categories with optional pagination and filters
   */
  async getCategories(params?: GetCategoriesParams): Promise<CategoriesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get all active categories without pagination (for UI components)
   */
  async getActiveCategories(): Promise<{ message: string; data: Category[] }> {
    const response = await api.get(`${this.baseUrl}?status=active`);
    return response.data;
  }

  /**
   * Get a single category by ID
   */
  async getCategory(id: string): Promise<CategoryResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Get a single category with its products
   */
  async getCategoryWithProducts(
    id: string, 
    params?: GetCategoryWithProductsParams
  ): Promise<CategoryWithProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${this.baseUrl}/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get categories for dropdown/select components (simplified data)
   */
  async getCategoriesForSelect(): Promise<{ message: string; data: { id: string; name: string }[] }> {
    const response = await this.getActiveCategories();
    return {
      message: response.message,
      data: response.data.map(category => ({
        id: category.id,
        name: category.name
      }))
    };
  }

  /**
   * Search categories by name
   */
  async searchCategories(searchTerm: string): Promise<CategoriesResponse> {
    return this.getCategories({ search: searchTerm, status: 'active' });
  }
}

export const categoriesService = new CategoriesService();
export default categoriesService;
