import api from '../api';

export interface PrivateFitting {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'Active' | 'Inactive';
  default: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateFittingData {
  name: string;
  type: string;
  status: 'Active' | 'Inactive';
  location: string;
  default: boolean;
}

export interface UpdateFittingData {
  name?: string;
  type?: string;
  status?: 'Active' | 'Inactive';
  location?: string;
  default?: boolean;
}

export interface FittingResponse {
  message: string;
  data: PrivateFitting;
}

export interface FittingsResponse {
  message: string;
  data: PrivateFitting[];
}

class FittingService {
  private baseUrl = '/admin/private-fittings';

  /**
   * Get all private fittings
   */
  async getFittings(): Promise<FittingsResponse> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  /**
   * Get a single private fitting by ID
   */
  async getFitting(id: string): Promise<FittingResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create a new private fitting
   */
  async createFitting(data: CreateFittingData): Promise<FittingResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing private fitting
   */
  async updateFitting(id: string, data: UpdateFittingData): Promise<FittingResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a private fitting
   */
  async deleteFitting(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Bulk update fitting status
   */
  async bulkUpdateStatus(fittingIds: string[], status: 'Active' | 'Inactive'): Promise<{ message: string }> {
    const response = await api.patch(`${this.baseUrl}/bulk-status`, {
      fittingIds,
      status
    });
    return response.data;
  }

  /**
   * Bulk delete fittings
   */
  async bulkDelete(fittingIds: string[]): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/bulk-delete`, {
      data: { fittingIds }
    });
    return response.data;
  }
}

export const fittingService = new FittingService();
