import { CategoryService } from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const categoryService = new CategoryService();

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories({
    featured: req.validated?.query?.featured,
  });

  res.json({
    success: true,
    data: categories,
  });
});
