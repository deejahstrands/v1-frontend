import api from './api';

export interface CheckoutRequest {
  deliveryNote?: string;
  shippingAddress: string;
  callbackUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponse {
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

class CheckoutService {
  private baseUrl = '/cart/checkout';

  /**
   * Initiate checkout process
   */
  async checkout(data: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }
}

export const checkoutService = new CheckoutService();
export default checkoutService;
