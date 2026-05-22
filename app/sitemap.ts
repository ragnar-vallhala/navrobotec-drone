import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getBooks, getChapters, getTutorials } from "@/lib/docs";
import { SITE_URL } from "@/lib/site";

/**
 * Generates /sitemap.xml — all crawlable routes: static pages, blog posts,
 * and the generated docs (chapters + sections).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/vision`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/investors`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/blogs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // Blog posts under public/blogs/*.md
  const blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const dir = path.join(process.cwd(), "public/blogs");
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      if (!data.title) continue;
      const date = data.date ? new Date(data.date) : now;
      blogRoutes.push({
        url: `${SITE_URL}/blogs/${file.replace(/\.md$/, "")}`,
        lastModified: Number.isNaN(date.getTime()) ? now : date,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // No blogs directory — skip.
  }

  // Docs: book index pages.
  const docRoutes: MetadataRoute.Sitemap = [];
  for (const book of getBooks()) {
    docRoutes.push({
      url: `${SITE_URL}${book.href}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: book.comingSoon ? 0.5 : 0.8,
    });
    // Tutorial pages under each non-report book.
    if (book.slug !== "report") {
      for (const tutorial of getTutorials(book.slug)) {
        docRoutes.push({
          url: `${SITE_URL}${book.href}/${tutorial.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  // Report book: chapter pages and their section pages.
  for (const chapter of getChapters()) {
    docRoutes.push({
      url: `${SITE_URL}/docs/report/${chapter.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
    for (const section of chapter.sections) {
      docRoutes.push({
        url: `${SITE_URL}/docs/report/${chapter.slug}/${section.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return [...staticRoutes, ...blogRoutes, ...docRoutes];
}
