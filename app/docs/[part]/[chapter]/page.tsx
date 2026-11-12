import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import WaitlistCallout from "@/components/WaitlistCallout";
import {
  BOOK_ORDER,
  getBookBySlug,
  readyChapters,
  renderChapter,
} from "@/lib/books";
import styles from "../../DocsPage.module.css";
import bk from "../../Book.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return BOOK_ORDER.flatMap((part) => {
    const book = getBookBySlug(part);
    return book ? readyChapters(book).map((c) => ({ part, chapter: c.slug })) : [];
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ part: string; chapter: string }>;
}): Promise<Metadata> {
  const { part, chapter } = await params;
  const book = getBookBySlug(part);
  const ch = book?.chapters.find((c) => c.slug === chapter);
  if (!book || !ch) return {};
  return {
    title: `${ch.title} · ${book.title}`,
    description: ch.blurb || `${ch.title}, a chapter of the ${book.title} book.`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ part: string; chapter: string }>;
}) {
  const { part, chapter } = await params;
  const book = getBookBySlug(part);
  const ch = book?.chapters.find((c) => c.slug === chapter && c.status === "ready");
  if (!book || !ch) notFound();

  const ready = readyChapters(book);
  const idx = ready.findIndex((c) => c.slug === ch.slug);
  const prev = idx > 0 ? ready[idx - 1] : undefined;
  const next = idx < ready.length - 1 ? ready[idx + 1] : undefined;
  const html = renderChapter(ch);
  const nextComing = !next && book.chapters.some((c) => c.status === "coming");

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href={`/docs/${book.slug}`} className={styles.label}>
          <ArrowLeft size={12} /> {book.title}
        </Link>
        <p className={bk.kicker}>
          <span>{book.title}</span>
          <span className={bk.dot} aria-hidden="true" />
          <span>
            Chapter {ch.n} of {book.chapters.length}
          </span>
        </p>
        <h1 className={styles.title}>{ch.title}</h1>
      </header>

      <div
        className={`${styles.prose} ${bk.prose}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <WaitlistCallout />

      <footer className={styles.footer}>
        <div className={styles.pagination}>
          {prev ? (
            <Link
              href={`/docs/${book.slug}/${prev.slug}`}
              className={`${styles.pagLink} ${styles.prev}`}
            >
              <span className={styles.pagLabel}>
                <ArrowLeft size={16} />
                <span>Previous, chapter {prev.n}</span>
              </span>
              <span className={styles.pagTitle}>{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/docs/${book.slug}/${next.slug}`}
              className={`${styles.pagLink} ${styles.next}`}
            >
              <span className={styles.pagLabel}>
                <span>Next, chapter {next.n}</span>
                <ArrowRight size={16} />
              </span>
              <span className={styles.pagTitle}>{next.title}</span>
            </Link>
          ) : (
            <Link
              href={`/docs/${book.slug}`}
              className={`${styles.pagLink} ${styles.next}`}
            >
              <span className={styles.pagLabel}>
                <span>{nextComing ? "More chapters coming" : "End of the book"}</span>
                <ArrowRight size={16} />
              </span>
              <span className={styles.pagTitle}>Back to {book.title}</span>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}
