import { Prisma, type PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError, BadRequestError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import { recordAdminAudit } from "../../utils/audit-logger.js";
import type {
  GetProductsQuery,
  CreateProductRequest,
  UpdateProductRequest,
  ProductStatus,
  ModerateProductRequest,
  BulkUpdateProductStatusRequest,
} from "@fillcart/validations";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function serializeVariant(v: Record<string, unknown>) {
  return {
    ...v,
    unitQuantity: v.unitQuantity != null ? v.unitQuantity.toString() : "0",
    mrpPaisa: v.mrpPaisa != null ? v.mrpPaisa.toString() : "0",
    salePricePaisa: v.salePricePaisa != null ? v.salePricePaisa.toString() : "0",
  };
}

function serializeProduct(p: any): any {
  const variants = Array.isArray(p.variants) ? p.variants.map((v: any) => serializeVariant(v)) : [];
  return {
    ...p,
    variants,
  };
}

export class ProductsService {
  constructor(private prisma: PrismaClient) {}

  public async list(query: GetProductsQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      isDeleted: false,
    };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.brandId) {
      where.brandId = query.brandId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.moderationStatus) {
      where.moderationStatus = query.moderationStatus;
    }

    if (query.search) {
      const s = query.search.trim().toLowerCase();
      where.OR = [
        { name: { contains: s, mode: "insensitive" } },
        { slug: { contains: s } },
        { description: { contains: s, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          brand: {
            select: { id: true, name: true, slug: true, logoUrl: true },
          },
          submittedBy: {
            select: { id: true, fullName: true, emailNormalized: true },
          },
          moderatedBy: {
            select: { id: true, fullName: true, emailNormalized: true },
          },
          variants: {
            where: { isDeleted: false },
            orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((p) => serializeProduct(p as unknown as Record<string, unknown>)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        submittedBy: {
          select: { id: true, fullName: true, emailNormalized: true },
        },
        moderatedBy: {
          select: { id: true, fullName: true, emailNormalized: true },
        },
        variants: {
          where: { isDeleted: false },
          include: {
            inventoryBalances: {
              include: {
                store: {
                  select: { id: true, storeName: true, storeCode: true, city: true },
                },
              },
            },
          },
        },
      },
    });

    if (!product || product.isDeleted) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }

    return serializeProduct(product as unknown as Record<string, unknown>);
  }

  public async create(
    data: CreateProductRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const slug = data.slug || slugify(data.name);

    // Slug conflict check
    const existing = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new BadRequestError(`Product with slug '${slug}' already exists`, ERROR_CODES.BAD_REQUEST);
    }

    // Verify category
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category || category.isDeleted) {
      throw new BadRequestError("Category not found or is deleted", ERROR_CODES.BAD_REQUEST);
    }

    // Verify brand if provided
    if (data.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: data.brandId },
      });
      if (!brand || brand.isDeleted) {
        throw new BadRequestError("Brand not found or is deleted", ERROR_CODES.BAD_REQUEST);
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: data.name,
          slug,
          description: data.description ?? null,
          categoryId: data.categoryId,
          brandId: data.brandId ?? null,
          hsnCode: data.hsnCode ?? null,
          status: data.status ?? "DRAFT",
          moderationStatus: "PENDING_APPROVAL",
          submittedByUserId: adminUserId,
          submittedAt: new Date(),
          isActive: (data.status ?? "DRAFT") === "ACTIVE",
          variants: {
            create: data.variants.map((v, idx) => ({
              sku: v.sku,
              barcode: v.barcode ?? null,
              variantName: v.variantName,
              unitQuantity: new Prisma.Decimal(v.unitQuantity),
              unitType: v.unitType,
              mrpPaisa: BigInt(v.mrpPaisa),
              salePricePaisa: BigInt(v.salePricePaisa),
              discountPct: v.discountPct ?? 0,
              isDefault: v.isDefault ?? idx === 0,
            })),
          },
        },
        include: {
          variants: true,
          category: true,
          brand: true,
        },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "CREATE",
        targetType: "CATALOG",
        targetId: created.id,
        changesSummary: {
          createdEntity: "Product",
          name: created.name,
          slug: created.slug,
          variantCount: created.variants.length,
        },
        ipAddress,
        userAgent,
      });

      return serializeProduct(created as unknown as Record<string, unknown>);
    });
  }

  public async update(
    id: string,
    data: UpdateProductRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }

    const nextSlug = data.slug || (data.name ? slugify(data.name) : undefined);
    if (nextSlug && nextSlug !== existing.slug) {
      const duplicate = await this.prisma.product.findUnique({
        where: { slug: nextSlug },
      });
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestError(`Product with slug '${nextSlug}' already exists`, ERROR_CODES.BAD_REQUEST);
      }
    }

    if (data.categoryId) {
      const cat = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!cat || cat.isDeleted) {
        throw new BadRequestError("Category not found or is deleted", ERROR_CODES.BAD_REQUEST);
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(nextSlug && { slug: nextSlug }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.brandId !== undefined && { brandId: data.brandId }),
          ...(data.hsnCode !== undefined && { hsnCode: data.hsnCode }),
          ...(data.status && {
            status: data.status,
            isActive: data.status === "ACTIVE",
          }),
        },
        include: {
          variants: true,
          category: true,
          brand: true,
        },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: updated.id,
        changesSummary: {
          updatedEntity: "Product",
          before: {
            name: existing.name,
            slug: existing.slug,
            status: existing.status,
          },
          after: {
            name: updated.name,
            slug: updated.slug,
            status: updated.status,
          },
        },
        ipAddress,
        userAgent,
      });

      return serializeProduct(updated as unknown as Record<string, unknown>);
    });
  }

  public async updateStatus(
    id: string,
    status: ProductStatus,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          status,
          isActive: status === "ACTIVE",
        },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: id,
        changesSummary: {
          updatedEntity: "Product",
          action: "STATUS_TOGGLE",
          before: { status: existing.status, isActive: existing.isActive },
          after: { status: updated.status, isActive: updated.isActive },
        },
        ipAddress,
        userAgent,
      });

      return serializeProduct(updated as unknown as Record<string, unknown>);
    });
  }

  public async moderate(
    id: string,
    data: ModerateProductRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }

    let nextModerationStatus: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
    let nextStatus = existing.status;
    let nextIsActive = existing.isActive;
    let nextRejectReason = existing.rejectReason;

    if (data.action === "APPROVE") {
      nextModerationStatus = "APPROVED";
      nextStatus = "ACTIVE";
      nextIsActive = true;
      nextRejectReason = null;
    } else if (data.action === "REJECT") {
      nextModerationStatus = "REJECTED";
      nextStatus = "INACTIVE";
      nextIsActive = false;
      nextRejectReason = data.reason!;
    } else {
      nextModerationStatus = "CHANGES_REQUESTED";
      nextRejectReason = data.reason!;
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          moderationStatus: nextModerationStatus,
          status: nextStatus,
          isActive: nextIsActive,
          rejectReason: nextRejectReason,
          moderatedByUserId: adminUserId,
          moderatedAt: new Date(),
        },
        include: {
          category: true,
          brand: true,
          moderatedBy: {
            select: { id: true, fullName: true, emailNormalized: true },
          },
        },
      });

      const auditAction = data.action === "APPROVE" ? "APPROVE" : data.action === "REJECT" ? "REJECT" : "UPDATE";

      await recordAdminAudit(tx, {
        adminUserId,
        action: auditAction,
        targetType: "CATALOG",
        targetId: id,
        changesSummary: {
          action: "MODERATION",
          moderationAction: data.action,
          reason: data.reason ?? null,
          before: {
            moderationStatus: existing.moderationStatus,
            status: existing.status,
          },
          after: {
            moderationStatus: updated.moderationStatus,
            status: updated.status,
          },
        },
        ipAddress,
        userAgent,
      });

      return serializeProduct(updated as unknown as Record<string, unknown>);
    });
  }

  public async bulkUpdateStatus(
    data: BulkUpdateProductStatusRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const updateResult = await tx.product.updateMany({
        where: {
          id: { in: data.productIds },
          isDeleted: false,
        },
        data: {
          status: data.status,
          isActive: data.status === "ACTIVE",
        },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: "product-bulk-status",
        changesSummary: {
          action: "BULK_STATUS_UPDATE",
          productIds: data.productIds,
          nextStatus: data.status,
          affectedRows: updateResult.count,
        },
        ipAddress,
        userAgent,
      });

      return {
        affectedCount: updateResult.count,
        status: data.status,
      };
    });
  }
}
