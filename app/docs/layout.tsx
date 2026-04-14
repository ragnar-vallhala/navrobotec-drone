import styles from "./DocsLayout.module.css";
import DocsSidebar from "@/components/DocsSidebar";
import { getDocStructure } from "@/lib/docs-engine";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const structure = getDocStructure();

    return (
        <div className={styles.docsContainer}>
            <DocsSidebar tree={structure} />
            <main className={styles.docsContent}>
                <div className={styles.innerContent}>
                    {children}
                </div>
            </main>
        </div>
    );
}
