import { SearchService } from "../services/search.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const searchService = new SearchService();

export const searchCatalog = asyncHandler(async (req, res) => {
  const { q, limit } = req.validated.query;
  const result = await searchService.searchAll(q, limit);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const searchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.validated.query;
  const result = await searchService.getSuggestions(q);

  res.status(200).json({
    success: true,
    data: result,
  });
});
