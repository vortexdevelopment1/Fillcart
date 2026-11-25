import type { PrismaClient } from "../../../../database/generated/client/client.js";

export class DashboardService {
  constructor(private prisma: PrismaClient) {}

  public async getSummary(_period: string = "30d") {
    const [
      totalOrders,
      activeVendors,
      activeRiders,
      pendingVerifications,
      pendingProducts,
      recentOrders,
      categories,
    ] = await Promise.all([
      this.prisma.order.count().catch(() => 0),
      this.prisma.vendor.count({ where: { status: "ACTIVE", isDeleted: false } }).catch(() => 0),
      this.prisma.rider.count({ where: { status: "ACTIVE", isDeleted: false } }).catch(() => 0),
      this.prisma.document.count({ where: { status: "PENDING", isDeleted: false } }).catch(() => 0),
      this.prisma.product.count({ where: { moderationStatus: "PENDING_APPROVAL", isDeleted: false } }).catch(() => 0),
      this.prisma.order
        .findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            totalAmountPaisa: true,
            status: true,
            createdAt: true,
          },
        })
        .catch(() => []),
      this.prisma.category
        .findMany({
          take: 6,
          select: {
            id: true,
            name: true,
            _count: { select: { products: true } },
          },
        })
        .catch(() => []),
    ]);

    // Calculate approximate GMV from totalAmountPaisa
    let totalGMV = 0;
    try {
      const agg = await this.prisma.order.aggregate({
        _sum: { totalAmountPaisa: true },
      });
      totalGMV = Number((agg._sum.totalAmountPaisa || 0n) / 100n);
    } catch {
      totalGMV = 0;
    }

    return {
      metrics: {
        totalRevenue: totalGMV,
        totalOrders,
        activeVendors,
        activeRiders,
        pendingVerifications,
        pendingProducts,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: Number(o.totalAmountPaisa) / 100,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      })),
      categoryBreakdown: categories.map((c) => ({
        name: c.name,
        productCount: c._count.products,
      })),
    };
  }
}
