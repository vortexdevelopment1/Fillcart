import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError } from "../../../../errors/app-error.js";
import type {
  CreateCommissionRuleRequest,
  CreateCouponRequest,
} from "@fillcart/validations";

export class FinanceService {
  constructor(private prisma: PrismaClient) {}

  public async getOverview(_period: string = "30d") {
    const [
      ordersAgg,
      settlementsCount,
      activeCouponsCount,
      commissionRules,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { totalAmountPaisa: true },
        _count: { id: true },
      }).catch(() => ({ _sum: { totalAmountPaisa: null }, _count: { id: 0 } })),
      this.prisma.settlementBatch.count({ where: { status: "DRAFT" } }).catch(() => 0),
      this.prisma.coupon.count({ where: { status: "ACTIVE", isDeleted: false } }).catch(() => 0),
      this.prisma.commissionRule.findMany({ take: 5 }).catch(() => []),
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
  }

  public async getSettlements() {
    const batches = await this.prisma.settlementBatch.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        createdByUser: { select: { fullName: true } },
      },
    }).catch(() => []);

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
  }

  public async processSettlement(batchId: string) {
    const batch = await this.prisma.settlementBatch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      throw new NotFoundError("Settlement batch not found");
    }

    const updated = await this.prisma.settlementBatch.update({
      where: { id: batchId },
      data: {
        status: "PROCESSING",
        processedAt: new Date(),
      },
    });

    return {
      success: true,
      batchId: updated.id,
      status: updated.status,
    };
  }

  public async getCommissions() {
    const rules = await this.prisma.commissionRule.findMany({
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

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
  }

  public async createCommissionRule(payload: CreateCommissionRuleRequest) {
    const rule = await this.prisma.commissionRule.create({
      data: {
        name: `Commission Rule - ${payload.category}`,
        ratePct: payload.percentage,
        effectiveFrom: new Date(),
        createdByUserId: "system-admin-bootstrap",
      },
    });

    return {
      success: true,
      rule,
    };
  }

  public async getCoupons() {
    const coupons = await this.prisma.coupon.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    }).catch(() => []);

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
  }

  public async createCoupon(payload: CreateCouponRequest) {
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
  }

  public async getTaxes() {
    const slabs = await this.prisma.taxSlab.findMany({
      orderBy: { slabPercentage: "asc" },
    }).catch(() => []);

    return {
      taxSlabs: slabs.map((s) => ({
        id: s.id,
        name: s.name,
        percentage: Number(s.slabPercentage),
        hsnCode: s.hsnCode,
        isActive: s.isActive,
      })),
    };
  }
}
