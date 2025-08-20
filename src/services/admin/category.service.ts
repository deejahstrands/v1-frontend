import api from '../api';

export interface AdminCategory {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  noOfProducts: number;
}

export interface CreateCategoryData {
  name: string;
  coverImage: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface UpdateCategoryData {
  name?: string;
  coverImage?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface CategoryResponse {
  message: string;
  data: AdminCategory;
}

export interface CategoriesResponse {
  message: string;
  data: AdminCategory[];
}

class CategoryService {
  private baseUrl = '/admin/categories';

  /**
   * Get all categories with optional pagination and filters
   */
  async getCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<CategoriesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
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
   * Create a new category
   */
  async createCategory(data: CreateCategoryData): Promise<CategoryResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: string, data: UpdateCategoryData): Promise<CategoryResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a category (soft delete)
   */
  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Restore a deleted category
   */
  async restoreCategory(id: string): Promise<CategoryResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}/restore`);
    return response.data;
  }

  /**
   * Permanently delete a category
   */
  async permanentDeleteCategory(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}/permanent`);
    return response.data;
  }

  /**
   * Bulk update category status
   */
  async bulkUpdateStatus(categoryIds: string[], status: 'active' | 'inactive'): Promise<{ message: string }> {
    const response = await api.patch(`${this.baseUrl}/bulk-status`, {
      categoryIds,
      status
    });
    return response.data;
  }

  /**
   * Bulk delete categories
   */
  async bulkDelete(categoryIds: string[]): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/bulk-delete`, {
      data: { categoryIds }
    });
    return response.data;
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    deleted: number;
  }> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export const categoryService = new CategoryService();
