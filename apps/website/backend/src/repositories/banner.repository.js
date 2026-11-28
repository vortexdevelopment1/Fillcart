import { prisma } from "../db/prisma.js";

export class BannerRepository {
  async findActiveBanners(placement = "home_hero") {
    return prisma.banner.findMany({
      where: {
        placement,
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });
  }
}
