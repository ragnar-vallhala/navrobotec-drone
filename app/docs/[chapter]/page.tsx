import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getChapters, getFlatPages, readDocFile } from "@/lib/docs";
import styles from "../DocsPage.module.css";

export function generateStaticParams() {
  return getChapters().map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter } = await params;
  const found = getChapters().find((c) => c.slug === chapter);
  if (!found) return {};
  return {
    title: `${found.title} | Vayu Docs | NAVRobotec`,
    description: `${found.title} — technical documentation for the Vayu flight control stack.`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const chapters = getChapters();
  const current = chapters.find((c) => c.slug === chapter);
  if (!current) notFound();

  const intro = readDocFile(current.intro);

  const pages = getFlatPages();
  const idx = pages.findIndex((p) => p.href === `/docs/${current.slug}`);
  const prev = idx > 0 ? pages[idx - 1] : undefined;
  const next = idx >= 0 ? pages[idx + 1] : undefined;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href="/docs" className={styles.label}>
          ← Documentation
        </Link>
        <h1 className={styles.title}>{current.title}</h1>
      </header>

      {intro ? (
        <div
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: intro }}
        />
      ) : current.sections.length === 0 ? (
        <p className={styles.pending}>
          This chapter is being written. Please check back soon.
        </p>
      ) : null}

      {current.sections.length > 0 && (
        <nav className={styles.chapterList}>
          {current.sections.map((s, i) => (
            <Link
              key={s.slug}
              href={`/docs/${current.slug}/${s.slug}`}
              className={styles.chapterItem}
            >
              <span className={styles.chapterNo}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.chapterName}>{s.title}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </nav>
      )}

      <footer className={styles.footer}>
        <div className={styles.pagination}>
          {prev ? (
            <Link
              href={prev.href}
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
              href={next.href}
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
