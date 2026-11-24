import type { Prisma, AdminAuditAction, AuditTargetType } from "../../../database/generated/client/client.js";

export interface WriteAuditLogParams {
  adminUserId: string;
  action: AdminAuditAction;
  targetType: AuditTargetType;
  targetId: string;
  changesSummary?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Records an immutable AdminAuditLog row in the database within the given transaction.
 * AdminAuditLog is strictly INSERT and SELECT only (enforced by DB permissions).
 */
export async function recordAdminAudit(
  tx: Prisma.TransactionClient,
  params: WriteAuditLogParams
): Promise<void> {
  await tx.adminAuditLog.create({
    data: {
      adminUserId: params.adminUserId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      changesSummary: (params.changesSummary ?? null) as Prisma.InputJsonValue,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
    },
  });
}
