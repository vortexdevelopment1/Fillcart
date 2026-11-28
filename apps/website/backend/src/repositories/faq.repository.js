import { faqCategories } from "../data/faqsData.js";

export class FaqRepository {
  findAll({ category, q } = {}) {
    let categories = [...faqCategories];

    if (category) {
      categories = categories.filter(
        (c) => c.id.toLowerCase() === category.toLowerCase()
      );
    }

    if (!q) {
      return categories;
    }

    const query = q.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(query) ||
            item.a.toLowerCase().includes(query)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }
}
