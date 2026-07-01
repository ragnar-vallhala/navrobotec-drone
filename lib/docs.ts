/**
 * Accessors for the generated docs in content/docs/.
 *
 * The /docs section is organised as a hub of "books". The technical report
 * (chapters 01-09, generated from LaTeX by scripts/convert-docs.mjs) is one
 * book; per-layer tutorial books for NavHAL, VaiOS, and Vayu sit alongside it
 * and are currently scaffolded as placeholders.
 *
 * These helpers run server-side only (they read the filesystem).
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

/** A top-level "book" surfaced on the /docs hub. */
export interface DocBook {
  slug: string;
  title: string;
  description: string;
  /** Short kicker shown above the title on cards. */
  kicker: string;
  /** Where the book lives. */
  href: string;
  /** Marks tutorial books that don't yet have content. */
  comingSoon: boolean;
}

export const BOOKS: DocBook[] = [
  {
    slug: "report",
    title: "Technical Report",
    description:
      "End-to-end technical report covering system architecture, hardware, NavHAL, VaiOS, and Vayu — generated from the project's LaTeX source.",
    kicker: "Reference",
    href: "/docs/report",
    comingSoon: false,
  },
  {
    slug: "navhal",
    title: "NavHAL Guide",
    description:
      "Tutorial-style walkthrough of the NavHAL hardware abstraction layer — peripheral abstractions, porting, and integration with VaiOS.",
    kicker: "Tutorial",
    href: "/docs/navhal",
    comingSoon: false,
  },
  {
    slug: "vaios",
    title: "VaiOS Guide",
    description:
      "Tutorial-style walkthrough of the VaiOS real-time kernel — task model, scheduler, IPC, and timing.",
    kicker: "Tutorial",
    href: "/docs/vaios",
    comingSoon: true,
  },
  {
    slug: "vayu",
    title: "Vayu Guide",
    description:
      "Tutorial-style walkthrough of the Vayu flight control stack — sensors, estimation, control, telemetry, and extensibility.",
    kicker: "Tutorial",
    href: "/docs/vayu",
    comingSoon: true,
  },
];

export function getBooks(): DocBook[] {
  return BOOKS;
}

export function getBook(slug: string): DocBook | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

/** All chapters in the technical report, in reading order. */
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

/* ------------------------------------------------------------------------- *
 *  Tutorial books (per-layer markdown content)                              *
 * ------------------------------------------------------------------------- */

export interface TutorialMeta {
  slug: string;
  title: string;
  order: number;
  summary?: string;
  kicker?: string;
  /** Estimated reading time, e.g. "10 min". */
  readingTime?: string;
}

export interface Tutorial extends TutorialMeta {
  /** Raw markdown body (without the front-matter block). */
  content: string;
}

/**
 * Read all tutorials for a book. Tutorials live at
 * `content/docs/<bookSlug>/*.md` with YAML front-matter for metadata.
 * Returned in front-matter `order` ascending.
 */
export function getTutorials(bookSlug: string): TutorialMeta[] {
  const dir = path.join(DOCS_DIR, bookSlug);
  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const items: TutorialMeta[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      if (!data.title || !data.slug) continue;
      items.push({
        slug: String(data.slug),
        title: String(data.title),
        order: Number(data.order ?? 0),
        summary: data.summary ? String(data.summary) : undefined,
        kicker: data.kicker ? String(data.kicker) : undefined,
        readingTime: data.readingTime ? String(data.readingTime) : undefined,
      });
    } catch {
      // Skip unreadable files.
    }
  }
  return items.sort((a, b) => a.order - b.order);
}

export function getTutorial(
  bookSlug: string,
  tutorialSlug: string,
): Tutorial | null {
  const dir = path.join(DOCS_DIR, bookSlug);
  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return null;
  }
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      if (!data.title || !data.slug) continue;
      if (String(data.slug) !== tutorialSlug) continue;
      return {
        slug: String(data.slug),
        title: String(data.title),
        order: Number(data.order ?? 0),
        summary: data.summary ? String(data.summary) : undefined,
        kicker: data.kicker ? String(data.kicker) : undefined,
        readingTime: data.readingTime ? String(data.readingTime) : undefined,
        content,
      };
    } catch {
      // Skip unreadable files.
    }
  }
  return null;
}

/**
 * Every report page flattened into linear order: each chapter, followed by
 * its sections. Used to derive previous/next navigation within the report.
 */
export function getFlatPages(): DocPage[] {
  const pages: DocPage[] = [];
  for (const chapter of getChapters()) {
    pages.push({
      kind: "chapter",
      title: chapter.title,
      href: `/docs/report/${chapter.slug}`,
      chapter,
    });
    for (const section of chapter.sections) {
      pages.push({
        kind: "section",
        title: section.title,
        href: `/docs/report/${chapter.slug}/${section.slug}`,
        chapter,
        section,
      });
    }
  }
  return pages;
}
