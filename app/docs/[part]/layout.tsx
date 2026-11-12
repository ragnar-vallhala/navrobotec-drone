import { notFound } from "next/navigation";
import BookNav from "@/components/BookNav";
import { BOOK_ORDER, getBookBySlug } from "@/lib/books";
import styles from "../DocsLayout.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return BOOK_ORDER.map((part) => ({ part }));
}

export default async function BookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ part: string }>;
}) {
  const book = getBookBySlug((await params).part);
  if (!book) notFound();
  return (
    <>
      <BookNav
        slug={book.slug}
        title={book.title}
        items={book.chapters.map((c) => ({
          n: c.n,
          slug: c.slug,
          title: c.title,
          coming: c.status === "coming",
        }))}
      />
      <div className={styles.docsContent}>
        <div className={styles.innerContent}>{children}</div>
      </div>
    </>
  );
}
