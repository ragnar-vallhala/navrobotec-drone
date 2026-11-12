/**
 * The per-part books under /docs/<part>.
 *
 * Two sources feed them, and neither is rewritten here:
 *   - NavHAL, VaiOS and Vayu are the report's own chapters (content/docs,
 *     generated from the LaTeX), re-homed as standalone books. The report
 *     is not published separately any more.
 *   - NavLink, nav and Navigator are markdown chapters copied from their
 *     repositories into content/docs-books/ by scripts/sync-books.mjs, with
 *     manifest.json recording the repository and ref each file came from.
 *
 * A chapter that does not exist yet is "coming": it has a number and no title,
 * because nothing may be made up. Server-side only (reads the filesystem).
 */
import fs from "fs";
import path from "path";
import { Marked } from "marked";
import { getChapters, readDocFile } from "@/lib/docs";
import { getPart } from "@/lib/parts";
import { detectLang, highlight } from "@/lib/highlight";

const BOOKS_DIR = path.join(process.cwd(), "content/docs-books");

export type BookChapter = {
  n: number;
  slug: string;
  title: string;
  status: "ready" | "coming";
  /** One line taken from the chapter's own opening paragraph. */
  blurb: string;
  /** Where the body comes from (ready chapters only). */
  source?: { kind: "html"; file: string } | { kind: "md"; part: string; file: string };
  /** Repository ref the markdown was taken from. */
  ref?: string;
};

export type Book = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  chapters: BookChapter[];
  /** Repository the book was written from, when it has one. */
  repo?: string;
};

export const BOOK_SLUGS = ["navhal", "vaios", "vayu", "navlink", "nav", "navigator"] as const;
export const BOOK_ORDER: readonly string[] = BOOK_SLUGS;

/* The first sentence of a paragraph, stripped of markup, for the chapter list. */
function firstSentence(text: string): string {
  const plain = text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  let s = "";
  let rest = plain;
  while (rest && s.length < 60) {
    const m = rest.match(/^(.+?[.!?])(\s|$)/);
    const one = m ? m[1] : rest;
    s = s ? `${s} ${one}` : one;
    rest = rest.slice(one.length).trim();
  }
  return s.length > 220 ? `${s.slice(0, 217).replace(/\s+\S*$/, "")}...` : s;
}

function htmlBlurb(html: string): string {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  return m ? firstSentence(m[1]) : "";
}

