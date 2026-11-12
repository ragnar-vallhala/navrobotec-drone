import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getAllBooks, readyChapters } from "@/lib/books";
import { getPart } from "@/lib/parts";
import layout from "./DocsLayout.module.css";
import styles from "./DocsPage.module.css";
import bk from "./Book.module.css";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Documentation for the NAVRobotec stack: NavHAL, VaiOS, Vayu, NavLink, Navigator and nav.",
};

/* The hub.
 *
 * One card per part of the stack. Each part's page says what it lacks as well as
 * what it has.
 */
export default function DocsHub() {
  const books = getAllBooks();

  return (
    <div className={layout.hubContent}>
      <div className="shell">
        <article className={styles.article}>
          <header className={styles.header}>
            <span className={styles.label}>Documentation</span>
            <h1 className={styles.title}>The whole stack, written down.</h1>
          </header>

          <p className={styles.lead}>
            The stack is a set of parts that fit together: NavHAL at the
            hardware, VaiOS above it, Vayu in the air, NavLink between the
            aircraft and the ground, Navigator on the ground, and nav to build
            it all. Each part is its own book, read chapter by chapter.
          </p>

          <h2 className={bk.h2}>One book per part</h2>
          <nav className={styles.bookGrid} aria-label="Books, one per part of the stack">
            {books.map((book) => {
              const part = getPart(book.slug);
              const ready = readyChapters(book).length;
              const count =
                ready === book.chapters.length
                  ? `${ready} chapters`
                  : `${ready} of ${book.chapters.length} chapters`;
              const v = part?.version[0];
              return (
                <Link key={book.slug} href={`/docs/${book.slug}`} className={styles.bookCard}>
                  <span className={styles.bookKicker}>{book.kicker}</span>
                  <h2 className={styles.bookTitle}>{book.title}</h2>
                  <p className={styles.bookDesc}>{book.summary}</p>
                  <span className={bk.cardMeta}>
                    <span>{count}</span>
                    {v && (
                      <span>
                        {v.label}: {v.value}
                      </span>
                    )}
                  </span>
                  <span className={styles.bookFooter}>
                    <span className={styles.bookCta}>
                      Open <ArrowRight size={14} />
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </article>
      </div>
    </div>
  );
}
