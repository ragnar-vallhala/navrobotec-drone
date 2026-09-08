import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Download, FileText } from "lucide-react";
import { getChapters, readDocFile } from "@/lib/docs";
import styles from "../DocsPage.module.css";

export const metadata: Metadata = {
  title: "Vayu Technical Report",
  description:
    "Technical report for the Vayu flight control stack — system architecture, hardware, and the NavHAL and VaiOS platform.",
};

export default function ReportIndex() {
  const chapters = getChapters();

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href="/docs" className={styles.label}>
          <ArrowLeft size={12} /> Documentation
        </Link>
        <h1 className={styles.title}>Vayu Technical Report</h1>
      </header>

      <p className={styles.lead}>
        An end-to-end, hardware-agnostic flight control stack built on the
        NavHAL and VaiOS infrastructure. The chapters below are generated from
        the project&apos;s LaTeX source, so they track the report itself rather
        than a hand-copied version of it.
      </p>

      {chapters.length > 0 ? (
        <nav className={styles.chapterList} aria-label="Chapters">
          {chapters.map((c) => {
            const empty =
              c.sections.length === 0 && readDocFile(c.intro).length === 0;
            const num = String(c.order).padStart(2, "0");
            const meta =
              c.sections.length > 0
                ? `${c.sections.length} section${c.sections.length === 1 ? "" : "s"}`
                : null;
            if (empty) {
              return (
                <div
                  key={c.slug}
                  className={`${styles.chapterItem} ${styles.chapterDisabled}`}
                >
                  <span className={styles.chapterNo}>{num}</span>
                  <span className={styles.chapterName}>{c.title}</span>
                  <span className={styles.soon}>In progress</span>
                </div>
              );
            }
            return (
              <Link
                key={c.slug}
                href={`/docs/report/${c.slug}`}
                className={styles.chapterItem}
              >
                <span className={styles.chapterNo}>{num}</span>
                <span className={styles.chapterName}>{c.title}</span>
                {meta && <span className={styles.chapterMeta}>{meta}</span>}
                <ArrowRight size={16} />
              </Link>
            );
          })}
        </nav>
      ) : (
        <p className={styles.pending}>
          The report is being prepared. Please check back soon.
        </p>
      )}

      <section className={styles.downloads}>
        <span className={`label ${styles.downloadsLabel}`}>
          Or take it with you
        </span>
        <div className={styles.downloadGrid}>
          <a
            href="/report_v0.1.1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.download}
          >
            <FileText size={20} className={styles.downloadIcon} />
            <span className={styles.downloadText}>
              <span className={styles.downloadTitle}>
                Vayu Technical Report
              </span>
              <span className={styles.downloadMeta}>PDF · v0.1.1 · 5.8 MB</span>
            </span>
          </a>
          <a
            href="/summary_report_v0.1.1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.download}
          >
            <Download size={20} className={styles.downloadIcon} />
            <span className={styles.downloadText}>
              <span className={styles.downloadTitle}>Executive Summary</span>
              <span className={styles.downloadMeta}>PDF · v0.1.1 · 236 KB</span>
            </span>
          </a>
        </div>
      </section>
    </article>
  );
}
