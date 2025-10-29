import api from '@/services/api';

export interface WigUnitListItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  basePrice: number;
  description: string;
}

export interface WigUnitCustomizationOption {
  itemCustomizationId: string;
  customizationId: string;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface WigUnitCustomizationType {
  typeName: string;
  description: string;
  options: WigUnitCustomizationOption[];
  createdAt: string;
}

export interface WigUnitDetail extends WigUnitListItem {
  customizations: WigUnitCustomizationType[];
}

export interface WigUnitsResponse {
  message: string;
  data: WigUnitListItem[];
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

export interface WigUnitResponse {
  message: string;
  data: WigUnitDetail;
}

class WigUnitsService {
  private baseUrl = '/wig-units';

  async getWigUnits(params?: { page?: number; limit?: number }): Promise<WigUnitsResponse> {
    const response = await api.get<WigUnitsResponse>(this.baseUrl, { params });
    return response.data;
  }

  async getWigUnit(id: string): Promise<WigUnitResponse> {
    const response = await api.get<WigUnitResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const wigUnitsService = new WigUnitsService();


