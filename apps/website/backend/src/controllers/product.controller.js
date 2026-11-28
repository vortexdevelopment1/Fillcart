import { ProductService } from "../services/product.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const productService = new ProductService();

export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.validated.query);

  res.json({
    success: true,
    data: result,
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.validated.params.slug);

  res.json({
    success: true,
    data: product,
  });
});
