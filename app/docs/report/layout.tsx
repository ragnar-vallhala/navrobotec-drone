import DocsNav from "@/components/DocsNav";
import { getChapters } from "@/lib/docs";
import styles from "../DocsLayout.module.css";

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = getChapters();
  return (
    <>
      <DocsNav chapters={chapters} />
      <main className={styles.docsContent}>
        <div className={styles.innerContent}>{children}</div>
      </main>
    </>
  );
}
