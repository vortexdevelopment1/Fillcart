import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError, BadRequestError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import { recordAdminAudit } from "../../utils/audit-logger.js";
import type {
  GetCategoriesQuery,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ReorderCategoriesRequest,
} from "@fillcart/validations";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconName: string;
  parentCategoryId: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subCategories: CategoryTreeItem[];
}

export class CategoriesService {
  constructor(private prisma: PrismaClient) {}

  public async getTree(query: GetCategoriesQuery): Promise<{ items: CategoryTreeItem[] }> {
    const whereCondition: Record<string, unknown> = {
      isDeleted: false,
      parentCategoryId: null,
    };

    if (!query.includeInactive) {
      whereCondition.isActive = true;
    }

    const subCategoryWhere: Record<string, unknown> = {
      isDeleted: false,
    };
    if (!query.includeInactive) {
      subCategoryWhere.isActive = true;
    }

    const categories = await this.prisma.category.findMany({
      where: whereCondition,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: {
        subCategories: {
          where: subCategoryWhere,
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
          include: {
            subCategories: {
              where: subCategoryWhere,
              orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
            },
          },
        },
      },
    });

    return {
      items: categories as unknown as CategoryTreeItem[],
    };
  }

  public async create(
    data: CreateCategoryRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const slug = data.slug || slugify(data.name);

    // Check slug collision
    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new BadRequestError(`Category with slug '${slug}' already exists`, ERROR_CODES.BAD_REQUEST);
    }

    // Verify parent exists if provided
    if (data.parentCategoryId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: data.parentCategoryId },
      });
      if (!parent || parent.isDeleted) {
        throw new BadRequestError("Parent category not found or is deleted", ERROR_CODES.BAD_REQUEST);
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      const created = await tx.category.create({
        data: {
          name: data.name,
          slug,
          description: data.description ?? null,
          iconName: data.iconName,
          parentCategoryId: data.parentCategoryId ?? null,
          displayOrder: data.displayOrder ?? 0,
          isActive: data.isActive ?? true,
        },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "CREATE",
        targetType: "CATALOG",
        targetId: created.id,
        changesSummary: {
          createdEntity: "Category",
          name: created.name,
          slug: created.slug,
          parentCategoryId: created.parentCategoryId,
        },
        ipAddress,
        userAgent,
      });

      return created;
    });
  }

  public async update(
    id: string,
    data: UpdateCategoryRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }

    if (data.parentCategoryId && data.parentCategoryId === id) {
      throw new BadRequestError("A category cannot be its own parent category", ERROR_CODES.BAD_REQUEST);
    }

    if (data.parentCategoryId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: data.parentCategoryId },
      });
      if (!parent || parent.isDeleted) {
        throw new BadRequestError("Parent category not found or is deleted", ERROR_CODES.BAD_REQUEST);
      }
    }

    const nextSlug = data.slug || (data.name ? slugify(data.name) : undefined);
    if (nextSlug && nextSlug !== existing.slug) {
      const duplicate = await this.prisma.category.findUnique({
        where: { slug: nextSlug },
      });
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestError(`Category with slug '${nextSlug}' already exists`, ERROR_CODES.BAD_REQUEST);
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(nextSlug && { slug: nextSlug }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.iconName && { iconName: data.iconName }),
          ...(data.parentCategoryId !== undefined && { parentCategoryId: data.parentCategoryId }),
          ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: updated.id,
        changesSummary: {
          updatedEntity: "Category",
          before: {
            name: existing.name,
            slug: existing.slug,
            parentCategoryId: existing.parentCategoryId,
            displayOrder: existing.displayOrder,
            isActive: existing.isActive,
          },
          after: {
            name: updated.name,
            slug: updated.slug,
            parentCategoryId: updated.parentCategoryId,
            displayOrder: updated.displayOrder,
            isActive: updated.isActive,
          },
        },
        ipAddress,
        userAgent,
      });

      return updated;
    });
  }

  public async updateStatus(
    id: string,
    isActive: boolean,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id },
        data: { isActive },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: id,
        changesSummary: {
          updatedEntity: "Category",
          action: "STATUS_TOGGLE",
          before: { isActive: existing.isActive },
          after: { isActive: updated.isActive },
        },
        ipAddress,
        userAgent,
      });

      return updated;
    });
  }

  public async reorder(
    data: ReorderCategoriesRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const results = [];
      for (const item of data.items) {
        const updated = await tx.category.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        });
        results.push({ id: updated.id, displayOrder: updated.displayOrder });
      }

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: "category-reorder",
        changesSummary: {
          action: "REORDER_CATEGORIES",
          reorderedCount: data.items.length,
        },
        ipAddress,
        userAgent,
      });

      return { reordered: results };
    });
  }

  public async delete(
    id: string,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      // Soft status change: deactivate category (isActive: false)
      const updated = await tx.category.update({
        where: { id },
        data: { isActive: false },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: id,
        changesSummary: {
          updatedEntity: "Category",
          action: "SOFT_DELETE",
          before: { isActive: existing.isActive },
          after: { isActive: false },
        },
        ipAddress,
        userAgent,
      });

      return {
        id: updated.id,
        name: updated.name,
        isActive: updated.isActive,
        message: "Category deactivated successfully",
      };
    });
  }
}
