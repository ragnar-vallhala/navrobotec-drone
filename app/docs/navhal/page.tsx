import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { getBook, getTutorials } from "@/lib/docs";
import styles from "../DocsPage.module.css";

const BOOK_SLUG = "navhal";

export function generateMetadata(): Metadata {
  const book = getBook(BOOK_SLUG);
  return {
    title: `${book?.title ?? "NavHAL Guide"} | NAVRobotec`,
    description:
      book?.description ??
      "Tutorial-style walkthrough of the NavHAL hardware abstraction layer.",
  };
}

export default function NavhalIndex() {
  const book = getBook(BOOK_SLUG);
  const tutorials = getTutorials(BOOK_SLUG);

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href="/docs" className={styles.label}>
          ← Documentation
        </Link>
        <h1 className={styles.title}>{book?.title ?? "NavHAL Guide"}</h1>
      </header>

      <p className={styles.lead}>{book?.description}</p>

      {tutorials.length > 0 ? (
        <nav className={styles.chapterList}>
          {tutorials.map((t, i) => (
            <Link
              key={t.slug}
              href={`/docs/${BOOK_SLUG}/${t.slug}`}
              className={styles.chapterItem}
            >
              <span className={styles.chapterNo}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.chapterName}>{t.title}</span>
              {t.readingTime && (
                <span className={styles.chapterMeta}>
                  <Clock
                    size={12}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  {t.readingTime}
                </span>
              )}
              <ArrowRight size={16} />
            </Link>
          ))}
        </nav>
      ) : (
        <p className={styles.pending}>
          Tutorials are being written. Please check back soon.
        </p>
      )}
    </article>
  );
}
