"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, ChevronRight } from "lucide-react";
import type { DocChapter } from "@/lib/docs";
import styles from "./DocsNav.module.css";

/**
 * Documentation sidebar: a fixed, independently-scrolling panel. Each chapter
 * with sections is a collapsible dropdown — the active chapter is expanded by
 * default, and any chapter can be toggled open/closed.
 */
export default function DocsNav({ chapters }: { chapters: DocChapter[] }) {
  const pathname = usePathname();
  // pathname is /docs, /docs/<chapter> or /docs/<chapter>/<section>
  const segments = pathname.split("/");
  const activeChapter = segments[2];
  const activeSection = segments[3];

  const [open, setOpen] = useState(false); // mobile drawer
  // Per-chapter expand state. Undefined = follow the active chapter.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const close = () => setOpen(false);
  const toggle = (slug: string, fallback: boolean) =>
    setExpanded((e) => ({ ...e, [slug]: !(e[slug] ?? fallback) }));

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle documentation navigation"
      >
        {open ? <X size={16} /> : <List size={16} />}
        {open ? "Close" : "Contents"}
      </button>

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <nav className={styles.nav}>
          <Link
            href="/docs"
            className={`${styles.chapterLink} ${
              !activeChapter ? styles.active : ""
            }`}
            onClick={close}
          >
            Overview
          </Link>

          {chapters.map((c) => {
            const isCurrent = activeChapter === c.slug;
            const hasSections = c.sections.length > 0;
            const isOpen = expanded[c.slug] ?? isCurrent;
            return (
              <div key={c.slug} className={styles.group}>
                <div className={styles.chapterRow}>
                  <Link
                    href={`/docs/${c.slug}`}
                    className={`${styles.chapterLink} ${
                      isCurrent && !activeSection ? styles.active : ""
                    }`}
                    onClick={close}
                  >
                    {c.title}
                  </Link>
                  {hasSections && (
                    <button
                      type="button"
                      className={`${styles.chevron} ${
                        isOpen ? styles.chevronOpen : ""
                      }`}
                      onClick={() => toggle(c.slug, isCurrent)}
                      aria-label={`Toggle ${c.title} sections`}
                      aria-expanded={isOpen}
                    >
                      <ChevronRight size={15} />
                    </button>
                  )}
                </div>
                {hasSections && isOpen && (
                  <div className={styles.sections}>
                    {c.sections.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/docs/${c.slug}/${s.slug}`}
                        className={`${styles.sectionLink} ${
                          isCurrent && activeSection === s.slug
                            ? styles.active
                            : ""
                        }`}
                        onClick={close}
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {open && <div className={styles.backdrop} onClick={close} />}
    </>
  );
}
