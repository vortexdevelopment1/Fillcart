import { ApiResponse, mockDelay } from './apiClient';

export interface ReportPayload {
  tab: string;
  period: string;
  kpis: Record<string, string | number>;
  tableData: any[];
}

export const reportsService = {
  // GET /reports
  getReport: async (tab: string, period: string): Promise<ApiResponse<ReportPayload>> => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        tab,
        period,
        kpis: {
          metric1: 1860,
          metric2: '₹2,45,000',
          metric3: '₹834',
          metric4: 126,
        },
        tableData: [],
      },
    };
  },
};
