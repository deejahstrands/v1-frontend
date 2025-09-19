import api from './api';

export interface Address {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  country: string;
  province: string;
  streetAddress: string;
  state: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  apartment: string;
  default: boolean;
}

export interface AddAddressRequest {
  country: string;
  province: string;
  streetAddress: string;
  state: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  apartment: string;
  default: boolean;
}

export interface AddressResponse {
  message: string;
  data: Address[];
}

export interface SingleAddressResponse {
  message: string;
  data: Address;
}

class AddressService {
  private baseUrl = '/users/me/addresses';

  /**
   * Get all user addresses
   */
  async getAddresses(): Promise<AddressResponse> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }

  /**
   * Get single address
   */
  async getAddress(addressId: string): Promise<SingleAddressResponse> {
    const response = await api.get(`${this.baseUrl}/${addressId}`);
    return response.data;
  }

  /**
   * Add new address
   */
  async addAddress(data: AddAddressRequest): Promise<SingleAddressResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update address
   */
  async updateAddress(addressId: string, data: Partial<AddAddressRequest>): Promise<SingleAddressResponse> {
    const response = await api.patch(`${this.baseUrl}/${addressId}`, data);
    return response.data;
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${addressId}`);
    return response.data;
  }
}

export const addressService = new AddressService();
export default addressService;
