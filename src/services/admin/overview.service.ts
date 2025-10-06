import api from '../api';

export interface OverviewData {
  consultation: {
    totalConsultations: number;
    revenue: number;
    pendingConsultations: number;
    completedConsultations: number;
    canceledConsultations: number;
    confirmedConsultations: number;
  };
  orders: {
    totalOrders: number;
    revenue: number;
    pendingOrders: number;
    completedOrders: number;
    processingOrders: number;
    cancelledOrders: number;
  };
  users: {
    totalUsers: number;
  };
  products: {
    totalProducts: number;
  };
  revenue: number;
}

export interface OverviewResponse {
  message: string;
  data: OverviewData;
}

class OverviewService {
  private baseUrl = '/admin/overview';

  /**
   * Get admin overview data
   */
  async getOverview(params?: {
    since?:
      | 'this_week'
      | 'this_month'
      | 'last_seven_days'
      | 'last_thirty_days'
      | 'last_three_months'
      | 'last_six_months'
      | 'last_year';
  }): Promise<OverviewResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.since) {
      queryParams.append('since', params.since);
    }

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }
}

export const overviewService = new OverviewService();
