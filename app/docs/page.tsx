import Link from "next/link";
import type { Metadata } from "next";
import { FileText, Download, ArrowRight } from "lucide-react";
import { getBooks } from "@/lib/docs";
import layout from "./DocsLayout.module.css";
import styles from "./DocsPage.module.css";

export const metadata: Metadata = {
  title: "Documentation | NAVRobotec",
  description:
    "Documentation for the Vayu flight control stack — the technical report plus per-layer tutorial guides for NavHAL, VAIOS, and Vayu.",
};

export default function DocsHub() {
  const books = getBooks();

  return (
    <main className={layout.docsContent}>
      <div className={layout.innerContent}>
        <article className={styles.article}>
          <header className={styles.header}>
            <span className={styles.label}>Documentation</span>
            <h1 className={styles.title}>NAVRobotec Docs</h1>
          </header>

          <p className={styles.lead}>
            The full technical report sits alongside per-layer tutorial guides
            for the three platforms in the stack — NavHAL, VAIOS, and Vayu.
            Pick a book to get started.
          </p>

          <nav className={styles.bookGrid}>
            {books.map((b) => {
              const card = (
                <>
                  <span className={styles.bookKicker}>{b.kicker}</span>
                  <h2 className={styles.bookTitle}>{b.title}</h2>
                  <p className={styles.bookDesc}>{b.description}</p>
                  <span className={styles.bookFooter}>
                    {b.comingSoon ? (
                      <span className={styles.soon}>Coming soon</span>
                    ) : (
                      <span className={styles.bookCta}>
                        Open <ArrowRight size={14} />
                      </span>
                    )}
                  </span>
                </>
              );

              if (b.comingSoon) {
                return (
                  <Link
                    key={b.slug}
                    href={b.href}
                    className={`${styles.bookCard} ${styles.bookCardSoon}`}
                  >
                    {card}
                  </Link>
                );
              }
              return (
                <Link
                  key={b.slug}
                  href={b.href}
                  className={styles.bookCard}
                >
                  {card}
                </Link>
              );
            })}
          </nav>

          <div className={styles.grid2}>
            <a
              href="/report_v0.1.1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.pagLink} ${styles.prev}`}
            >
              <span className={styles.pagLabel}>
                <FileText size={16} />
                <span>Full Report</span>
              </span>
              <span className={styles.pagTitle}>
                Vayu Technical Report v0.1.1
              </span>
            </a>
            <a
              href="/summary_report_v0.1.1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.pagLink} ${styles.next}`}
            >
              <span className={styles.pagLabel}>
                <Download size={16} />
                <span>Executive Summary</span>
              </span>
              <span className={styles.pagTitle}>
                Vayu Summary Report v0.1.1
              </span>
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}
