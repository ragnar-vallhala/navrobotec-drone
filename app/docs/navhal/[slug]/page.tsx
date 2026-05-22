import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getBook, getTutorial, getTutorials } from "@/lib/docs";
import styles from "../../DocsPage.module.css";

const BOOK_SLUG = "navhal";

export function generateStaticParams() {
  return getTutorials(BOOK_SLUG).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getTutorial(BOOK_SLUG, slug);
  const book = getBook(BOOK_SLUG);
  if (!tutorial) return {};
  return {
    title: `${tutorial.title} — ${book?.title ?? "NavHAL Guide"} | NAVRobotec`,
    description:
      tutorial.summary ??
      `${tutorial.title}, a NavHAL tutorial from NAVRobotec.`,
  };
}

export default async function NavhalTutorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tutorial = getTutorial(BOOK_SLUG, slug);
  if (!tutorial) notFound();

  const html = await marked.parse(tutorial.content);

  // Linear nav across the book's tutorials.
  const tutorials = getTutorials(BOOK_SLUG);
  const idx = tutorials.findIndex((t) => t.slug === slug);
  const prev = idx > 0 ? tutorials[idx - 1] : undefined;
  const next =
    idx >= 0 && idx < tutorials.length - 1 ? tutorials[idx + 1] : undefined;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href={`/docs/${BOOK_SLUG}`} className={styles.label}>
          ← NavHAL Guide
        </Link>
        <h1 className={styles.title}>{tutorial.title}</h1>
        {(tutorial.kicker || tutorial.readingTime) && (
          <div className={styles.tutorialMeta}>
            {tutorial.kicker && <span>{tutorial.kicker}</span>}
            {tutorial.readingTime && (
              <span className={styles.tutorialMetaItem}>
                <Clock size={13} /> {tutorial.readingTime}
              </span>
            )}
          </div>
        )}
      </header>

      <div
        className={styles.prose}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <footer className={styles.footer}>
        <div className={styles.pagination}>
          {prev ? (
            <Link
              href={`/docs/${BOOK_SLUG}/${prev.slug}`}
              className={`${styles.pagLink} ${styles.prev}`}
            >
              <span className={styles.pagLabel}>
                <ArrowLeft size={16} />
                <span>Previous</span>
              </span>
              <span className={styles.pagTitle}>{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/docs/${BOOK_SLUG}/${next.slug}`}
              className={`${styles.pagLink} ${styles.next}`}
            >
              <span className={styles.pagLabel}>
                <span>Next</span>
                <ArrowRight size={16} />
              </span>
              <span className={styles.pagTitle}>{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </footer>
    </article>
  );
}
