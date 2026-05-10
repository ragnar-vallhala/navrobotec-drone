import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import styles from './blog.module.css';
import sharedStyles from '../../shared.module.css';

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

                {data.coverImage && (
                    <img 
                        src={data.coverImage} 
                        alt={data.title} 
                        className={styles.featuredImage} 
                    />
                )}
                
                <div 
                    className={styles.markdownContent}
                    dangerouslySetInnerHTML={{ __html: htmlContent }} 
                    style={{ marginBottom: '6rem' }}
                />

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
