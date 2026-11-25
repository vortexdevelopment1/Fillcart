import { z } from "zod";

export const verifySettingsAccessSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const getStaffQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"]).optional(),
  profile: z.string().optional(),
  search: z.string().optional(),
});

export const inviteStaffSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required").max(100),
  roleId: z.string().min(1, "Role ID is required"),
  profileId: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const updateStaffStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"]),
  reason: z.string().max(255).optional(),
});

export const createSupportTicketSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  category: z.enum([
    "BUG_REPORT",
    "PAYMENT_GATEWAY",
    "DISPATCH_SYSTEM",
    "DATABASE_SYNC",
    "ACCESS_PERMISSION",
    "FEATURE_REQUEST",
    "OTHER",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
});

// ==========================================
// B.1 DASHBOARD SCHEMAS
// ==========================================
export const dashboardSummaryQuerySchema = z.object({
  period: z.enum(["today", "7d", "30d", "all"]).optional().default("30d"),
});

// ==========================================
// B.2 VERIFICATION / KYC SCHEMAS
// ==========================================
export const getApplicantsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  type: z.enum(["Vendor", "Rider", "ALL"]).optional().default("ALL"),
  status: z.enum(["Pending", "Approved", "Rejected", "ALL"]).optional().default("ALL"),
  search: z.string().optional(),
});

export const reviewDocumentSchema = z.object({
  status: z.enum(["Approved", "Rejected"]),
  reason: z.string().optional(),
  remarks: z.string().optional(),
});

export const applicantDecisionSchema = z.object({
  decision: z.enum(["Approved", "Rejected"]),
  notes: z.string().optional(),
});

// ==========================================
// B.3 VENDOR MANAGEMENT SCHEMAS
// ==========================================
export const getVendorsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "INACTIVE", "ALL"]).optional().default("ALL"),
  category: z.string().optional(),
});

export const updateVendorStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "INACTIVE"]),
  reason: z.string().max(255).optional(),
  remarks: z.string().max(500).optional(),
});

export const updateVendorCommissionSchema = z.object({
  commissionPct: z.number().min(0).max(100),
  reason: z.string().max(255).optional(),
});

// ==========================================
// B.4 RIDER MANAGEMENT SCHEMAS
// ==========================================
export const getRidersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "INACTIVE", "ALL"]).optional().default("ALL"),
  availability: z.enum(["ONLINE", "OFFLINE", "ALL"]).optional().default("ALL"),
});

export const updateRiderStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "INACTIVE"]),
  reason: z.string().max(255).optional(),
  remarks: z.string().max(500).optional(),
});

export const updateRiderAvailabilitySchema = z.object({
  availability: z.enum(["ONLINE", "OFFLINE"]),
  reason: z.string().max(255).optional(),
});

// ==========================================
// B.5 ORDER & DISPATCH SCHEMAS
// ==========================================
export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(1, "Cancellation reason is required").max(255),
  remarks: z.string().max(500).optional(),
  triggerRefund: z.boolean().default(true),
});

export const assignRiderSchema = z.object({
  riderId: z.string().min(1, "Rider ID is required"),
  notes: z.string().max(255).optional(),
});

// ==========================================
// B.7 FINANCE HUB SCHEMAS
// ==========================================
export const createCommissionRuleSchema = z.object({
  category: z.string().min(1, "Category is required"),
  percentage: z.number().min(0).max(100),
  flatFee: z.number().min(0).default(0),
});

export const createCouponSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FLAT"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().min(0).optional().default(0),
  maxDiscount: z.number().positive().optional(),
  expiresAt: z.string().optional(),
});

// ==========================================
// B.8 REPORTS SCHEMAS
// ==========================================
export const getReportsQuerySchema = z.object({
  period: z.enum(["today", "7d", "30d", "90d", "1y"]).optional().default("30d"),
});

export type VerifySettingsAccessRequest = z.infer<typeof verifySettingsAccessSchema>;
export type GetStaffQuery = z.infer<typeof getStaffQuerySchema>;
export type InviteStaffRequest = z.infer<typeof inviteStaffSchema>;
export type UpdateStaffStatusRequest = z.infer<typeof updateStaffStatusSchema>;
export type CreateSupportTicketRequest = z.infer<typeof createSupportTicketSchema>;
export type DashboardSummaryQuery = z.infer<typeof dashboardSummaryQuerySchema>;
export type GetApplicantsQuery = z.infer<typeof getApplicantsQuerySchema>;
export type ReviewDocumentRequest = z.infer<typeof reviewDocumentSchema>;
export type ApplicantDecisionRequest = z.infer<typeof applicantDecisionSchema>;
export type GetVendorsQuery = z.infer<typeof getVendorsQuerySchema>;
export type UpdateVendorStatusRequest = z.infer<typeof updateVendorStatusSchema>;
export type UpdateVendorCommissionRequest = z.infer<typeof updateVendorCommissionSchema>;
export type GetRidersQuery = z.infer<typeof getRidersQuerySchema>;
export type UpdateRiderStatusRequest = z.infer<typeof updateRiderStatusSchema>;
export type UpdateRiderAvailabilityRequest = z.infer<typeof updateRiderAvailabilitySchema>;
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;
export type CancelOrderRequest = z.infer<typeof cancelOrderSchema>;
export type AssignRiderRequest = z.infer<typeof assignRiderSchema>;
export type CreateCommissionRuleRequest = z.infer<typeof createCommissionRuleSchema>;
export type CreateCouponRequest = z.infer<typeof createCouponSchema>;
export type GetReportsQuery = z.infer<typeof getReportsQuerySchema>;
