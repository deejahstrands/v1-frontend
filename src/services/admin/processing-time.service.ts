import api from '../api';

export interface ProcessingTime {
  id: string;
  label: string;
  timeRange: string;
  status: 'Active' | 'Inactive';
  default: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateProcessingTimeData {
  label: string;
  timeRange: string;
  status: 'Active' | 'Inactive';
  default: boolean;
}

export interface UpdateProcessingTimeData {
  label?: string;
  timeRange?: string;
  status?: 'Active' | 'Inactive';
  default?: boolean;
}

export interface ProcessingTimeResponse {
  message: string;
  data: ProcessingTime;
}

export interface ProcessingTimesResponse {
  message: string;
  data: ProcessingTime[];
}

class ProcessingTimeService {
  private baseUrl = '/admin/processing-times';

  /**
   * Get all processing times
   */
  async getProcessingTimes(): Promise<ProcessingTimesResponse> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  /**
   * Get a single processing time by ID
   */
  async getProcessingTime(id: string): Promise<ProcessingTimeResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create a new processing time
   */
  async createProcessingTime(data: CreateProcessingTimeData): Promise<ProcessingTimeResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing processing time
   */
  async updateProcessingTime(id: string, data: UpdateProcessingTimeData): Promise<ProcessingTimeResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a processing time
   */
  async deleteProcessingTime(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Bulk update processing time status
   */
  async bulkUpdateStatus(processingTimeIds: string[], status: 'Active' | 'Inactive'): Promise<{ message: string }> {
    const response = await api.patch(`${this.baseUrl}/bulk-status`, {
      processingTimeIds,
      status
    });
    return response.data;
  }

  /**
   * Bulk delete processing times
   */
  async bulkDelete(processingTimeIds: string[]): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/bulk-delete`, {
      data: { processingTimeIds }
    });
    return response.data;
  }
}

export const processingTimeService = new ProcessingTimeService();
