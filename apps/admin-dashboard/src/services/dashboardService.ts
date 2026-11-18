import { ApiResponse, mockDelay } from './apiClient';

export interface DashboardKPIs {
  customers: number;
  vendors: number;
  riders: number;
  ordersToday: number;
  revenueToday: number;
  activeDeliveries: number;
  commissionToday: number;
  refundToday: number;
  activeUsers: number;
}

export const dashboardService = {
  // GET /dashboard
  getDashboardData: async (): Promise<ApiResponse<DashboardKPIs>> => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        customers: 12540,
        vendors: 315,
        riders: 486,
        ordersToday: 1860,
        revenueToday: 245000,
        activeDeliveries: 126,
        commissionToday: 29400,
        refundToday: 3850,
        activeUsers: 1243,
      },
    };
  },
};
