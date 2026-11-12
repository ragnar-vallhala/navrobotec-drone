import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getBooks, getChapters } from "@/lib/docs";
import { PARTS } from "@/lib/parts";
import layout from "./DocsLayout.module.css";
import styles from "./DocsPage.module.css";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Documentation for the NAVRobotec stack: NavHAL, VaiOS, Vayu, NavLink, Navigator and nav, with the technical report as the reference.",
};

/* The hub.
 *
 * One card per part of the stack, and the technical report above them as the
 * reference. Each part's page says what it lacks as well as what it has.
 */
export default function DocsHub() {
  const books = getBooks();
  const report = books.find((b) => b.slug === "report");
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
            The stack is a set of parts that fit together: NavHAL at the
            hardware, VaiOS above it, Vayu in the air, NavLink between the
            aircraft and the ground, Navigator on the ground, and nav to build
            it all. Each part has its own page. The technical report is the
            reference for the design as a whole.
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

          <nav className={styles.bookGrid} aria-label="Parts of the stack">
            {PARTS.map((part) => (
              <Link key={part.slug} href={part.href} className={styles.bookCard}>
                <span className={styles.bookKicker}>{part.kicker}</span>
                <h2 className={styles.bookTitle}>{part.title}</h2>
                <p className={styles.bookDesc}>{part.summary}</p>
                <span className={styles.bookFooter}>
                  <span className={styles.bookCta}>
                    Open <ArrowRight size={14} />
                  </span>
                </span>
              </Link>
            ))}
          </nav>
        </article>
      </div>
    </div>
  );
}
