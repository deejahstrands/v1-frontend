/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api';

// Order interfaces
export interface OrderUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  phone?: string | null;
}

export interface OrderItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product?: {
    id: string;
    thumbnail: string;
  };
  itemName: string;
  itemType: string;
  quantity: number;
  basePrice: string;
  totalPrice: string;
  measurements?: {
    earToEar: string;
    harlineImages: string[];
    wigStyleImages: string[];
    headCircumference: string;
  };
  customizations?: Array<{
    type: string;
    price: number;
    option: string;
  }>;
  privateFitting?: {
    name: string;
    price: number;
  };
  processingTime?: {
    name: string;
    price: number;
  };
  review?: any;
  rating?: any;
  thumbnal?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: OrderUser;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  totalPrice: string;
  items: OrderItem[];
  paymentReference: string;
  shippingAddress: string;
  deliveryNote: string;
  orderId: string;
  phone?: string;
  itemCount: number;
}

export interface OrdersResponse {
  message: string;
  data: Order[];
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

export interface OrderResponse {
  message: string;
  data: Order;
}

export interface UpdateOrderStatusData {
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
}

export interface UpdateOrderStatusResponse {
  message: string;
}

class OrderService {
  private baseUrl = '/admin/orders';

  /**
   * Get all orders with optional filters
   */
  async getOrders(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  }): Promise<OrdersResponse> {
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
   * Get a single order by ID
   */
  async getOrder(id: string): Promise<OrderResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, data: UpdateOrderStatusData): Promise<UpdateOrderStatusResponse> {
    const response = await api.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }
}

export const orderService = new OrderService();
