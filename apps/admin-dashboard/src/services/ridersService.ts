import { ApiResponse, mockDelay } from './apiClient';
import { initialRiders, Rider } from '../data/riders';

export const ridersService = {
  // GET /riders
  getRiders: async (): Promise<ApiResponse<Rider[]>> => {
    await mockDelay(300);
    return {
      success: true,
      data: initialRiders,
    };
  },

  // PATCH /riders/{id}/approve
  approveRider: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, status: 'Active' },
      message: 'Rider verified and approved',
    };
  },

  // PATCH /riders/{id}/suspend
  suspendRider: async (id: string, reason: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, status: 'Suspended' },
      message: `Rider suspended: ${reason}`,
    };
  },

  // // NOT IN API DOC
  // PATCH /riders/{id}/status
  updateRiderStatus: async (
    id: string,
    status: 'Active' | 'Inactive' | 'Suspended'
  ): Promise<ApiResponse<{ id: string; status: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, status },
      message: `Rider status updated to ${status}`,
    };
  },
};
