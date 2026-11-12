"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, ArrowLeft } from "lucide-react";
import styles from "./DocsNav.module.css";
import book from "./BookNav.module.css";

export type BookNavItem = {
  n: number;
  slug: string;
  title: string;
  coming: boolean;
};

/**
 * Sidebar for one part's book: every chapter in order, the current one
 * marked, chapters that do not exist yet shown but not linked. Pathnames look
 * like /docs/<part>/<chapter>.
 */
export default function BookNav({
  slug,
  title,
  items,
}: {
  slug: string;
  title: string;
  items: BookNavItem[];
}) {
  const pathname = usePathname();
  const active = pathname.split("/")[3];
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chapter navigation"
      >
        {open ? <X size={16} /> : <List size={16} />}
        {open ? "Close" : "Chapters"}
      </button>

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <nav className={styles.nav} aria-label={`${title} chapters`}>
          <Link href="/docs" className={styles.backLink} onClick={close}>
            <ArrowLeft size={13} /> All books
          </Link>

          <Link
            href={`/docs/${slug}`}
            className={`${book.bookName} ${!active ? book.bookNameActive : ""}`}
            onClick={close}
          >
            <span className={book.bookKicker}>Book</span>
            {title}
          </Link>

          <ol className={book.list}>
            {items.map((c) => {
              const num = String(c.n).padStart(2, "0");
              if (c.coming) {
                return (
                  <li key={c.slug} className={`${book.item} ${book.soon}`}>
                    <span className={book.num}>{num}</span>
                    <span className={book.name}>{c.title}</span>
                    <span className={book.badge}>Coming</span>
                  </li>
                );
              }
              const isActive = active === c.slug;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/docs/${slug}/${c.slug}`}
                    className={`${book.item} ${isActive ? book.itemActive : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={close}
                  >
                    <span className={book.num}>{num}</span>
                    <span className={book.name}>{c.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      {open && <div className={styles.backdrop} onClick={close} />}
    </>
  );
}
