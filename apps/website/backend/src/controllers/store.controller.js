import { StoreService } from "../services/store.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const storeService = new StoreService();

export const getStores = asyncHandler(async (req, res) => {
  const stores = await storeService.getStores({
    q: req.validated?.query?.q,
  });

  res.json({
    success: true,
    data: stores,
  });
});

export const getStoreBySlug = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreBySlug(req.validated.params.slug);

  res.json({
    success: true,
    data: store,
  });
});
