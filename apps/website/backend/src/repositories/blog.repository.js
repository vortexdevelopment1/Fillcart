import { prisma } from "../db/prisma.js";

export class BlogRepository {
  async findPublishedBlogs({ category, skip = 0, take = 10 } = {}) {
    const where = {
      isPublished: true,
      ...(category && category !== "All" ? { category } : {}),
    };

    return prisma.blogPost.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImageUrl: true,
        category: true,
        authorName: true,
        authorRole: true,
        readTimeMinutes: true,
        tags: true,
        isFeatured: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take,
    });
  }

  async countPublishedBlogs({ category } = {}) {
    const where = {
      isPublished: true,
      ...(category && category !== "All" ? { category } : {}),
    };

    return prisma.blogPost.count({ where });
  }

  async findPublishedBlogBySlug(slug) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.isPublished) {
      return null;
    }

    return post;
  }
}
