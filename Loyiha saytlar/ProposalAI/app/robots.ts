import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/blog"],
      disallow: ["/dashboard", "/proposals", "/billing", "/admin", "/sign-in", "/sign-up"]
    },
    sitemap: "/sitemap.xml"
  };
}
