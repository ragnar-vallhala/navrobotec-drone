import ReadingBar from "@/components/ReadingBar";
import styles from "./DocsLayout.module.css";

/**
 * Outer shell for the /docs hub. The flex container holds either:
 *   • the hub or an in-preparation guide page (full-width <main>), or
 *   • a book (sidebar + <main>, supplied by the book's own layout).
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReadingBar />
      <div className={styles.docsContainer}>{children}</div>
    </>
  );
}
