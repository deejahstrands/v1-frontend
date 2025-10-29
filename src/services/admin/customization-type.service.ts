import api from '../api';

export interface CustomizationType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  noOfOptions: number;
}

export interface CreateCustomizationTypeData {
  name: string;
  description: string;
}

export interface UpdateCustomizationTypeData {
  name?: string;
  description?: string;
}

export interface CustomizationTypeResponse {
  message: string;
  type: CustomizationType;
}

export interface CustomizationTypesResponse {
  message: string;
  data: CustomizationType[];
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

export interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CustomizationTypeWithOptions {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  options: CustomizationOption[];
}

export interface CustomizationTypeWithOptionsResponse {
  message: string;
  data: CustomizationTypeWithOptions;
}

class CustomizationTypeService {
  private baseUrl = '/admin/customization/types';

  /**
   * Get all customization types with optional pagination and search
   */
  async getCustomizationTypes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<CustomizationTypesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get customization type with options by ID
   */
  async getCustomizationTypeWithOptions(typeId: string): Promise<CustomizationTypeWithOptionsResponse> {
    const response = await api.get(`${this.baseUrl}/${typeId}`);
    return response.data;
  }

  /**
   * Create a new customization type
   */
  async createCustomizationType(data: CreateCustomizationTypeData): Promise<CustomizationTypeResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing customization type
   */
  async updateCustomizationType(id: string, data: UpdateCustomizationTypeData): Promise<CustomizationTypeResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a customization type
   */
  async deleteCustomizationType(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const customizationTypeService = new CustomizationTypeService();
