import Link from "next/link";
import type { Metadata } from "next";
import { FileText, Download, ArrowRight } from "lucide-react";
import { getChapters, readDocFile } from "@/lib/docs";
import styles from "../DocsPage.module.css";

export const metadata: Metadata = {
  title: "Technical Report | NAVRobotec",
  description:
    "Technical report for the Vayu flight control stack — system architecture, hardware, and the NavHAL and VaiOS platform.",
};

export default function ReportIndex() {
  const chapters = getChapters();

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href="/docs" className={styles.label}>
          ← Documentation
        </Link>
        <h1 className={styles.title}>Vayu Technical Report</h1>
      </header>

      <p className={styles.lead}>
        An end-to-end, hardware-agnostic flight control stack built on the
        NavHAL and VaiOS infrastructure. The chapters below are generated from
        the project&apos;s technical report.
      </p>

      {chapters.length > 0 ? (
        <nav className={styles.chapterList}>
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
                  <span className={styles.soon}>Coming soon</span>
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
          Documentation is being prepared. Please check back soon.
        </p>
      )}

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
          <span className={styles.pagTitle}>Vayu Technical Report v0.1.1</span>
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
          <span className={styles.pagTitle}>Vayu Summary Report v0.1.1</span>
        </a>
      </div>
    </article>
  );
}
