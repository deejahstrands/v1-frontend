import api from '../api';

export interface AdminCustomer {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  totalOrders: number;
  lastOrderDate: string | null;
  totalSpend: number;
}

export interface CustomerResponse {
  message: string;
  data: AdminCustomer;
}

export interface CustomersResponse {
  message: string;
  data: AdminCustomer[];
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

class CustomerService {
  private baseUrl = '/admin/customers';

  /**
   * Get all customers with optional pagination and filters
   */
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<CustomersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get a single customer by ID
   */
  async getCustomer(id: string): Promise<CustomerResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update customer status
   */
  async updateCustomerStatus(id: string, isActive: boolean): Promise<CustomerResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}/status`, { isActive });
    return response.data;
  }

  /**
   * Get customer statistics
   */
  async getCustomerStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    totalOrders: number;
    totalSpend: number;
  }> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export const customerService = new CustomerService();
