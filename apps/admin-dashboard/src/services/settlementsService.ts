import { ApiResponse, mockDelay } from './apiClient';
import { initialTransactions, initialStatements, PaymentTransaction, MonthlyStatement } from '../data/paymentsData';

export const settlementsService = {
  // GET /settlements
  getSettlements: async (): Promise<ApiResponse<PaymentTransaction[]>> => {
    await mockDelay(300);
    const settlements = initialTransactions.filter(
      (t) => t.type === 'Vendor Payout' || t.type === 'Rider Payout'
    );
    return {
      success: true,
      data: settlements,
    };
  },

  // POST /settlements/process
  processSettlement: async (
    transactionIds: string[]
  ): Promise<ApiResponse<{ processedCount: number; totalAmount: number }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        processedCount: transactionIds.length,
        totalAmount: 42900,
      },
      message: `Successfully released ${transactionIds.length} settlement disbursements via banking network.`,
    };
  },

  // GET /statements
  getStatements: async (): Promise<ApiResponse<MonthlyStatement[]>> => {
    await mockDelay(300);
    return {
      success: true,
      data: initialStatements,
    };
  },
};
