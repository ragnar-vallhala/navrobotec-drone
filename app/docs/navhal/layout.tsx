import TutorialNav from "@/components/TutorialNav";
import { getBook, getTutorials } from "@/lib/docs";
import styles from "../DocsLayout.module.css";

export default function NavhalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const book = getBook("navhal");
  const tutorials = getTutorials("navhal");
  return (
    <>
      <TutorialNav
        bookSlug="navhal"
        bookTitle={book?.title ?? "NavHAL Guide"}
        tutorials={tutorials}
      />
      <main className={styles.docsContent}>
        <div className={styles.innerContent}>{children}</div>
      </main>
    </>
  );
}
