import { ProductRepository } from "../repositories/product.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { formatProduct } from "../utils/serialize.js";

export class ProductService {
  constructor() {
    this.productRepo = new ProductRepository();
  }

  async getProducts(query = {}) {
    const { items, total } = await this.productRepo.findMany({
      categorySlug: query.category,
      storeSlug: query.store,
      q: query.q,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
    });

    const totalPages = Math.ceil(total / query.limit) || 1;

    return {
      items: items.map(formatProduct),
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    };
  }

  async getProductBySlug(slug) {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) {
      throw new ApiError(404, `Product with slug '${slug}' not found`, "NOT_FOUND");
    }

    const related = await this.productRepo.findRelated(product.categoryId, product.slug, 8);

    return {
      ...formatProduct(product),
      related: related.map(formatProduct),
    };
  }
}
