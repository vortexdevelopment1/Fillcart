import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError } from "../../../../errors/app-error.js";
import type {
  GetVendorsQuery,
  UpdateVendorStatusRequest,
  UpdateVendorCommissionRequest,
} from "@fillcart/validations";

export class VendorsService {
  constructor(private prisma: PrismaClient) {}

  public async getVendors(query: GetVendorsQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };
    if (query.status && query.status !== "ALL") {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { businessName: { contains: query.search, mode: "insensitive" } },
        { ownerName: { contains: query.search, mode: "insensitive" } },
        { user: { fullName: { contains: query.search, mode: "insensitive" } } },
        { stores: { some: { storeName: { contains: query.search, mode: "insensitive" } } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { fullName: true, displayEmail: true, phone: true } },
          stores: { select: { id: true, storeName: true, city: true, state: true } },
          documents: { select: { id: true, status: true } },
        },
      }),
      this.prisma.vendor.count({ where }),
    ]);

    const formatted = items.map((v) => ({
      id: v.id,
      name: v.ownerName || v.user?.fullName || "Vendor",
      businessName: v.businessName,
      email: v.user?.displayEmail || "",
      phone: v.user?.phone || "",
      storeName: v.stores[0]?.storeName || "Primary Store",
      city: v.city || v.stores[0]?.city || "N/A",
      status: v.status,
      businessCategory: v.businessCategory,
      gstin: v.gstin || "N/A",
      documentsCount: v.documents.length,
      createdAt: v.createdAt.toISOString(),
    }));

    return {
      items: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public async getVendorDetails(id: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, displayEmail: true, phone: true, createdAt: true } },
        stores: true,
        bankAccounts: true,
        documents: {
          include: { documentType: true, fileAsset: true },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundError("Vendor not found");
    }

    const [productsCount, ordersCount] = await Promise.all([
      this.prisma.product.count({
        where: { submittedByUserId: vendor.userId, isDeleted: false },
      }).catch(() => 0),
      this.prisma.order.count({
        where: { storeId: vendor.stores[0]?.id || "" },
      }).catch(() => 0),
    ]);

    return {
      vendor,
      stats: {
        productsCount,
        ordersCount,
      },
    };
  }

  public async updateStatus(
    id: string,
    adminUserId: string,
    payload: UpdateVendorStatusRequest
  ) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      throw new NotFoundError("Vendor not found");
    }

    const updated = await this.prisma.vendor.update({
      where: { id },
      data: {
        status: payload.status as any,
        statusReason: payload.reason || null,
        statusRemarks: payload.remarks || null,
        statusChangedAt: new Date(),
        statusChangedByUserId: adminUserId,
      },
    });

    return {
      success: true,
      vendorId: updated.id,
      status: updated.status,
    };
  }

  public async updateCommission(
    id: string,
    adminUserId: string,
    payload: UpdateVendorCommissionRequest
  ) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      throw new NotFoundError("Vendor not found");
    }

    const rule = await this.prisma.commissionRule.upsert({
      where: { id: `comm-vendor-${id}` },
      update: {
        ratePct: payload.commissionPct,
        reason: payload.reason || "Custom vendor commission updated by admin",
      },
      create: {
        id: `comm-vendor-${id}`,
        name: `Custom Rate - ${vendor.businessName}`,
        vendorId: id,
        ratePct: payload.commissionPct,
        effectiveFrom: new Date(),
        createdByUserId: adminUserId,
      },
    });

    return {
      success: true,
      vendorId: id,
      commissionPct: Number(rule.ratePct),
    };
  }
}
