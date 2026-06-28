import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import matter from 'gray-matter';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import styles from './blog.module.css';
import sharedStyles from '../../shared.module.css';
import Mermaid from '../../../components/Mermaid';

// Render LaTeX written as $inline$ / $$block$$ in any post via KaTeX (SSR to
// HTML + the imported stylesheet — no client JS needed). Applied once; posts
// without math are unaffected.
marked.use(markedKatex({ throwOnError: false }));

// ```mermaid fences become <pre class="mermaid"> for the client-side Mermaid
// component to render; every other fenced block falls through to the default
// renderer. Escape the source so it survives as text until mermaid reads it.
marked.use({
    renderer: {
        code(token: any) {
            const lang = (token.lang || '').trim().split(/\s+/)[0];
            if (lang === 'mermaid') {
                const escaped = String(token.text)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                return `<pre class="mermaid">${escaped}</pre>\n`;
            }
            return false as any; // defer to marked's built-in code renderer
        },
        // Surface the image title as a visible <figcaption> — the data-heavy
        // posts lean on captions to explain each plot.
        image(token: any) {
            const src = token.href || '';
            const alt = (token.text || '').replace(/"/g, '&quot;');
            const img = `<img src="${src}" alt="${alt}" loading="lazy" />`;
            if (token.title) {
                return `<figure>${img}<figcaption>${token.title}</figcaption></figure>`;
            }
            return img;
        },
    },
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    try {
        const blogsDirectory = path.join(process.cwd(), 'public/blogs');
        const filePath = path.join(blogsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);

        return {
            title: `${data.title} | VAYU Blogs`,
            description: data.excerpt || 'Engineering Journal from NAVRobotec',
        };
    } catch (e) {
        return { title: 'Blog Post' };
    }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blogsDirectory = path.join(process.cwd(), 'public/blogs');
    const filePath = path.join(blogsDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Convert Markdown to HTML
    const htmlContent = await marked(content);

    // Read the cover's real dimensions so the hero renders at its natural
    // aspect ratio (no crop). Falls back to no fixed size if it can't be read.
    let coverDims: { width: number; height: number } | null = null;
    if (data.coverImage) {
        try {
            const coverPath = path.join(process.cwd(), 'public', data.coverImage);
            const meta = await sharp(coverPath).metadata();
            if (meta.width && meta.height) {
                coverDims = { width: meta.width, height: meta.height };
            }
        } catch (e) {
            coverDims = null;
        }
    }

    return (
        <article className={styles.articleWrapper}>
            <div className={styles.bodyContainer}>
                <Link href="/blogs" className={styles.backLink}>
                    <ArrowLeft size={14} /> Back to Journal
                </Link>
                
                <header style={{ marginBottom: '4rem' }}>
                    <span className={styles.kicker}>
                        Engineering Journal
                    </span>
                    <h1 className={styles.title}>{data.title}</h1>
                    <div className={styles.meta}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            By {data.author || 'VAYU Team'}
                        </span>
                        <span>•</span>
                        <span>{data.date}</span>
                    </div>
                </header>

                {data.coverImage && coverDims && (
                    <div className={styles.featuredImage}>
                        <Image
                            src={data.coverImage}
                            alt={data.title}
                            width={coverDims.width}
                            height={coverDims.height}
                            priority
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>
                )}
                
                <div
                    id="blog-markdown"
                    className={styles.markdownContent}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    style={{ marginBottom: '6rem' }}
                />
                <Mermaid container="#blog-markdown" />

                <div 
                    style={{ 
                        marginTop: '6rem', 
                        padding: '5rem 2rem', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: '24px', 
                        textAlign: 'center',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        marginBottom: '4rem'
                    }}
                >
                    <h3 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-serif)' }}>Build the Sovereign Future.</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>
                        We are actively partnering with developers, researchers, and institutions to build out this intelligence layer. Ready to collaborate?
                    </p>
                    <Link href="/contact" className={sharedStyles.ctaBtn}>Join the Mission</Link>
                </div>
            </div>
        </article>
    );
}
