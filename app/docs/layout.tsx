import styles from "./DocsLayout.module.css";
import DocsNav from "@/components/DocsNav";
import { getChapters } from "@/lib/docs";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = getChapters();

  return (
    <div className={styles.docsContainer}>
      <DocsNav chapters={chapters} />
      <main className={styles.docsContent}>
        <div className={styles.innerContent}>{children}</div>
      </main>
    </div>
  );
}
