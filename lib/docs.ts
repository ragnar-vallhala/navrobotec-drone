/**
 * Accessors for the generated docs in content/docs/.
 *
 * The tree is produced by scripts/convert-docs.mjs from the LaTeX report.
 * These helpers run server-side only (they read the filesystem).
 */
import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "content/docs");

export interface DocSection {
  slug: string;
  title: string;
  file: string;
}

export interface DocChapter {
  slug: string;
  title: string;
  order: number;
  intro: string;
  sections: DocSection[];
}

/** A single navigable page in linear reading order. */
export interface DocPage {
  kind: "chapter" | "section";
  title: string;
  href: string;
  chapter: DocChapter;
  section?: DocSection;
}

/** All chapters, in reading order. Empty if the docs haven't been generated. */
export function getChapters(): DocChapter[] {
  try {
    const raw = fs.readFileSync(path.join(DOCS_DIR, "index.json"), "utf8");
    return (JSON.parse(raw) as DocChapter[]).sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

/** Read a generated HTML fragment by its index-relative path. */
export function readDocFile(relativePath: string): string {
  try {
    return fs.readFileSync(path.join(DOCS_DIR, relativePath), "utf8").trim();
  } catch {
    return "";
  }
}

/**
 * Every page flattened into linear order: each chapter, followed by its
 * sections. Used to derive previous/next navigation.
 */
export function getFlatPages(): DocPage[] {
  const pages: DocPage[] = [];
  for (const chapter of getChapters()) {
    pages.push({
      kind: "chapter",
      title: chapter.title,
      href: `/docs/${chapter.slug}`,
      chapter,
    });
    for (const section of chapter.sections) {
      pages.push({
        kind: "section",
        title: section.title,
        href: `/docs/${chapter.slug}/${section.slug}`,
        chapter,
        section,
      });
    }
  }
  return pages;
}
