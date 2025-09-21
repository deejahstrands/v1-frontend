/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
export interface ConsultationType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  price: string;
  status: 'active' | 'inactive';
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

export interface GetConsultationTypesParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
}

export interface BookConsultationRequest {
  consultationTypeId: string;
  callbackUrl: string;
  cancelUrl: string;
}

export interface BookConsultationResponse {
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface Consultation {
  id: string;
  createdAt: string;
  updatedAt: string;
  consultationType: {
    id: string;
    name: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string | null;
  time: string | null;
  amount: string;
  order: any | null;
}

export interface ConsultationsResponse {
  message: string;
  data: Consultation[];
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

export interface GetConsultationsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'active';
}

export const consultationService = {
  async getConsultationTypes(params?: GetConsultationTypesParams): Promise<ConsultationTypesResponse> {
    const response = await api.get('/consultations/types', { params });
    return response.data;
  },

  async getConsultations(params?: GetConsultationsParams): Promise<ConsultationsResponse> {
    const response = await api.get('/consultations/', { params });
    return response.data;
  },

  async bookConsultation(data: BookConsultationRequest): Promise<BookConsultationResponse> {
    const response = await api.post('/consultations/book', data);
    return response.data;
  },
};
