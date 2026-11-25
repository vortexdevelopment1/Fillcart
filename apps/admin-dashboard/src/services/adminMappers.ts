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
  Marketing_Admin: 'Marketing Admin',
  Marketing_Lead: 'Marketing Admin',
};

export const FRONTEND_TO_BACKEND_ROLES: Record<string, string> = {
  'Super Admin': 'System_Admin',
  'Operations Admin': 'Operations_Lead',
  'Support Admin': 'Support_Tier_1',
  'Finance Admin': 'Finance_Manager',
  'Security Auditor': 'Security_Auditor',
  'Marketing Admin': 'Marketing_Admin',
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

import type { Product, Category } from '../data/products';
import type { AuditLogEntry, AuditAction, AuditDiff } from '../data/auditData';
import type {
  BackendCategoryItem,
  BackendProductItem,
  BackendAuditLogItem,
} from '../types/adminApi';

/**
 * Maps backend Category item to frontend Category model.
 */
export function mapBackendCategoryToFrontend(item: BackendCategoryItem): Category {
  return {
    id: item.id,
    name: item.name,
    iconName: item.iconName || 'Package',
    productCount: item._count?.products ?? 0,
    isActive: item.isActive,
    parentCategory: item.parentCategoryId || undefined,
  };
}

/**
 * Maps backend Product item to frontend Product model.
 */
export function mapBackendProductToFrontend(item: BackendProductItem): Product {
  const defaultVariant = item.variants?.find((v) => v.isDefault) || item.variants?.[0];
  const mrpPaisa = defaultVariant ? parseInt(defaultVariant.mrpPaisa, 10) : 0;
  const salePricePaisa = defaultVariant ? parseInt(defaultVariant.salePricePaisa, 10) : mrpPaisa;

  const mrp = mrpPaisa / 100;
  const salePrice = salePricePaisa / 100;
  const discountPct =
    defaultVariant?.discountPct ??
    (mrp > 0 ? Math.round(((mrp - salePrice) / mrp) * 100) : 0);

  let frontendStatus: Product['status'] = 'Active';
  if (item.status === 'INACTIVE' || !item.isActive) {
    frontendStatus = 'Inactive';
  } else if (item.moderationStatus === 'PENDING') {
    frontendStatus = 'Pending approval';
  } else if (item.moderationStatus === 'REJECTED') {
    frontendStatus = 'Rejected';
  } else if (item.status === 'ACTIVE') {
    frontendStatus = 'Active';
  }

  const unitString = defaultVariant
    ? `${defaultVariant.unitQuantity} ${defaultVariant.unitType?.toLowerCase() || 'pc'}`
    : '1 pc';

  return {
    id: item.id,
    name: item.name,
    category: item.category?.name || 'General',
    vendor: 'Direct Merchant',
    mrp,
    salePrice,
    discountPct: discountPct > 0 ? discountPct : 0,
    itemsSold: 0,
    status: frontendStatus,
    sku: defaultVariant?.sku || item.slug,
    brand: item.brand?.name || 'Fillkart Essentials',
    unit: unitString,
    description: item.description || '',
    isActive: item.isActive,
    rejectReason: item.rejectionReason || undefined,
  };
}

/**
 * Maps backend Audit Log item to frontend AuditLogEntry model.
 */
export function mapBackendAuditLogToFrontend(item: BackendAuditLogItem): AuditLogEntry {
  let frontendAction: AuditAction = 'Update';
  const act = item.action.toUpperCase();
  if (act.includes('CREATE')) frontendAction = 'Create';
  else if (act.includes('DELETE')) frontendAction = 'Delete';
  else if (act.includes('APPROVE')) frontendAction = 'Approve';
  else if (act.includes('SUSPEND')) frontendAction = 'Suspend';
  else if (act.includes('LOGIN')) frontendAction = 'Login';

  const diff: AuditDiff[] = [];
  if (item.changesSummary && typeof item.changesSummary === 'object') {
    const beforeObj = item.changesSummary.before || {};
    const afterObj = item.changesSummary.after || {};
    const keys = new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]);
    for (const key of keys) {
      diff.push({
        field: key,
        before: String(beforeObj[key] ?? 'N/A'),
        after: String(afterObj[key] ?? 'N/A'),
      });
    }
  }

  return {
    id: item.id,
    timestamp: new Date(item.createdAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    admin: {
      name: item.adminUser?.fullName || 'Super Admin',
      role: 'Super Admin',
      email: item.adminUser?.email || 'admin@fillcart.internal',
    },
    action: frontendAction,
    module: item.targetType || 'System',
    target: item.targetId,
    details: `${item.action} on ${item.targetType}`,
    ip: item.ipAddress || '127.0.0.1',
    browser: item.userAgent || 'Web Console',
    diff: diff.length > 0 ? diff : undefined,
  };
}

