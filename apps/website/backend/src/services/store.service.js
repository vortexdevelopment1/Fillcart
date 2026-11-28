import { StoreRepository } from "../repositories/store.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { formatStore, formatProduct } from "../utils/serialize.js";

export class StoreService {
  constructor() {
    this.storeRepo = new StoreRepository();
    this.productRepo = new ProductRepository();
  }

  async getStores({ q } = {}) {
    const stores = await this.storeRepo.findAll({ q });
    return stores.map(formatStore);
  }

  async getStoreBySlug(slug) {
    const store = await this.storeRepo.findBySlug(slug);
    if (!store) {
      throw new ApiError(404, `Store with slug '${slug}' not found`, "NOT_FOUND");
    }

    const products = await this.storeRepo.findProductsByStoreId(store.id, 24);

    return {
      ...formatStore(store),
      products: products.map(formatProduct),
    };
  }
}
