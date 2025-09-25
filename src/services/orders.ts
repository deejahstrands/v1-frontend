import api from './api';

export interface OrderItemProduct {
  id: string;
  thumbnail: string;
}

export interface OrderItemMeasurements {
  earToEar?: string;
  headCircumference?: string;
  harlineImages?: string[];
  wigStyleImages?: string[];
}

export interface OrderItemCustomization {
  type: string;
  price: number;
  option: string;
}

export interface OrderItemPrivateFitting {
  name?: string;
  price?: number;
}

export interface OrderItemProcessingTime {
  name?: string;
  price?: number;
}

export interface OrderItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product: OrderItemProduct | null;
  itemName: string;
  itemType: 'product' | 'wigUnit';
  quantity: number;
  basePrice: string;
  totalPrice: string;
  measurements?: OrderItemMeasurements | Record<string, never>;
  customizations?: OrderItemCustomization[] | Record<string, never>;
  privateFitting?: OrderItemPrivateFitting | Record<string, never>;
  processingTime?: OrderItemProcessingTime | Record<string, never>;
  review: string | null;
  rating: string | null;
}

export interface OrderUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: OrderUser;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: string;
  items: OrderItem[];
  paymentReference: string;
  shippingAddress: string;
  deliveryNote?: string;
  orderId: string;
  itemCount: number;
}

export interface OrdersMeta {
  page: number;
  limit: number | null;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface OrdersResponse {
  message: string;
  data: Order[];
  meta: OrdersMeta;
}

export interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface ReviewData {
  review: string;
  rating: number;
}

class OrdersService {
  private baseUrl = '/orders';

  /**
   * Get user orders with optional filters
   */
  async getOrders(filters?: OrderFilters): Promise<OrdersResponse> {
    const params = new URLSearchParams();
    
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get single order by ID
   */
  async getOrder(orderId: string): Promise<{ message: string; data: Order }> {
    const response = await api.get(`${this.baseUrl}/${orderId}`);
    return response.data;
  }

  /**
   * Add review to order item
   */
  async addReview(itemId: string, reviewData: ReviewData): Promise<{ message: string }> {
    const response = await api.patch(`${this.baseUrl}/items/${itemId}`, reviewData);
    return response.data;
  }
}

export const ordersService = new OrdersService();
export default ordersService;
