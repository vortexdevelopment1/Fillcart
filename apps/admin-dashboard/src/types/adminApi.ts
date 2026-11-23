export interface BackendApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
  requestId?: string;
}

export interface VerifySettingsAccessResponse {
  verified: boolean;
  token: string;
  expiresIn: number;
}

export interface BackendRoleItem {
  id: string;
  name: string;
  description?: string | null;
  isSystem?: boolean;
  permissions: string[];
}

export interface GetRolesResponse {
  roles: BackendRoleItem[];
}

export interface BackendStaffUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  role: string;
  profile?: string | null;
  lastLogin?: string | null;
  createdAt: string;
}

export interface GetStaffParams {
  page?: number;
  limit?: number;
  status?: string;
  profile?: string;
  search?: string;
}

export interface GetStaffResponse {
  items: BackendStaffUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InviteStaffPayload {
  email: string;
  fullName: string;
  roleId: string;
  profileId?: string | null;
}

export interface InviteStaffResponse {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  profileId?: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface UpdateStaffStatusPayload {
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  reason?: string;
}

export interface UpdateStaffStatusResponse {
  id: string;
  status: string;
  suspensionReason?: string | null;
}
