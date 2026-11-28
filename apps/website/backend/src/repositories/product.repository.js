import { prisma } from "../db/prisma.js";

export class ProductRepository {
  async findBySection(flagKey, limit = 12) {
    return prisma.product.findMany({
      where: {
        [flagKey]: true,
        isActive: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        store: {
          select: { id: true, name: true, slug: true },
        },
      },
      take: limit,
      orderBy: { id: "asc" },
    });
  }

  async findMany({ categorySlug, storeSlug, q, sort = "popular", page = 1, limit = 20 } = {}) {
    const where = { isActive: true };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (storeSlug) {
      where.storeProducts = {
        some: {
          store: { slug: storeSlug },
        },
      };
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
      ];
    }

    let orderBy = [{ isPopular: "desc" }, { id: "asc" }];
    if (sort === "price_asc") {
      orderBy = [{ price: "asc" }, { id: "asc" }];
    } else if (sort === "price_desc") {
      orderBy = [{ price: "desc" }, { id: "asc" }];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          store: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  async findByStoreId(storeId, limit = 24) {
    const storeProducts = await prisma.storeProduct.findMany({
      where: {
        storeId,
        product: { isActive: true },
      },
      include: {
        product: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
            store: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    return storeProducts.map((sp) => sp.product);
  }

  async findBySlug(slug) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        store: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findRelated(categoryId, excludeSlug, limit = 8) {
    if (!categoryId) return [];

    return prisma.product.findMany({
      where: {
        categoryId,
        slug: { not: excludeSlug },
        isActive: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        store: {
          select: { id: true, name: true, slug: true },
        },
      },
      take: limit,
      orderBy: { id: "asc" },
    });
  }
}
