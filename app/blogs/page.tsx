import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import styles from './page.module.css';
import sharedStyles from '../shared.module.css';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'VAYU Blogs | NAVRobotec',
    description: 'Insights into sovereign autonomous flight, embedded real-time software, and the future of Indian robotics.',
};

export default async function BlogsPage() {
    const blogsDirectory = path.join(process.cwd(), 'public/blogs');
    let posts: any[] = [];
    
    try {
        const files = fs.readdirSync(blogsDirectory);
        posts = files
            .filter(filename => filename.endsWith('.md'))
            .map(filename => {
                const slug = filename.replace('.md', '');
                const filePath = path.join(blogsDirectory, filename);
                const fileContents = fs.readFileSync(filePath, 'utf8');
                const { data } = matter(fileContents);

                return {
                    slug,
                    frontmatter: data,
                };
            })
            .filter(post => post.frontmatter.title);
            
        posts.sort((a, b) => (new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()));
    } catch (e) {
        posts = [];
    }

    return (
        <div className={sharedStyles.container} style={{ minHeight: '100vh' }}>
            <div className={sharedStyles.standardContainer}>
                <div className={sharedStyles.headerArea}>
                    <h1>Engineering <span className={sharedStyles.gradientText}>Journal.</span></h1>
                    <p>
                        Documenting our architecture, research, and milestones in building autonomous, sovereign intelligence.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div style={{ padding: '4rem 0', opacity: 0.5 }}>
                        <p>Initializing intelligence protocols. No logs available yet.</p>
                    </div>
                ) : (
                    <div className={styles.blogGrid}>
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blogs/${post.slug}`} className={styles.blogCard}>
                                {post.frontmatter.coverImage && (
                                    <div className={styles.blogCardImageWrapper}>
                                        <img 
                                            src={post.frontmatter.coverImage} 
                                            alt={post.frontmatter.title} 
                                            className={styles.blogCardImage}
                                        />
                                        <div className={styles.blogCardOverlay} />
                                    </div>
                                )}
                                
                                <div className={styles.blogCardContent}>
                                    <div className={styles.blogCardMeta}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} />
                                            {post.frontmatter.date}
                                        </span>
                                    </div>

                                    <h3 className={styles.blogCardTitle}>{post.frontmatter.title}</h3>
                                    
                                    <p className={styles.blogCardExcerpt}>
                                        {post.frontmatter.excerpt}
                                    </p>

                                    <div className={styles.blogCardCTA}>
                                        Read Article <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
