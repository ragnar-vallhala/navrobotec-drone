import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked, type Tokens } from 'marked';
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './blog.module.css';
import Mermaid from '../../../components/Mermaid';
import { getImageMeta } from '../../../lib/imageMeta';

// Render LaTeX written as $inline$ / $$block$$ in any post via KaTeX (SSR to
// HTML + the imported stylesheet — no client JS needed). Applied once; posts
// without math are unaffected.
// nonStandard: render inline $…$ even when flush against punctuation like
// "($I_{xy}=-\int xy$)" — the default requires whitespace boundaries and would
// leave those as literal text. Safe here: posts only use $ for (balanced) math.
marked.use(markedKatex({ throwOnError: false, nonStandard: true }));

// ```mermaid fences become <pre class="mermaid"> for the client-side Mermaid
// component to render; every other fenced block falls through to the default
// renderer. Escape the source so it survives as text until mermaid reads it.
marked.use({
    renderer: {
        code(token: Tokens.Code) {
            const lang = (token.lang || '').trim().split(/\s+/)[0];
            if (lang === 'mermaid') {
                const escaped = String(token.text)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                return `<pre class="mermaid">${escaped}</pre>\n`;
            }
            return false; // defer to marked's built-in code renderer
        },
        // Surface the image title as a visible <figcaption> — the data-heavy
        // posts lean on captions to explain each plot.
        image(token: Tokens.Image) {
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

/* The frontmatter carries "June 24, 2026" — fine to print, useless to a
   machine. This gives <time> something a parser can read, and returns
   undefined rather than a wrong date if it cannot. */
function isoDate(value: string): string | undefined {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    try {
        const blogsDirectory = path.join(process.cwd(), 'public/blogs');
        const filePath = path.join(blogsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);

        return {
            title: `${data.title}`,
            description: data.excerpt || 'Engineering Journal from NAVRobotec',
        };
    } catch {
        return { title: 'Blog post' };
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

    // Read the cover's real dimensions (so the hero renders at its natural
    // aspect ratio, no crop) plus a tiny blur placeholder for progressive load.
    const coverMeta = data.coverImage ? await getImageMeta(data.coverImage) : null;

    return (
        <article className={styles.articleWrapper}>
            <div className={styles.bodyContainer}>
                <Link href="/blogs" className={styles.backLink}>
                    <span aria-hidden>←</span> Engineering journal
                </Link>

                <header className={styles.header}>
                    <h1 className={styles.title}>{data.title}</h1>
                    <p className={styles.meta}>
                        <span>{data.author || 'VAYU Team'}</span>
                        <span aria-hidden className={styles.dot}>·</span>
                        <time dateTime={isoDate(String(data.date ?? ''))}>{data.date}</time>
                    </p>
                </header>

                {data.coverImage && coverMeta && (
                    <div className={styles.featuredImage}>
                        <Image
                            src={data.coverImage}
                            alt={data.title}
                            width={coverMeta.width}
                            height={coverMeta.height}
                            priority
                            placeholder="blur"
                            blurDataURL={coverMeta.blurDataURL}
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>
                )}
                
                <div
                    id="blog-markdown"
                    className={styles.prose}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
                <Mermaid container="#blog-markdown" />

                {/* The end of a post is a place to offer the next thing, not
                    to shout. */}
                <aside className={styles.after}>
                    <p className="label label-signal">Next</p>
                    <h2 className="h3">Build on it.</h2>
                    <p className="body small">
                        We are partnering with developers, researchers and
                        institutions to build out this layer. The stack is open
                        to read first.
                    </p>
                    <div className={styles.afterActions}>
                        <Link href="/docs" className="btn btn-primary">
                            Read the docs
                        </Link>
                        <Link href="/blogs" className="btn btn-ghost">
                            More from the journal
                        </Link>
                    </div>
                </aside>
            </div>
        </article>
    );
}
