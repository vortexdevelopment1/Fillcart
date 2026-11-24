import { z } from "zod";

export const auditTargetTypeSchema = z.enum([
  "STAFF",
  "VENDOR",
  "RIDER",
  "ORDER",
  "CATALOG",
  "SETTING",
  "FINANCE",
  "DOCUMENT",
]);

export const adminAuditActionSchema = z.enum([
  "CREATE",
  "UPDATE",
  "DELETE_SOFT",
  "APPROVE",
  "REJECT",
  "SUSPEND",
  "REINSTATE",
  "OVERRIDE",
  "CONFIG_CHANGE",
]);

export const getAuditLogsQuerySchema = z.object({
  adminUserId: z.string().uuid("Invalid admin user ID").optional(),
  action: adminAuditActionSchema.optional(),
  targetType: auditTargetTypeSchema.optional(),
  startDate: z.string().datetime({ offset: true }).or(z.string().datetime()).optional(),
  endDate: z.string().datetime({ offset: true }).or(z.string().datetime()).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type AuditTargetType = z.infer<typeof auditTargetTypeSchema>;
export type AdminAuditAction = z.infer<typeof adminAuditActionSchema>;
export type GetAuditLogsQuery = z.infer<typeof getAuditLogsQuerySchema>;
