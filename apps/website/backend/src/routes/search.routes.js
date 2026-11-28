import { Router } from "express";
import { searchCatalog, searchSuggestions } from "../controllers/search.controller.js";
import { validate } from "../middlewares/validate.js";
import { searchQuerySchema, searchSuggestionsQuerySchema } from "../validators/search.validator.js";

export const searchRouter = Router();

searchRouter.get("/suggestions", validate(searchSuggestionsQuerySchema), searchSuggestions);
searchRouter.get("/", validate(searchQuerySchema), searchCatalog);
