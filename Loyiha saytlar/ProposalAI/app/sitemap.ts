import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";

  const staticRoutes = ["", "/pricing", "/blog"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...blogRoutes];
}
