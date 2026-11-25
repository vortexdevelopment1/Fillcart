import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { handlePrismaTableErrors } from "../../../../errors/app-error.js";

export class DashboardService {
  constructor(private prisma: PrismaClient) {}

  public async getSummary(_period: string = "30d") {
    try {
      const [
        totalOrders,
        activeVendors,
        activeRiders,
        pendingVerifications,
        pendingProducts,
        recentOrders,
        categories,
      ] = await Promise.all([
        this.prisma.order.count(),
        this.prisma.vendor.count({ where: { status: "ACTIVE", isDeleted: false } }),
        this.prisma.rider.count({ where: { status: "ACTIVE", isDeleted: false } }),
        this.prisma.document.count({ where: { status: "PENDING", isDeleted: false } }),
        this.prisma.product.count({ where: { moderationStatus: "PENDING_APPROVAL", isDeleted: false } }),
        this.prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            totalAmountPaisa: true,
            status: true,
            createdAt: true,
          },
        }),
        this.prisma.category.findMany({
          take: 6,
          select: {
            id: true,
            name: true,
            _count: { select: { products: true } },
          },
        }),
      ]);

      // Calculate approximate GMV from totalAmountPaisa
      let totalGMV = 0;
      const agg = await this.prisma.order.aggregate({
        _sum: { totalAmountPaisa: true },
      });
      if (agg._sum.totalAmountPaisa) {
        totalGMV = Number(agg._sum.totalAmountPaisa / 100n);
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
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }
}
