import { ApiResponse, mockDelay } from './apiClient';
import { initialVendors, Vendor } from '../data/vendors';

export const vendorsService = {
  // GET /vendors
  getVendors: async (): Promise<ApiResponse<Vendor[]>> => {
    await mockDelay(300);
    return {
      success: true,
      data: initialVendors,
    };
  },

  // PATCH /vendors/{id}/approve
  approveVendor: async (id: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, status: 'Active' },
      message: 'Vendor approved and verified',
    };
  },

  // PATCH /vendors/{id}/reject
  rejectVendor: async (id: string, reason: string): Promise<ApiResponse<{ id: string; reason: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, reason },
      message: `Vendor application rejected: ${reason}`,
    };
  },

  // PATCH /vendors/{id}/suspend
  suspendVendor: async (id: string, reason: string): Promise<ApiResponse<{ id: string; status: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, status: 'Suspended' },
      message: `Vendor suspended: ${reason}`,
    };
  },

  // // NOT IN API DOC
  // PATCH /vendors/{id}/status
  updateVendorStatus: async (
    id: string,
    status: 'Active' | 'Inactive' | 'Suspended'
  ): Promise<ApiResponse<{ id: string; status: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, status },
      message: `Vendor status updated to ${status}`,
    };
  },
};
