import styles from "./DocsLayout.module.css";

/**
 * Outer shell for the /docs hub. The flex container holds either:
 *   • the hub or a placeholder book page (full-width <main>), or
 *   • the report book (sidebar + <main>, supplied by /docs/report/layout.tsx).
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.docsContainer}>{children}</div>;
}
