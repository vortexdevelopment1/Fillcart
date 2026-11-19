import { ApiResponse, mockDelay } from './apiClient';

export interface DocRolePermissions {
  roleName: string;
  isExternal?: boolean;
  permissions: Record<string, Record<string, boolean>>;
}

export const rolesService = {
  // GET /roles
  getRoles: async (): Promise<ApiResponse<DocRolePermissions[]>> => {
    await mockDelay(300);
    return {
      success: true,
      data: [],
    };
  },

  // POST /roles
  createRole: async (role: DocRolePermissions): Promise<ApiResponse<DocRolePermissions>> => {
    await mockDelay(300);
    return {
      success: true,
      data: role,
      message: `Role "${role.roleName}" created`,
    };
  },

  // PUT /roles/{id}
  updateRole: async (roleName: string, permissions: Record<string, Record<string, boolean>>): Promise<ApiResponse<{ roleName: string }>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { roleName },
      message: `Role "${roleName}" permissions updated`,
    };
  },
};
