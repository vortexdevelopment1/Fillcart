import { CategoryRepository } from "../repositories/category.repository.js";
import { serialize } from "../utils/serialize.js";

export class CategoryService {
  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  async getCategories({ featured } = {}) {
    const categories = await this.categoryRepo.findAll({
      isFeatured: featured,
    });
    return categories.map(serialize);
  }
}
