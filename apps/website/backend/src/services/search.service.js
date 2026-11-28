import { SearchRepository } from "../repositories/search.repository.js";
import { formatProduct, formatStore, serialize } from "../utils/serialize.js";

export class SearchService {
  constructor() {
    this.searchRepo = new SearchRepository();
  }

  async searchAll(q, limit = 8) {
    const raw = await this.searchRepo.searchAll(q, limit);

    return {
      products: raw.products.map(formatProduct),
      stores: raw.stores.map(formatStore),
      categories: raw.categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        iconName: c.iconName,
        imageUrl: c.imageUrl,
        colorToken: c.colorToken,
      })),
    };
  }

  async getSuggestions(q) {
    return this.searchRepo.searchSuggestions(q, 8);
  }
}
