import { ApiResponse, mockDelay } from './apiClient';
import { initialOrders, Order } from '../data/ordersData';

export const ordersService = {
  // GET /orders
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    await mockDelay(300);
    return {
      success: true,
      data: initialOrders,
    };
  },

  // GET /orders/{id}
  getOrderById: async (id: string): Promise<ApiResponse<Order | null>> => {
    await mockDelay(300);
    const order = initialOrders.find((o) => o.id === id) || null;
    return {
      success: true,
      data: order,
    };
  },

  // PATCH /orders/{id}/cancel
  cancelOrder: async (
    id: string,
    reason: string,
    remarks?: string
  ): Promise<ApiResponse<{ id: string; status: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, status: 'Cancelled' },
      message: `Order cancelled: ${reason}. Remarks: ${remarks || 'None'}`,
    };
  },

  // // NOT IN API DOC
  // PUT /settings (orders.assignmentMode: 'Manual' | 'Auto')
  setAssignmentMode: async (
    mode: 'Manual' | 'Auto'
  ): Promise<ApiResponse<{ assignmentMode: 'Manual' | 'Auto' }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { assignmentMode: mode },
      message: `Order dispatch assignment mode switched to ${mode}`,
    };
  },
};
