import api from '../api';


export interface WigUnit {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  customizations?: WigUnitCustomization[];
}

export interface WigUnitCustomization {
  typeName: string;
  description: string;
  options: WigUnitCustomizationOption[];
  createdAt: string;
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

export interface CreateWigUnitData {
  name: string;
  description: string;
  basePrice: number;
}

export interface UpdateWigUnitData {
  name?: string;
  description?: string;
  basePrice?: number;
  customizations?: Array<{
    customizationId: string;
    price: number;
  }>;
}

export interface WigUnitsResponse {
  message: string;
  data: WigUnit[];
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

export interface WigUnitResponse {
  message: string;
  data: WigUnit;
}

export interface DeleteWigUnitResponse {
  message: string;
}

export const wigUnitService = {
  // Get all wig units with pagination
  getWigUnits: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<WigUnitsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`/admin/wig-units?${searchParams.toString()}`);
    return response.data;
  },

  // Get single wig unit by ID
  getWigUnit: async (id: string): Promise<WigUnitResponse> => {
    const response = await api.get(`/admin/wig-units/${id}`);
    return response.data;
  },

  // Create new wig unit
  createWigUnit: async (data: CreateWigUnitData): Promise<WigUnitResponse> => {
    const response = await api.post('/admin/wig-units', data);
    return response.data;
  },

  // Update wig unit
  updateWigUnit: async (id: string, data: UpdateWigUnitData): Promise<WigUnitResponse> => {
    const response = await api.patch(`/admin/wig-units/${id}`, data);
    return response.data;
  },

  // Delete wig unit
  deleteWigUnit: async (id: string): Promise<DeleteWigUnitResponse> => {
    const response = await api.delete(`/admin/wig-units/${id}`);
    return response.data;
  },
};
