import { ApiResponse, mockDelay } from './apiClient';

export interface UserSummary {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'Customer' | 'Vendor' | 'Rider';
  status: 'Active' | 'Inactive' | 'Suspended';
  isBlocked: boolean;
  joinedDate: string;
}

export const usersService = {
  // GET /users
  getUsers: async (role?: string): Promise<ApiResponse<UserSummary[]>> => {
    await mockDelay(300);
    const mockUsers: UserSummary[] = [
      { id: 'u-1', name: 'Ananya Sharma', phone: '9820112233', email: 'ananya.s@gmail.com', role: 'Customer', status: 'Active', isBlocked: false, joinedDate: '10 Jan 2026' },
      { id: 'u-2', name: 'Rahul Verma', phone: '9811223344', email: 'rahul.v@outlook.com', role: 'Customer', status: 'Active', isBlocked: false, joinedDate: '14 Feb 2026' },
      { id: 'u-3', name: 'Fresh Mart Hub', phone: '9810000000', email: 'contact@freshmarthub.in', role: 'Vendor', status: 'Active', isBlocked: false, joinedDate: '01 Mar 2026' },
      { id: 'u-4', name: 'Vikram Singh', phone: '9876543210', email: 'vikram.singh@rider.in', role: 'Rider', status: 'Active', isBlocked: false, joinedDate: '15 Mar 2026' },
      { id: 'u-5', name: 'Pooja Iyer', phone: '9833445566', email: 'pooja.iyer@yahoo.com', role: 'Customer', status: 'Suspended', isBlocked: true, joinedDate: '20 Apr 2026' },
    ];
    return {
      success: true,
      data: role ? mockUsers.filter((u) => u.role === role) : mockUsers,
    };
  },

  // GET /users/{id}
  getUserById: async (id: string): Promise<ApiResponse<UserSummary>> => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        id,
        name: 'User ' + id,
        phone: '9800000000',
        email: `user.${id}@fillkart.in`,
        role: 'Customer',
        status: 'Active',
        isBlocked: false,
        joinedDate: '01 Jan 2026',
      },
    };
  },

  // PATCH /users/{id}/block
  blockUser: async (id: string, reason?: string): Promise<ApiResponse<{ id: string; isBlocked: boolean }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, isBlocked: true },
      message: `User blocked: ${reason || 'Administrative policy'}`,
    };
  },

  // PATCH /users/{id}/unblock
  unblockUser: async (id: string): Promise<ApiResponse<{ id: string; isBlocked: boolean }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { id, isBlocked: false },
      message: 'User unblocked successfully',
    };
  },
};
