import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError, BadRequestError } from "../../../../errors/app-error.js";
import { ERROR_CODES } from "../../../../constants/error-codes.js";
import { recordAdminAudit } from "../../utils/audit-logger.js";
import type {
  GetBrandsQuery,
  CreateBrandRequest,
  UpdateBrandRequest,
} from "@fillcart/validations";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class BrandsService {
  constructor(private prisma: PrismaClient) {}

  public async list(query: GetBrandsQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      isDeleted: false,
    };

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.search) {
      const s = query.search.trim().toLowerCase();
      where.OR = [
        { name: { contains: s, mode: "insensitive" } },
        { slug: { contains: s } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      this.prisma.brand.count({ where }),
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

  public async create(
    data: CreateBrandRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const slug = data.slug || slugify(data.name);

    const existing = await this.prisma.brand.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
      },
    });
    if (existing) {
      throw new BadRequestError("Brand with this name or slug already exists", ERROR_CODES.BAD_REQUEST);
    }

    return await this.prisma.$transaction(async (tx) => {
      const created = await tx.brand.create({
        data: {
          name: data.name,
          slug,
          logoUrl: data.logoUrl ?? null,
          isActive: data.isActive ?? true,
        },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "CREATE",
        targetType: "CATALOG",
        targetId: created.id,
        changesSummary: {
          createdEntity: "Brand",
          name: created.name,
          slug: created.slug,
        },
        ipAddress,
        userAgent,
      });

      return created;
    });
  }

  public async update(
    id: string,
    data: UpdateBrandRequest,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existing = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`Brand with ID '${id}' not found`);
    }

    const nextSlug = data.slug || (data.name ? slugify(data.name) : undefined);
    if (nextSlug && nextSlug !== existing.slug) {
      const duplicate = await this.prisma.brand.findUnique({
        where: { slug: nextSlug },
      });
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestError(`Brand with slug '${nextSlug}' already exists`, ERROR_CODES.BAD_REQUEST);
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.brand.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(nextSlug && { slug: nextSlug }),
          ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: updated.id,
        changesSummary: {
          updatedEntity: "Brand",
          before: {
            name: existing.name,
            slug: existing.slug,
            logoUrl: existing.logoUrl,
            isActive: existing.isActive,
          },
          after: {
            name: updated.name,
            slug: updated.slug,
            logoUrl: updated.logoUrl,
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
    const existing = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`Brand with ID '${id}' not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.brand.update({
        where: { id },
        data: { isActive },
      });

      await recordAdminAudit(tx, {
        adminUserId,
        action: "UPDATE",
        targetType: "CATALOG",
        targetId: id,
        changesSummary: {
          updatedEntity: "Brand",
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
}
