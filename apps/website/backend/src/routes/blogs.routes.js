import { Router } from "express";
import { getBlogs, getBlogBySlug } from "../controllers/blog.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  getBlogsQuerySchema,
  getBlogBySlugParamsSchema,
} from "../validators/blog.validator.js";

export const blogsRouter = Router();

// Public blogs endpoints
blogsRouter.get("/", validate(getBlogsQuerySchema), getBlogs);
blogsRouter.get("/:slug", validate(getBlogBySlugParamsSchema), getBlogBySlug);
