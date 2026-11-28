import { prisma } from "../db/prisma.js";

export class OfferRepository {
  async findAll({ type } = {}) {
    const where = { isActive: true };
    if (type) {
      where.type = type;
    }

    return prisma.offer.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }
}
