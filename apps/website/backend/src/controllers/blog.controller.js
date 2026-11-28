import { BlogService } from "../services/blog.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const blogService = new BlogService();

export const getBlogs = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.validated?.query || {};
  const result = await blogService.getBlogs({ category, page, limit });

  res.json({
    success: true,
    data: result.posts,
    pagination: result.pagination,
  });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.validated.params;
  const post = await blogService.getBlogBySlug(slug);

  res.json({
    success: true,
    data: post,
  });
});
