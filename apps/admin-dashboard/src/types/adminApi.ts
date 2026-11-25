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
  password?: string;
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

// ---------------------------------------------------------------------------
// Catalogue API Types (Categories, Brands, Products, Inventory)
// ---------------------------------------------------------------------------

export interface BackendCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconName?: string | null;
  parentCategoryId?: string | null;
  displayOrder: number;
  isActive: boolean;
  subCategories?: BackendCategoryItem[];
  _count?: { products: number };
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  iconName?: string;
  parentCategoryId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  iconName?: string;
  parentCategoryId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface ReorderCategoryItem {
  id: string;
  displayOrder: number;
}

export interface BackendBrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  isActive: boolean;
}

export interface CreateBrandPayload {
  name: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface UpdateBrandPayload {
  name?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface BackendVariantItem {
  id: string;
  productId: string;
  sku: string;
  variantName: string;
  unitQuantity: number;
  unitType: string;
  mrpPaisa: string;
  salePricePaisa: string;
  discountPct: number;
  isDefault: boolean;
}

export interface BackendProductItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  brandId?: string | null;
  hsnCode?: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  rejectionReason?: string | null;
  isActive: boolean;
  category?: { id: string; name: string };
  brand?: { id: string; name: string } | null;
  variants: BackendVariantItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  moderationStatus?: string;
}

export interface GetProductsResponse {
  items: BackendProductItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductVariantPayload {
  sku: string;
  variantName: string;
  unitQuantity: number;
  unitType?: string;
  mrpPaisa: string;
  salePricePaisa: string;
  discountPct?: number;
  isDefault?: boolean;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  hsnCode?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  variants: CreateProductVariantPayload[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  hsnCode?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  variants?: CreateProductVariantPayload[];
}

export interface ModerateProductPayload {
  action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES';
  reason?: string;
}

export interface BulkUpdateProductStatusPayload {
  productIds: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export interface BackendInventoryItem {
  id: string;
  storeId: string;
  variantId: string;
  quantityOnHand: number;
  reservedQuantity: number;
  storeName?: string;
  variantSku?: string;
  variantName?: string;
  productName?: string;
  updatedAt: string;
}

export interface GetInventoryParams {
  page?: number;
  limit?: number;
  storeId?: string;
  variantId?: string;
  lowStockOnly?: boolean;
}

export interface GetInventoryResponse {
  items: BackendInventoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdjustInventoryPayload {
  storeId: string;
  variantId: string;
  adjustmentQuantity: number;
  reason: string;
}

// ---------------------------------------------------------------------------
// Settings & Audit Logs API Types
// ---------------------------------------------------------------------------

export type SettingsTabId =
  | 'GENERAL'
  | 'ORDERS'
  | 'ONBOARDING'
  | 'FINANCE'
  | 'NOTIFICATIONS'
  | 'SECURITY';

export interface BackendSettingsGroupResponse {
  group: SettingsTabId;
  settings: Record<string, any>;
}

export interface BackendAuditLogItem {
  id: string;
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  changesSummary?: {
    before?: any;
    after?: any;
    group?: string;
    [key: string]: any;
  } | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  adminUser?: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  adminUserId?: string;
  targetType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetAuditLogsResponse {
  items: BackendAuditLogItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
