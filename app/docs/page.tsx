import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Download, FileText } from "lucide-react";
import { getBooks, getChapters } from "@/lib/docs";
import layout from "./DocsLayout.module.css";
import styles from "./DocsPage.module.css";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Documentation for the VaiOS stack — the Vayu technical report plus per-layer guides for NavHAL, VaiOS, and Vayu.",
};

/* The hub.
 *
 * Four books, but only one of them is written. The layout says so: the report
 * takes the full width and the three guides sit under it as rows, one of them
 * partly written and two marked as coming. A four-up grid of equal cards would
 * have claimed the opposite.
 */
export default function DocsHub() {
  const books = getBooks();
  const report = books.find((b) => b.slug === "report");
  const guides = books.filter((b) => b.slug !== "report");
  const chapters = getChapters();

  return (
    <div className={layout.hubContent}>
      <div className="shell">
        <article className={styles.article}>
          <header className={styles.header}>
            <span className={styles.label}>Documentation</span>
            <h1 className={styles.title}>The VaiOS stack, written down.</h1>
          </header>

          <p className={styles.lead}>
            VaiOS is our sovereign robotics runtime, built from the silicon up.
            The technical report is the reference; the per-layer guides walk
            through the same ground in the order you would learn it — NavHAL at
            the hardware, the VaiOS core above it, Vayu in the air.
          </p>

          {report && (
            <Link href={report.href} className={styles.bookLead}>
              <div className={styles.bookLeadBody}>
                <span className={styles.bookKicker}>{report.kicker}</span>
                <h2 className={styles.bookTitle}>{report.title}</h2>
                <p className={styles.bookDesc}>{report.description}</p>
              </div>
              <span className={styles.bookFooter}>
                <span className={styles.bookCta}>
                  {chapters.length > 0
                    ? `${chapters.length} chapters`
                    : "Open"}{" "}
                  <ArrowRight size={14} />
                </span>
              </span>
            </Link>
          )}

          <nav className={styles.bookGrid} aria-label="Guides">
            {guides.map((b) => {
              const body = (
                <>
                  <span className={styles.bookKicker}>{b.kicker}</span>
                  <h2 className={styles.bookTitle}>{b.title}</h2>
                  <p className={styles.bookDesc}>{b.description}</p>
                  <span className={styles.bookFooter}>
                    {b.comingSoon ? (
                      <span className={styles.soon}>In progress</span>
                    ) : (
                      <span className={styles.bookCta}>
                        Open <ArrowRight size={14} />
                      </span>
                    )}
                  </span>
                </>
              );

              /* A guide with nothing behind it is shown, not linked. Sending a
                 reader to a page that only says "coming soon" wastes the
                 click; the row already told them. */
              return b.comingSoon ? (
                <div
                  key={b.slug}
                  className={`${styles.bookCard} ${styles.bookCardSoon}`}
                >
                  {body}
                </div>
              ) : (
                <Link key={b.slug} href={b.href} className={styles.bookCard}>
                  {body}
                </Link>
              );
            })}
          </nav>

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
                  <span className={styles.downloadMeta}>
                    PDF · v0.1.1 · 5.8 MB
                  </span>
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
                  <span className={styles.downloadTitle}>
                    Executive Summary
                  </span>
                  <span className={styles.downloadMeta}>
                    PDF · v0.1.1 · 236 KB
                  </span>
                </span>
              </a>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
