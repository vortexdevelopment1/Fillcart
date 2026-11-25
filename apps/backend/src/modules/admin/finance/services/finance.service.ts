import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError, ConflictError, handlePrismaTableErrors } from "../../../../errors/app-error.js";
import type {
  CreateCommissionRuleRequest,
  CreateCouponRequest,
} from "@fillcart/validations";

export class FinanceService {
  constructor(private prisma: PrismaClient) {}

  public async getOverview(_period: string = "30d") {
    try {
      const [
        ordersAgg,
        settlementsCount,
        activeCouponsCount,
        commissionRules,
      ] = await Promise.all([
        this.prisma.order.aggregate({
          _sum: { totalAmountPaisa: true },
          _count: { id: true },
        }),
        this.prisma.settlementBatch.count({ where: { status: "DRAFT" } }),
        this.prisma.coupon.count({ where: { status: "ACTIVE", isDeleted: false } }),
        this.prisma.commissionRule.findMany({ take: 5 }),
      ]);

      const totalGMV = Number((ordersAgg._sum.totalAmountPaisa || 0n) / 100n);
      const estimatedCommission = Math.round(totalGMV * 0.1); // approx 10% platform fee
      const pendingSettlementAmount = Math.round(totalGMV * 0.85);

      return {
        metrics: {
          totalGMV,
          platformCommissionEarned: estimatedCommission,
          pendingSettlementAmount,
          pendingBatchesCount: settlementsCount,
          activeCouponsCount,
        },
        commissionRules: commissionRules.map((r) => ({
          id: r.id,
          name: r.name,
          percentage: Number(r.ratePct),
        })),
      };
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async getSettlements() {
    try {
      const batches = await this.prisma.settlementBatch.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          createdByUser: { select: { fullName: true } },
        },
      });

      return {
        batches: batches.map((b) => ({
          id: b.id,
          batchNumber: b.batchNumber,
          entityType: b.entityType,
          periodStart: b.periodStart.toISOString(),
          periodEnd: b.periodEnd.toISOString(),
          totalGross: Number(b.totalGrossAmountPaisa) / 100,
          totalNetPayout: Number(b.totalNetPayoutPaisa) / 100,
          totalCount: b.totalCount,
          status: b.status,
          createdBy: b.createdByUser?.fullName || "System Admin",
          processedAt: b.processedAt?.toISOString() || null,
          createdAt: b.createdAt.toISOString(),
        })),
      };
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async processSettlement(batchId: string, adminUserId: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const batch = await tx.settlementBatch.findUnique({
          where: { id: batchId },
        });

        if (!batch) {
          throw new NotFoundError("Settlement batch not found");
        }

        // Validated state transition: Reject illegal transitions with 409
        if (batch.status === "PROCESSING") {
          throw new ConflictError("Settlement batch is already processing");
        }
        if (batch.status === "COMPLETED") {
          throw new ConflictError("Settlement batch has already been completed");
        }
        if (batch.status === "FAILED") {
          throw new ConflictError("Cannot process a failed settlement batch");
        }

        // Concurrency check against double submits via updatedAt
        const updated = await tx.settlementBatch.update({
          where: { id: batchId, updatedAt: batch.updatedAt },
          data: {
            status: "PROCESSING",
            processedAt: new Date(),
          },
        });

        // AdminAuditLog entry with before and after in the same transaction
        await tx.adminAuditLog.create({
          data: {
            adminUserId,
            targetType: "FINANCE",
            targetId: batchId,
            action: "UPDATE",
            changesSummary: {
              before: { status: batch.status, processedAt: batch.processedAt },
              after: { status: "PROCESSING", processedAt: updated.processedAt },
            },
          },
        });

        // NOTE: In this phase, settlement process ONLY transitions the batch status to PROCESSING.
        // It does NOT invoke any external payment provider or bank gateway.
        return {
          success: true,
          batchId: updated.id,
          status: updated.status,
        };
      });
    } catch (err: any) {
      if (err.code === "P2025" || err.message?.includes("P2025")) {
        throw new ConflictError("Settlement batch was modified concurrently. Please refresh.");
      }
      throw err;
    }
  }

  public async getCommissions() {
    try {
      const rules = await this.prisma.commissionRule.findMany({
        orderBy: { createdAt: "desc" },
      });

      return {
        rules: rules.map((r) => ({
          id: r.id,
          name: r.name,
          categoryId: r.categoryId,
          vendorId: r.vendorId,
          percentage: Number(r.ratePct),
          createdAt: r.createdAt.toISOString(),
        })),
      };
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async createCommissionRule(payload: CreateCommissionRuleRequest, adminUserId?: string) {
    try {
      const rule = await this.prisma.commissionRule.create({
        data: {
          name: `Commission Rule - ${payload.category}`,
          ratePct: payload.percentage,
          effectiveFrom: new Date(),
          createdByUserId: adminUserId || "system-admin-bootstrap",
        },
      });

      return {
        success: true,
        rule,
      };
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async getCoupons() {
    try {
      const coupons = await this.prisma.coupon.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      return {
        coupons: coupons.map((c) => ({
          id: c.id,
          code: c.code,
          type: c.type,
          value: Number(c.valuePaisaOrPct),
          minOrderValue: Number(c.minOrderValuePaisa) / 100,
          maxDiscount: c.maxDiscountPaisa ? Number(c.maxDiscountPaisa) / 100 : null,
          totalUsageLimit: c.totalUsageLimit,
          currentUsageCount: c.currentUsageCount,
          validFrom: c.validFrom.toISOString(),
          validTo: c.validTo.toISOString(),
          status: c.status,
        })),
      };
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async createCoupon(payload: CreateCouponRequest) {
    try {
      const type = payload.discountType === "PERCENTAGE" ? "PERCENTAGE" : "FLAT_DISCOUNT";
      const value = payload.discountType === "PERCENTAGE" 
        ? BigInt(payload.discountValue) 
        : BigInt(payload.discountValue * 100);

      const coupon = await this.prisma.coupon.create({
        data: {
          code: payload.code.toUpperCase(),
          type: type as any,
          valuePaisaOrPct: value,
          minOrderValuePaisa: BigInt((payload.minOrderAmount || 0) * 100),
          maxDiscountPaisa: payload.maxDiscount ? BigInt(payload.maxDiscount * 100) : null,
          validFrom: new Date(),
          validTo: payload.expiresAt ? new Date(payload.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        success: true,
        couponId: coupon.id,
        code: coupon.code,
      };
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async getTaxes() {
    try {
      const slabs = await this.prisma.taxSlab.findMany({
        orderBy: { slabPercentage: "asc" },
      });

      return {
        taxSlabs: slabs.map((s) => ({
          id: s.id,
          name: s.name,
          percentage: Number(s.slabPercentage),
          hsnCode: s.hsnCode,
          isActive: s.isActive,
        })),
      };
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }
}
