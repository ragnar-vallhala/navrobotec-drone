import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getImageMeta } from "../../lib/imageMeta";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Engineering journal",
  description:
    "Field reports from building a sovereign flight stack: real-time scheduling, control loops, transport bugs, and the benchmarks behind them.",
};

/* A typed shape instead of `any[]`. The frontmatter is ours, written by us,
   in files in this repo — there is no reason for the compiler not to know it. */
type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  blurDataURL?: string;
};

async function getPosts(): Promise<Post[]> {
  const dir = path.join(process.cwd(), "public/blogs");
  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    /* No posts directory is a legitimate state — an empty journal, not a
       broken page. */
    return [];
  }

  const posts = files.map((filename) => {
    const { data } = matter(fs.readFileSync(path.join(dir, filename), "utf8"));
    return {
      slug: filename.replace(/\.md$/, ""),
      title: String(data.title ?? ""),
      date: String(data.date ?? ""),
      excerpt: String(data.excerpt ?? ""),
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
    } satisfies Post;
  });

  const withCovers = await Promise.all(
    posts
      .filter((p) => p.title)
      .map(async (p) => {
        if (!p.coverImage) return p;
        const meta = await getImageMeta(p.coverImage);
        return { ...p, blurDataURL: meta?.blurDataURL };
      }),
  );

  return withCovers.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/* Written as a date, read as a date: the frontmatter carries "June 24, 2026",
   which is fine to print but useless to a machine. */
function when(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? { text: value, iso: undefined }
    : {
        text: d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        iso: d.toISOString().slice(0, 10),
      };
}

export default async function Blogs() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;

  return (
    <div className="page">
      {/* The measure goes on an inner element, never on .shell itself: .shell
          centres what it is given, so a narrower max-width on the same node
          centres the heading instead of aligning it with the page. */}
      <header className="shell">
        <div className={styles.head}>
          <p className="label">Engineering journal</p>
          <h1 className="h1">
            What we found, and what it cost to find it.
          </h1>
          <p className="lede">
            Field reports from building the stack: scheduling, control loops,
            transport bugs, and the measurements behind the claims.
          </p>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="shell">
          <p className={styles.empty}>Nothing published yet.</p>
        </div>
      ) : (
        <div className="shell">
          {/* The newest post gets the width. A journal where every entry is
              the same size says nothing about which one to read. */}
          <Link href={`/blogs/${lead.slug}`} className={styles.lead}>
            {lead.coverImage ? (
              <div className={styles.leadImage}>
                <Image
                  src={lead.coverImage}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 62rem) 100vw, 62rem"
                  className={styles.cover}
                  {...(lead.blurDataURL
                    ? { placeholder: "blur" as const, blurDataURL: lead.blurDataURL }
                    : {})}
                />
              </div>
            ) : null}
            <div className={styles.leadBody}>
              <time className="label" dateTime={when(lead.date).iso}>
                {when(lead.date).text}
              </time>
              <h2 className="h2">{lead.title}</h2>
              <p className="body">{lead.excerpt}</p>
              <span className={styles.more}>
                Read it<span aria-hidden> →</span>
              </span>
            </div>
          </Link>

          {rest.length > 0 ? (
            <ol className={styles.list}>
              {rest.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blogs/${post.slug}`} className={styles.entry}>
                    <time className={`label ${styles.entryDate}`} dateTime={when(post.date).iso}>
                      {when(post.date).text}
                    </time>
                    <div className={styles.entryBody}>
                      <h2 className="h3">{post.title}</h2>
                      <p className="body small">{post.excerpt}</p>
                    </div>
                    {post.coverImage ? (
                      <div className={styles.entryThumb}>
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          sizes="12rem"
                          className={styles.cover}
                          {...(post.blurDataURL
                            ? { placeholder: "blur" as const, blurDataURL: post.blurDataURL }
                            : {})}
                        />
                      </div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      )}
    </div>
  );
}
