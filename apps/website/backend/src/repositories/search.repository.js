import { prisma } from "../db/prisma.js";

export class SearchRepository {
  async searchAll(q, limit = 8) {
    const [products, stores, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { brand: { contains: q, mode: "insensitive" } },
          ],
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
        orderBy: [{ isPopular: "desc" }, { name: "asc" }],
      }),
      prisma.store.findMany({
        where: {
          isActive: true,
          name: { contains: q, mode: "insensitive" },
        },
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: q, mode: "insensitive" },
        },
        take: limit,
        orderBy: { position: "asc" },
      }),
    ]);

    return { products, stores, categories };
  }

  async searchSuggestions(q, maxTotal = 8) {
    const [products, stores, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { brand: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { name: true, slug: true },
        take: maxTotal,
        orderBy: [{ isPopular: "desc" }, { name: "asc" }],
      }),
      prisma.store.findMany({
        where: {
          isActive: true,
          name: { contains: q, mode: "insensitive" },
        },
        select: { name: true, slug: true },
        take: 3,
        orderBy: { name: "asc" },
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: q, mode: "insensitive" },
        },
        select: { name: true, slug: true },
        take: 3,
        orderBy: { position: "asc" },
      }),
    ]);

    const suggestions = [];

    for (const p of products) {
      if (suggestions.length >= maxTotal) break;
      suggestions.push({
        name: p.name,
        type: "product",
        slug: p.slug,
      });
    }

    for (const s of stores) {
      if (suggestions.length >= maxTotal) break;
      suggestions.push({
        name: s.name,
        type: "store",
        slug: s.slug,
      });
    }

    for (const c of categories) {
      if (suggestions.length >= maxTotal) break;
      suggestions.push({
        name: c.name,
        type: "category",
        slug: c.slug,
      });
    }

    return suggestions.slice(0, maxTotal);
  }
}
