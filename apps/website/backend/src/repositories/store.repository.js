import { prisma } from "../db/prisma.js";

export class StoreRepository {
  async findAll({ q } = {}) {
    const where = { isActive: true };
    if (q) {
      where.name = { contains: q, mode: "insensitive" };
    }

    return prisma.store.findMany({
      where,
      orderBy: { name: "asc" },
    });
  }

  async findBySlug(slug) {
    return prisma.store.findUnique({
      where: { slug },
    });
  }

  async findProductsByStoreId(storeId, limit = 24) {
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
}
