import { getFlattenedDocs, convertToHtml } from "@/lib/docs-engine";
import styles from "../DocsPage.module.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TikZRenderer } from "@/components/TikZRenderer";

export default async function DynamicDocPage({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}) {
    const structure = getFlattenedDocs();
    const { slug: slugArray = [] } = await params;
    const currentSlug = slugArray.length > 0 ? slugArray.join('/') : 'introduction';

    // Find the matching section
    const sectionIndex = structure.findIndex(s => s.slug === currentSlug);
    const section = structure[sectionIndex];

    if (!section) {
        // If not found, check if it's the root /docs
        if (slugArray.length === 0 && structure.length > 0) {
            return <DocRenderer section={structure[0]} prev={null} next={structure[1] || null} />;
        }
        notFound();
    }

    const prev = sectionIndex > 0 ? structure[sectionIndex - 1] : null;
    const next = sectionIndex < structure.length - 1 ? structure[sectionIndex + 1] : null;

    return <DocRenderer section={section} prev={prev} next={next} />;
}

function DocRenderer({ section, prev, next }: { section: any; prev: any; next: any }) {
    let html = convertToHtml(section.content);

    // Replace TikZ placeholders with <img> tags pointing to our API
    html = html.replace(/TIKZ_BLOCK_([A-Za-z0-9-_]+)/g, (match, hash) => {
        return `<img src="/api/docs/render-tikz/${hash}" alt="Technical Diagram" class="tikz-svg" />`;
    });

    // Split by the parsed tikz container
    // Our parser generates: <div class="tikz-parsed-container" data-diagram='...'></div>
    const parts = html.split(/<div class="tikz-parsed-container" data-diagram='([\s\S]*?)'><\/div>/g);

    return (
        <article className={styles.article}>
            <header className={styles.header}>
                <h1 className={styles.title}>{section.title}</h1>
            </header>

            <div className={styles.content}>
                {parts.map((part, index) => {
                    if (index % 2 === 0) {
                        return (
                            <div
                                key={`part-${index}`}
                                dangerouslySetInnerHTML={{ __html: part }}
                            />
                        );
                    } else {
                        try {
                            const diagramData = JSON.parse(part.replace(/&apos;/g, "'"));
                            return <TikZRenderer key={`tikz-${index}`} diagram={diagramData} />;
                        } catch (e) {
                            console.error("Failed to parse diagram data:", e);
                            return <pre key={`err-${index}`}>[Error rendering diagram]</pre>;
                        }
                    }
                })}
            </div>

            <footer className={styles.footer}>
                <div className={styles.pagination}>
                    {prev ? (
                        <Link href={prev.slug === 'introduction' ? '/docs' : `/docs/${prev.slug}`} className={`${styles.pagLink} ${styles.prev}`}>
                            <span className={styles.pagLabel}><ChevronLeft size={16} /> Previous</span>
                            <span className={styles.pagTitle}>{prev.title}</span>
                        </Link>
                    ) : <div />}

                    {next ? (
                        <Link href={`/docs/${next.slug}`} className={`${styles.pagLink} ${styles.next}`}>
                            <span className={styles.pagLabel}>Next <ChevronRight size={16} /></span>
                            <span className={styles.pagTitle}>{next.title}</span>
                        </Link>
                    ) : <div />}
                </div>
            </footer>
        </article>
    );
}

// Optional: static params for faster loads
export async function generateStaticParams() {
    const structure = getFlattenedDocs();
    return structure.map(s => ({
        slug: s.slug.split('/'),
    }));
}

