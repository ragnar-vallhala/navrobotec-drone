import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getBook, getChapters } from "@/lib/docs";
import layout from "./DocsLayout.module.css";
import styles from "./DocsPage.module.css";

/**
 * A book whose guide has not been written yet.
 *
 * It does not apologise and stop. The same material exists in reference form
 * in the report, so the page's job is to hand the reader that chapter rather
 * than to tell them to come back later.
 */
export default function BookPlaceholder({ slug }: { slug: string }) {
  const book = getBook(slug);
  if (!book) return null;

  /* The report chapters are keyed by the same slugs as the books, so the
     matching chapter is the one this guide will eventually re-tell. */
  const chapter = getChapters().find((c) => c.slug === slug);

  return (
    <div className={layout.docsContent}>
      <div className={layout.innerContent}>
        <article className={styles.article}>
          <header className={styles.header}>
            <Link href="/docs" className={styles.label}>
              <ArrowLeft size={12} /> Documentation
            </Link>
            <h1 className={styles.title}>{book.title}</h1>
          </header>

          <p className={styles.lead}>{book.description}</p>

          <p className={styles.pending}>
            This guide is being written. Until it lands, the reference material
            it is drawn from is already published.
          </p>

          {chapter && (
            <nav className={styles.chapterList}>
              <Link
                href={`/docs/report/${chapter.slug}`}
                className={styles.chapterItem}
              >
                <span className={styles.chapterNo}>
                  {String(chapter.order).padStart(2, "0")}
                </span>
                <span className={styles.chapterName}>
                  {chapter.title} — in the technical report
                </span>
                {chapter.sections.length > 0 && (
                  <span className={styles.chapterMeta}>
                    {chapter.sections.length} sections
                  </span>
                )}
                <ArrowRight size={16} />
              </Link>
            </nav>
          )}
        </article>
      </div>
    </div>
  );
}
