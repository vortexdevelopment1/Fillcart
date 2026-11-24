import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError, BadRequestError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import { recordAdminAudit } from "../../utils/audit-logger.js";
import type {
  GetInventoryQuery,
  AdjustInventoryRequest,
} from "@fillcart/validations";

export class InventoryService {
  constructor(private prisma: PrismaClient) {}

  public async getInventory(query: GetInventoryQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (query.storeId) {
      where.storeId = query.storeId;
    }

    if (query.variantId) {
      where.variantId = query.variantId;
    }

    if (query.productId) {
      where.variant = {
        productId: query.productId,
      };
    }

    const [balances, total] = await Promise.all([
      this.prisma.inventoryBalance.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ storeId: "asc" }, { updatedAt: "desc" }],
        include: {
          store: {
            select: { id: true, storeName: true, storeCode: true, city: true },
          },
          variant: {
            select: {
              id: true,
              sku: true,
              barcode: true,
              variantName: true,
              unitQuantity: true,
              unitType: true,
              product: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      }),
      this.prisma.inventoryBalance.count({ where }),
    ]);

    let filteredBalances = balances;
    if (query.lowStock) {
      filteredBalances = balances.filter((b) => b.quantityOnHand <= b.reorderThreshold);
    }

    const items = filteredBalances.map((b) => ({
      id: b.id,
      storeId: b.storeId,
      storeName: b.store.storeName,
      storeCode: b.store.storeCode,
      city: b.store.city,
      variantId: b.variantId,
      sku: b.variant.sku,
      variantName: b.variant.variantName,
      productName: b.variant.product.name,
      productId: b.variant.product.id,
      quantityOnHand: b.quantityOnHand,
      reservedQuantity: b.reservedQuantity,
      availableQuantity: Math.max(0, b.quantityOnHand - b.reservedQuantity),
      reorderThreshold: b.reorderThreshold,
      isLowStock: b.quantityOnHand <= b.reorderThreshold,
      lastRestockedAt: b.lastRestockedAt,
      updatedAt: b.updatedAt,
    }));

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

  public async adjustInventory(
    data: AdjustInventoryRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const store = await this.prisma.store.findUnique({
      where: { id: data.storeId },
    });
    if (!store || store.isDeleted) {
      throw new NotFoundError(`Store with ID '${data.storeId}' not found`);
    }

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: data.variantId },
    });
    if (!variant || variant.isDeleted) {
      throw new NotFoundError(`Product variant with ID '${data.variantId}' not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const existing = await tx.inventoryBalance.findUnique({
        where: {
          storeId_variantId: {
            storeId: data.storeId,
            variantId: data.variantId,
          },
        },
      });

      const currentQty = existing ? existing.quantityOnHand : 0;
      const nextQty = currentQty + data.adjustmentQuantity;

      if (nextQty < 0) {
        throw new BadRequestError(
          `Adjustment of ${data.adjustmentQuantity} would reduce inventory below zero (current stock: ${currentQty})`,
          ERROR_CODES.BAD_REQUEST
        );
      }

      const updated = await tx.inventoryBalance.upsert({
        where: {
          storeId_variantId: {
            storeId: data.storeId,
            variantId: data.variantId,
          },
        },
        create: {
          storeId: data.storeId,
          variantId: data.variantId,
          quantityOnHand: nextQty,
          lastRestockedAt: data.adjustmentQuantity > 0 ? new Date() : null,
        },
        update: {
          quantityOnHand: nextQty,
          ...(data.adjustmentQuantity > 0 && { lastRestockedAt: new Date() }),
        },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: data.variantId,
        changesSummary: {
          action: "INVENTORY_ADJUSTMENT",
          storeId: data.storeId,
          variantId: data.variantId,
          adjustmentQuantity: data.adjustmentQuantity,
          reason: data.reason,
          beforeOnHand: currentQty,
          afterOnHand: nextQty,
        },
        ipAddress,
        userAgent,
      });

      return {
        id: updated.id,
        storeId: updated.storeId,
        variantId: updated.variantId,
        quantityOnHand: updated.quantityOnHand,
        reservedQuantity: updated.reservedQuantity,
        lastRestockedAt: updated.lastRestockedAt,
        updatedAt: updated.updatedAt,
      };
    });
  }
}
