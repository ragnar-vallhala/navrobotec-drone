import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Generates /robots.txt — allows crawling everything except API routes,
 * and points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
