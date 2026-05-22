"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, ArrowLeft } from "lucide-react";
import type { TutorialMeta } from "@/lib/docs";
import styles from "./DocsNav.module.css";

/**
 * Sidebar for tutorial books (e.g. /docs/navhal). Flat list of tutorials —
 * no nested sections.
 */
export default function TutorialNav({
  bookSlug,
  bookTitle,
  tutorials,
}: {
  bookSlug: string;
  bookTitle: string;
  tutorials: TutorialMeta[];
}) {
  const pathname = usePathname();
  // /docs/<bookSlug>/<tutorialSlug>
  const segments = pathname.split("/");
  const activeTutorial = segments[3];

  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle tutorial navigation"
      >
        {open ? <X size={16} /> : <List size={16} />}
        {open ? "Close" : "Contents"}
      </button>

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <nav className={styles.nav}>
          <Link href="/docs" className={styles.backLink} onClick={close}>
            <ArrowLeft size={13} /> All books
          </Link>

          <Link
            href={`/docs/${bookSlug}`}
            className={`${styles.chapterLink} ${
              !activeTutorial ? styles.active : ""
            }`}
            onClick={close}
          >
            {bookTitle}
          </Link>

          {tutorials.map((t) => (
            <Link
              key={t.slug}
              href={`/docs/${bookSlug}/${t.slug}`}
              className={`${styles.chapterLink} ${
                activeTutorial === t.slug ? styles.active : ""
              }`}
              onClick={close}
            >
              {t.title}
            </Link>
          ))}
        </nav>
      </aside>

      {open && <div className={styles.backdrop} onClick={close} />}
    </>
  );
}
