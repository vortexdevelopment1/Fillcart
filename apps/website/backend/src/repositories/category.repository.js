import { prisma } from "../db/prisma.js";

export class CategoryRepository {
  async findAll({ isFeatured, take } = {}) {
    const where = { isActive: true };
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    return prisma.category.findMany({
      where,
      orderBy: { position: "asc" },
      take: take || undefined,
    });
  }

  async findBySlug(slug) {
    return prisma.category.findUnique({
      where: { slug },
    });
  }
}
