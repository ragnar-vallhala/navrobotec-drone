import { getFlattenedDocs, convertToHtml } from "@/lib/docs-engine";
import styles from "../DocsPage.module.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText, Download } from "lucide-react";
import { TikZRenderer } from "@/components/TikZRenderer";

export default async function DynamicDocPage() {
    return <ReportsLanding />;
}

// Inactive legacy logic preserved for future use
/*
export async function generateStaticParams() {
    const structure = getFlattenedDocs();
    return structure.map(s => ({
        slug: s.slug.split('/'),
    }));
}

function DocRenderer({ section, prev, next }: { section: any; prev: any; next: any }) {
    // ... preserved ...
}
*/

function ReportsLanding() {
    return (
        <article className={styles.article}>
            <header className={styles.header}>
                <span className={styles.label}>Technical Documentation</span>
                <h1 className={styles.title}>Project Reports</h1>
            </header>

            <div className={styles.content}>
                <p className={styles.lead}>
                    Access the latest technical reports and summaries for the Vayu drone project. Click to open in a new tab.
                </p>

                <div className={styles.grid2}>
                    <a href="/report_v0.1.1.pdf" target="_blank" rel="noopener noreferrer" className={styles.pagLink}>
                        <div className={styles.pagLabel}>
                            <FileText size={16} />
                            <span>Technical Report</span>
                        </div>
                        <span className={styles.pagTitle}>Vayu Full Report v0.1.1</span>
                    </a>

                    <a href="/summary_report_v0.1.1.pdf" target="_blank" rel="noopener noreferrer" className={styles.pagLink}>
                        <div className={styles.pagLabel}>
                            <Download size={16} />
                            <span>Executive Summary</span>
                        </div>
                        <span className={styles.pagTitle}>Vayu Summary Report v0.1.1</span>
                    </a>
                </div>
            </div>
        </article>
    );
}

