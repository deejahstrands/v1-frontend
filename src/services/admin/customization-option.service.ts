import api from '../api';

export interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  customizationType: {
    id: string;
    name: string;
  };
  assignedProducts: number;
  status: 'active' | 'hidden';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateCustomizationOptionData {
  name: string;
  description?: string;
  typeId: string;
  status: 'active' | 'hidden';
}

export interface UpdateCustomizationOptionData {
  name?: string;
  description?: string;
  typeId?: string;
  status?: 'active' | 'hidden';
}

export interface CustomizationOptionResponse {
  message: string;
  option: CustomizationOption;
}

export interface CustomizationOptionsResponse {
  message: string;
  data: CustomizationOption[];
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

class CustomizationOptionService {
  private baseUrl = '/admin/customization/options';

  /**
   * Get all customization options with optional pagination and search
   */
  async getCustomizationOptions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    typeId?: string;
  }): Promise<CustomizationOptionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.typeId) queryParams.append('typeId', params.typeId);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Create a new customization option
   */
  async createCustomizationOption(data: CreateCustomizationOptionData): Promise<CustomizationOptionResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing customization option
   */
  async updateCustomizationOption(id: string, data: UpdateCustomizationOptionData): Promise<CustomizationOptionResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a customization option
   */
  async deleteCustomizationOption(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const customizationOptionService = new CustomizationOptionService();
