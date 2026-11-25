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

export type VerifySettingsAccessRequest = z.infer<typeof verifySettingsAccessSchema>;
export type GetStaffQuery = z.infer<typeof getStaffQuerySchema>;
export type InviteStaffRequest = z.infer<typeof inviteStaffSchema>;
export type UpdateStaffStatusRequest = z.infer<typeof updateStaffStatusSchema>;
export type CreateSupportTicketRequest = z.infer<typeof createSupportTicketSchema>;
