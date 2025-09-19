import api from './api';

interface AddToCartRequest {
  productId: string;
  quantity: number;
  customizations?: string[];
  measurements?: {
    earToEar?: string;
    headCircumference?: string;
    harlineImages?: string[];
    wigStyleImages?: string[];
  };
  productFittingOptionId?: string;
  productProcessingTimeId?: string;
}

interface AddToCartResponse {
  message: string;
}

interface ProductInfo {
  id: string;
  name: string;
  thumbnail: string;
  basePrice: number;
  description: string;
  status: string;
  visibility: string;
  totalQuantity: number;
  quantityAvailable: number;
  quantitySold: number;
  gallery: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface WigUnit {
  id: string;
  basePrice: number;
  description: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface CustomizationOption {
  itemCustomizationId: string;
  customizationId: string;
  name: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Customization {
  typeName: string;
  description: string;
  options: CustomizationOption[];
  createdAt: string;
}

interface PrivateFitting {
  productFittingOptionId: string;
  fittingOptionId: string;
  name: string;
  price: number;
}

interface ProcessingTime {
  productProcessingTimeId: string;
  processingTimeId: string;
  label: string;
  price: number;
}

interface CartItem {
  id: string;
  measurements?: {
    earToEar?: string;
    headCircumference?: string;
    harlineImages?: string[];
    wigStyleImages?: string[];
  };
  privateFitting?: PrivateFitting;
  processingTime?: ProcessingTime;
  product?: ProductInfo;
  wigUnit?: WigUnit;
  customizations: Customization[];
  quantity: number;
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
}

interface CartResponse {
  message: string;
  data: {
    totalPrice: number;
    items: CartItem[];
  };
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

interface CartItemResponse {
  message: string;
  data: CartItem;
}

class CartService {
  private baseUrl = '/cart';

  /**
   * Add item to cart
   */
  async addToCart(data: AddToCartRequest): Promise<AddToCartResponse> {
    const response = await api.post(`${this.baseUrl}/items`, data);
    return response.data;
  }

  /**
   * Get cart items
   */
  async getCart(): Promise<CartResponse> {
    const response = await api.get(`${this.baseUrl}`);
    return response.data;
  }


  /**
   * Update cart item
   */
  async updateCartItem(itemId: string, data: { quantity?: number; customizations?: string[] }): Promise<{ message: string }> {
    const response = await api.patch(`${this.baseUrl}/items/${itemId}`, data);
    return response.data;
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/items/${itemId}`);
    return response.data;
  }

  /**
   * Get single cart item
   */
  async getCartItem(itemId: string): Promise<{ message: string; data: CartItem }> {
    const response = await api.get(`${this.baseUrl}/items/${itemId}`);
    return response.data;
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}`);
    return response.data;
  }
}

export const cartService = new CartService();
export default cartService;
export type { 
  AddToCartRequest, 
  AddToCartResponse, 
  CartResponse, 
  CartItem, 
  CartItemResponse,
  ProductInfo,
  WigUnit,
  Customization,
  CustomizationOption,
  PrivateFitting,
  ProcessingTime
};
