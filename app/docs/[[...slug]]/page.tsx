import { getFlattenedDocs, convertToHtml } from "@/lib/docs-engine";
import styles from "../DocsPage.module.css";
import { notFound } from "next/navigation";

export default async function DynamicDocPage({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}) {
    const structure = getFlattenedDocs();
    const { slug: slugArray = [] } = await params;
    const currentSlug = slugArray.length > 0 ? slugArray.join('/') : 'introduction';

    // Find the matching section
    const section = structure.find(s => s.slug === currentSlug);

    if (!section) {
        // If not found, check if it's the root /docs
        if (slugArray.length === 0 && structure.length > 0) {
            return <DocRenderer section={structure[0]} />;
        }
        notFound();
    }

    return <DocRenderer section={section} />;
}

function DocRenderer({ section }: { section: any }) {
    let html = convertToHtml(section.content);

    // Replace TikZ placeholders with <img> tags pointing to our API
    html = html.replace(/TIKZ_BLOCK_([A-Za-z0-9-_]+)/g, (match, hash) => {
        return `<img src="/api/docs/render-tikz/${hash}" alt="Technical Diagram" class="tikz-svg" />`;
    });

    return (
        <article className={styles.article}>
            <header className={styles.header}>
                <h1 className={styles.title}>{section.title}</h1>
            </header>

            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: html }}
            />
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