function mdParts(text: string): { title: string; body: string; blurb: string } {
  const lines = text.split("\n");
  const h1 = lines.findIndex((l) => /^# /.test(l));
  const raw = h1 >= 0 ? lines[h1].slice(2).trim() : "";
  const title = raw.replace(/^Chapter\s+\d+\s*[.:—–-]\s*/, "").trim() || raw;
  const body = lines.slice(h1 + 1).join("\n").replace(/^\n+/, "");
  const para: string[] = [];
  let fenced = false;
  for (const l of body.split("\n")) {
    if (l.trim().startsWith("```")) {
      fenced = !fenced;
      if (para.length) break;
      continue;
    }
    if (fenced) continue;
    if (!l.trim()) {
      if (para.length) break;
      continue;
    }
    if (/^(#|>|\||[-*] |\d+\. )/.test(l.trim())) {
      if (para.length) break;
      continue;
    }
    para.push(l.trim());
  }
  return { title, body, blurb: firstSentence(para.join(" ")) };
}

type Manifest = Record<
  string,
  {
    repo: string;
    total: number;
    chapters: { n: number; status: string; title?: string; file?: string; ref?: string; sha?: string }[];
  }
>;

function readManifest(): Manifest {
  try {
    return JSON.parse(fs.readFileSync(path.join(BOOKS_DIR, "manifest.json"), "utf8"));
  } catch {
    return {};
  }
}

const REPORT_CHAPTER: Record<string, string> = { navhal: "navhal", vaios: "vaios", vayu: "vayu" };

function reportBook(slug: string): BookChapter[] {
  const ch = getChapters().find((c) => c.slug === REPORT_CHAPTER[slug]);
  if (!ch) return [];
  const out: BookChapter[] = [];
  const intro = readDocFile(ch.intro);
  if (intro) {
    out.push({
      n: 1,
      slug: "introduction",
      title: "Introduction",
      status: "ready",
      blurb: htmlBlurb(intro),
      source: { kind: "html", file: ch.intro },
    });
  }
  for (const s of ch.sections) {
    out.push({
      n: out.length + 1,
      slug: s.slug.replace(new RegExp(`^${slug}-`), ""),
      title: s.title,
      status: "ready",
      blurb: htmlBlurb(readDocFile(s.file)),
      source: { kind: "html", file: s.file },
    });
  }
  return out;
}

function markdownBook(slug: string): { chapters: BookChapter[]; repo?: string } {
  const entry = readManifest()[slug];
  if (!entry) return { chapters: [] };
  const chapters = entry.chapters.map((c): BookChapter => {
    if (c.status !== "ready" || !c.file) {
      return { n: c.n, slug: String(c.n).padStart(2, "0"), title: c.title ?? `Chapter ${c.n}`, status: "coming", blurb: "" };
    }
    const text = fs.readFileSync(path.join(BOOKS_DIR, slug, c.file), "utf8");
    const { title, blurb } = mdParts(text);
    return {
      n: c.n,
      slug: c.file.replace(/^\d+-/, "").replace(/\.md$/, ""),
      title,
      status: "ready",
      blurb,
      source: { kind: "md", part: slug, file: c.file },
      ref: c.ref,
    };
  });
  return { chapters, repo: entry.repo };
}

export function getBookBySlug(slug: string): Book | undefined {
  const part = getPart(slug);
  if (!part || !BOOK_ORDER.includes(slug)) return undefined;
  const md = REPORT_CHAPTER[slug] ? { chapters: reportBook(slug), repo: undefined } : markdownBook(slug);
  return {
    slug,
    title: part.title,
    kicker: part.kicker,
    summary: part.summary,
    chapters: md.chapters,
    repo: md.repo,
  };
}

export function getAllBooks(): Book[] {
  return BOOK_ORDER.map((s) => getBookBySlug(s)).filter((b): b is Book => !!b);
}

export function readyChapters(book: Book): BookChapter[] {
  return book.chapters.filter((c) => c.status === "ready");
}

/** Body HTML of one ready chapter. Markdown has its own H1 removed: the page head shows it. */
export function renderChapter(ch: BookChapter): string {
  const src = ch.source;
  if (!src) return "";
  if (src.kind === "html") return wrapTables(readDocFile(src.file));
  const text = fs.readFileSync(path.join(BOOKS_DIR, src.part, src.file), "utf8");
  return renderMarkdown(mdParts(text).body);
}

/* Wide tables scroll inside their own box instead of widening the page. */
function wrapTables(html: string): string {
  return html
    .replace(/<table(\s[^>]*)?>/g, (m) => `<div class="table-wrap">${m}`)
    .replace(/<\/table>/g, "</table></div>");
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderMarkdown(md: string): string {
  const seen = new Map<string, number>();
  const marked = new Marked({
    gfm: true,
    renderer: {
      /* Raw HTML in a chapter is shown as text, never run. */
      html(token) {
        return esc(token.text);
      },
      heading({ tokens, depth }) {
        const plain = tokens.map((t) => ("text" in t ? String(t.text) : t.raw)).join("");
        let id =
          plain
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-") || "section";
        const k = seen.get(id) ?? 0;
        seen.set(id, k + 1);
        if (k) id = `${id}-${k}`;
        const inner = this.parser.parseInline(tokens);
        return `<h${depth} id="${id}">${inner}<a class="anchor" href="#${id}" aria-label="Link to this heading">#</a></h${depth}>\n`;
      },
      code({ text, lang }) {
        const l = (lang ?? "").trim().split(/\s+/)[0] || detectLang(text);
        const cls = l ? ` class="language-${esc(l)}"` : "";
        return `<pre${l ? ` data-lang="${esc(l)}"` : ""} tabindex="0"><code${cls}>${highlight(text, l)}\n</code></pre>\n`;
      },
    },
  });
  return wrapTables(marked.parse(md, { async: false }) as string);
}
