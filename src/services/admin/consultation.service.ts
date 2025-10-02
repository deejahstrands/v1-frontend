/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

export interface ConsultationUser {
  id: string;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  phone: string | null;
}

export interface ConsultationType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  price: string;
  status: 'active' | 'inactive';
}

export interface Consultation {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: ConsultationUser;
  consultationType: ConsultationType;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string | null;
  time: string | null;
  duration: string | null;
  amount: string;
  customerNote: string | null;
  paymentReference: string;
  order: any | null;
}

export interface ConsultationListItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
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
  data: ConsultationListItem[];
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

export interface ConsultationResponse {
  message: string;
  data: Consultation;
}

export interface UpdateConsultationData {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date?: string;
  time?: string;
  duration?: string;
  customerNote?: string;
}

export interface ConsultationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  typeId?: string;
  type?: string;
}

class ConsultationService {
  private baseUrl = '/admin/consultations';

  /**
   * Get all consultations with pagination and filters
   */
  async getConsultations(params?: ConsultationParams): Promise<ConsultationsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.typeId) queryParams.append('typeId', params.typeId);
    if (params?.type) queryParams.append('type', params.type);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get a single consultation by ID
   */
  async getConsultation(id: string): Promise<ConsultationResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update consultation status and details
   */
  async updateConsultation(id: string, data: UpdateConsultationData): Promise<{ message: string }> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a consultation
   */
  async deleteConsultation(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}

export const consultationService = new ConsultationService();
