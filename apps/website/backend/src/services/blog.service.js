import { BlogRepository } from "../repositories/blog.repository.js";
import { ApiError } from "../utils/ApiError.js";

export class BlogService {
  constructor() {
    this.blogRepo = new BlogRepository();
  }

  async getBlogs({ category, page = 1, limit = 10 } = {}) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const [posts, total] = await Promise.all([
      this.blogRepo.findPublishedBlogs({ category, skip, take: safeLimit }),
      this.blogRepo.countPublishedBlogs({ category }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      posts,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
      },
    };
  }

  async getBlogBySlug(slug) {
    const post = await this.blogRepo.findPublishedBlogBySlug(slug);

    if (!post) {
      throw new ApiError(404, "Blog post not found", "BLOG_NOT_FOUND");
    }

    return post;
  }
}
