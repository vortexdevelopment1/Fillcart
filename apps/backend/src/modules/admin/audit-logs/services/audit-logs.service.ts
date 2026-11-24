import type { PrismaClient } from "../../../../database/generated/client/client.js";
import type { GetAuditLogsQuery } from "@fillcart/validations";

export class AuditLogsService {
  constructor(private prisma: PrismaClient) {}

  public async getAuditLogs(query: GetAuditLogsQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (query.adminUserId) {
      where.adminUserId = query.adminUserId;
    }

    if (query.action) {
      where.action = query.action;
    }

    if (query.targetType) {
      where.targetType = query.targetType;
    }

    if (query.startDate || query.endDate) {
      const createdAtFilter: Record<string, unknown> = {};
      if (query.startDate) {
        createdAtFilter.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        createdAtFilter.lte = new Date(query.endDate);
      }
      where.createdAt = createdAtFilter;
    }

    const [items, total] = await Promise.all([
      this.prisma.adminAuditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          adminUser: {
            select: {
              id: true,
              fullName: true,
              emailNormalized: true,
            },
          },
        },
      }),
      this.prisma.adminAuditLog.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
