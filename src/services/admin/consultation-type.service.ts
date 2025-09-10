import api from '../api';

export interface ConsultationType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  price: string;
  status: 'active' | 'inactive';
}

export interface CreateConsultationTypeData {
  name: string;
  price: number;
  status: 'active' | 'inactive';
}

export interface UpdateConsultationTypeData {
  name?: string;
  price?: number;
  status?: 'active' | 'inactive';
}

export interface ConsultationTypesResponse {
  message: string;
  data: ConsultationType[];
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

export interface ConsultationTypeResponse {
  message: string;
  data: ConsultationType;
}

export interface DeleteConsultationTypeResponse {
  message: string;
}

export const consultationTypeService = {
  // Get all consultation types
  getConsultationTypes: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive';
  }): Promise<ConsultationTypesResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    
    const response = await api.get(`/admin/consultations/types?${searchParams.toString()}`);
    return response.data;
  },


  // Create consultation type
  createConsultationType: async (data: CreateConsultationTypeData): Promise<ConsultationTypeResponse> => {
    const response = await api.post('/admin/consultations/types', data);
    return response.data;
  },

  // Update consultation type
  updateConsultationType: async (id: string, data: UpdateConsultationTypeData): Promise<{ message: string }> => {
    const response = await api.patch(`/admin/consultations/types/${id}`, data);
    return response.data;
  },

  // Delete consultation type
  deleteConsultationType: async (id: string): Promise<DeleteConsultationTypeResponse> => {
    const response = await api.delete(`/admin/consultations/types/${id}`);
    return response.data;
  },
};
