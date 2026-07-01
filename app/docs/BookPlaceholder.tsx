import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBook } from "@/lib/docs";
import layout from "./DocsLayout.module.css";
import styles from "./DocsPage.module.css";

/**
 * Generic placeholder for a tutorial book whose content hasn't been written
 * yet. Used by the per-layer book index pages (NavHAL, VaiOS, Vayu).
 */
export default function BookPlaceholder({ slug }: { slug: string }) {
  const book = getBook(slug);
  if (!book) return null;

  return (
    <main className={layout.docsContent}>
      <div className={layout.innerContent}>
        <article className={styles.article}>
          <header className={styles.header}>
            <Link href="/docs" className={styles.label}>
              <ArrowLeft
                size={12}
                style={{ display: "inline", marginRight: 6 }}
              />
              All Books
            </Link>
            <h1 className={styles.title}>{book.title}</h1>
          </header>

          <p className={styles.lead}>{book.description}</p>

          <p className={styles.pending}>
            This guide is being written. In the meantime, the corresponding
            chapter in the{" "}
            <Link
              href={`/docs/report/${book.slug}`}
              style={{ color: "var(--color-accent)" }}
            >
              technical report
            </Link>{" "}
            covers the same material in reference form.
          </p>
        </article>
      </div>
    </main>
  );
}
