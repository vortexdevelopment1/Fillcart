import type {
  StaffMember,
  RolePermissions,
  ModuleName,
  ActionName,
} from '../data/staffData';
import { MODULE_NAMES, ACTION_NAMES } from '../data/staffData';
import type { BackendStaffUser, BackendRoleItem } from '../types/adminApi';

/**
 * Maps backend profile/role names to frontend UI tab and badge labels.
 */
export const BACKEND_TO_FRONTEND_ROLES: Record<string, string> = {
  System_Admin: 'Super Admin',
  ADMIN: 'Super Admin',
  Operations_Lead: 'Operations Admin',
  Support_Tier_1: 'Support Admin',
  Security_Auditor: 'Security Auditor',
  Finance_Manager: 'Finance Admin',
};

export const FRONTEND_TO_BACKEND_ROLES: Record<string, string> = {
  'Super Admin': 'System_Admin',
  'Operations Admin': 'Operations_Lead',
  'Support Admin': 'Support_Tier_1',
  'Finance Admin': 'Finance_Manager',
  'Security Auditor': 'Security_Auditor',
};

/**
 * Normalizes backend profile/role name to UI role name
 */
export function mapBackendRoleToFrontend(roleOrProfileName?: string | null): string {
  if (!roleOrProfileName) return 'Operations Admin';
  return BACKEND_TO_FRONTEND_ROLES[roleOrProfileName] || roleOrProfileName;
}

/**
 * Maps BackendStaffUser to frontend StaffMember model
 */
export function mapBackendStaffToFrontend(user: BackendStaffUser): StaffMember {
  const nameParts = user.fullName.trim().split(/\s+/);
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (user.fullName.slice(0, 2) || 'OP').toUpperCase();

  let formattedLastLogin = 'Never';
  if (user.lastLogin) {
    try {
      const d = new Date(user.lastLogin);
      if (!isNaN(d.getTime())) {
        formattedLastLogin = d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
    } catch {
      formattedLastLogin = user.lastLogin;
    }
  }

  const roleLabel = mapBackendRoleToFrontend(user.profile || user.role);

  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    phone: user.phone || '',
    role: roleLabel,
    isActive: user.status === 'ACTIVE',
    initials,
    lastLogin: formattedLastLogin,
    createdDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '',
  };
}

/**
 * Converts backend role/profile permissions list into the frontend 9x5 RolePermissions matrix.
 */
export function mapBackendPermissionsToMatrix(
  permissions: string[] = [],
  roleName: string
): RolePermissions {
  const permSet = new Set(permissions.map((p) => p.toLowerCase()));
  const isSuperAdmin = roleName === 'ADMIN' || roleName === 'System_Admin' || roleName === 'Super Admin';

  const matrix: Partial<RolePermissions> = {};

  for (const mod of MODULE_NAMES) {
    matrix[mod] = {
      View: isSuperAdmin,
      Create: isSuperAdmin,
      Edit: isSuperAdmin,
      Delete: isSuperAdmin,
      Approve: isSuperAdmin,
    };
  }

  if (isSuperAdmin) {
    return matrix as RolePermissions;
  }

  const check = (keys: string[]): boolean => {
    return keys.some((k) => {
      const lower = k.toLowerCase();
      if (permSet.has(lower)) return true;
      if (lower.includes(':')) {
        const [a, b] = lower.split(':');
        if (permSet.has(`${b}:${a}`)) return true;
      }
      return false;
    });
  };

  // 1. Dashboard
  matrix.Dashboard!.View = true;

  // 2. Users & Staff
  matrix.Users!.View = check(['view:users', 'staff:view', 'view:staff']);
  matrix.Users!.Create = check(['invite:admin', 'staff:manage', 'manage:staff']);
  matrix.Users!.Edit = check(['staff:manage', 'manage:staff']);
  matrix.Users!.Delete = check(['suspend:users', 'staff:manage', 'manage:staff']);

  // 3. Products
  matrix.Products!.View = check(['view:products']);
  matrix.Products!.Create = check(['manage:products']);
  matrix.Products!.Edit = check(['manage:products', 'manage:inventory']);
  matrix.Products!.Delete = check(['manage:products']);

  // 4. Orders
  matrix.Orders!.View = check(['view:orders']);
  matrix.Orders!.Create = check(['create:orders', 'manage:orders']);
  matrix.Orders!.Edit = check(['manage:orders']);
  matrix.Orders!.Delete = check(['cancel:orders', 'manage:orders']);
  matrix.Orders!.Approve = check(['approve:vendors', 'approve:riders']);

  // 5. Audit Logs
  matrix['Audit Logs']!.View = check(['audit_view:admin', 'admin:audit_view']);

  return matrix as RolePermissions;
}

/**
 * Converts backend roles list to a dictionary of RolePermissions for all available role tabs.
 */
export function buildFrontendRolesDictionary(
  backendRoles: BackendRoleItem[],
  fallbackRoles: Record<string, RolePermissions>
): {
  rolesDictionary: Record<string, RolePermissions>;
  roleIdMapping: Record<string, string>;
  roleToProfileIdMapping: Record<string, string>;
} {
  const rolesDictionary: Record<string, RolePermissions> = { ...fallbackRoles };
  const roleIdMapping: Record<string, string> = {};
  const roleToProfileIdMapping: Record<string, string> = {};

  for (const item of backendRoles) {
    const frontendLabel = mapBackendRoleToFrontend(item.name);
    rolesDictionary[frontendLabel] = mapBackendPermissionsToMatrix(item.permissions, item.name);

    if (item.isSystem && item.name === 'ADMIN') {
      roleIdMapping[frontendLabel] = item.id;
    } else {
      roleToProfileIdMapping[frontendLabel] = item.id;
    }
  }

  return { rolesDictionary, roleIdMapping, roleToProfileIdMapping };
}
