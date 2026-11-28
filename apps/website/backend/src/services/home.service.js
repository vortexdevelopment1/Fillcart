import { BannerRepository } from "../repositories/banner.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { serialize, formatProduct } from "../utils/serialize.js";

export class HomeService {
  constructor() {
    this.bannerRepo = new BannerRepository();
    this.categoryRepo = new CategoryRepository();
    this.productRepo = new ProductRepository();
  }

  async getHomeData() {
    const [
      banners,
      featuredCategories,
      popularProducts,
      frozenProducts,
      dailyCareProducts,
      homeEssentialProducts,
    ] = await Promise.all([
      this.bannerRepo.findActiveBanners("home_hero"),
      this.categoryRepo.findAll({ isFeatured: true, take: 12 }),
      this.productRepo.findBySection("isPopular", 12),
      this.productRepo.findBySection("isFrozen", 12),
      this.productRepo.findBySection("isDailyCare", 12),
      this.productRepo.findBySection("isHomeEssential", 12),
    ]);

    // If fewer than 12 featured categories exist, fallback to top active categories by position
    let categories = featuredCategories;
    if (categories.length < 12) {
      categories = await this.categoryRepo.findAll({ take: 12 });
    }

    return {
      banners: banners.map(serialize),
      categories: categories.map(serialize),
      sections: [
        {
          id: "popular",
          title: "Popular right now",
          products: popularProducts.map(formatProduct),
        },
        {
          id: "chill-frozen",
          title: "Chill Zone",
          products: frozenProducts.map(formatProduct),
        },
        {
          id: "daily-care",
          title: "Daily care",
          products: dailyCareProducts.map(formatProduct),
        },
        {
          id: "home-essentials",
          title: "Home essentials",
          products: homeEssentialProducts.map(formatProduct),
        },
      ],
    };
  }
}
