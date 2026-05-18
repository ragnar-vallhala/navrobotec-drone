import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getChapters, getFlatPages, readDocFile } from "@/lib/docs";
import styles from "../../DocsPage.module.css";

export function generateStaticParams() {
  return getChapters().flatMap((c) =>
    c.sections.map((s) => ({ chapter: c.slug, section: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string; section: string }>;
}): Promise<Metadata> {
  const { chapter, section } = await params;
  const ch = getChapters().find((c) => c.slug === chapter);
  const sec = ch?.sections.find((s) => s.slug === section);
  if (!ch || !sec) return {};
  return {
    title: `${sec.title} — ${ch.title} | Vayu Docs | NAVRobotec`,
    description: `${sec.title}, part of ${ch.title} — technical documentation for the Vayu flight control stack.`,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ chapter: string; section: string }>;
}) {
  const { chapter, section } = await params;
  const chapters = getChapters();
  const current = chapters.find((c) => c.slug === chapter);
  const sec = current?.sections.find((s) => s.slug === section);
  if (!current || !sec) notFound();

  const html = readDocFile(sec.file);

  const pages = getFlatPages();
  const idx = pages.findIndex(
    (p) => p.href === `/docs/${current.slug}/${sec.slug}`,
  );
  const prev = idx > 0 ? pages[idx - 1] : undefined;
  const next = idx >= 0 ? pages[idx + 1] : undefined;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href={`/docs/${current.slug}`} className={styles.label}>
          ← {current.title}
        </Link>
        <h1 className={styles.title}>{sec.title}</h1>
      </header>

      {html ? (
        <div
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className={styles.pending}>
          This section is being written. Please check back soon.
        </p>
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
