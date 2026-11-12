import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getBookBySlug, readyChapters } from "@/lib/books";
import { getPart } from "@/lib/parts";
import styles from "../DocsPage.module.css";
import bk from "../Book.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ part: string }>;
}): Promise<Metadata> {
  const book = getBookBySlug((await params).part);
  if (!book) return { title: "Documentation" };
  return {
    title: `${book.title}: ${book.kicker.toLowerCase()}`,
    description: book.summary,
  };
}

/* A book's landing page: what the part is, the facts that are on record for
   it, and the chapters in order. */
export default async function BookLanding({
  params,
}: {
  params: Promise<{ part: string }>;
}) {
  const book = getBookBySlug((await params).part);
  const part = book && getPart(book.slug);
  if (!book || !part) notFound();

  const ready = readyChapters(book);
  const first = ready[0];

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href="/docs" className={styles.label}>
          <ArrowLeft size={12} /> Documentation
        </Link>
        <p className={bk.kicker}>{book.kicker}</p>
        <h1 className={styles.title}>{book.title}</h1>
      </header>

      <p className={styles.lead}>{part.overview}</p>

      <dl className={bk.facts}>
        <div>
          <dt className="label">Who it is for</dt>
          <dd>{part.audience}</dd>
        </div>
        {part.version.map((v) => (
          <div key={v.label}>
            <dt className="label">{v.label}</dt>
            <dd className="data">{v.value}</dd>
          </div>
        ))}
        <div>
          <dt className="label">This book</dt>
          <dd className="data">
            {ready.length === book.chapters.length
              ? `${book.chapters.length} chapters`
              : `${ready.length} of ${book.chapters.length} chapters written`}
          </dd>
        </div>
      </dl>

      {first && (
        <Link href={`/docs/${book.slug}/${first.slug}`} className={bk.start}>
          Start reading <ArrowRight size={16} />
          <span className={bk.startSub}>
            Chapter {first.n}: {first.title}
          </span>
        </Link>
      )}

      <h2 className={bk.h2}>Chapters</h2>
      <ol className={bk.toc}>
        {book.chapters.map((c) => {
          const num = String(c.n).padStart(2, "0");
          if (c.status === "coming") {
            return (
              <li key={c.slug} className={`${bk.tocRow} ${bk.tocSoon}`}>
                <span className={bk.tocNo}>{num}</span>
                <span className={bk.tocBody}>
                  <span className={bk.tocTitle}>{c.title}</span>
                </span>
                <span className={styles.soon}>Coming soon</span>
              </li>
            );
          }
          return (
            <li key={c.slug}>
              <Link href={`/docs/${book.slug}/${c.slug}`} className={bk.tocRow}>
                <span className={bk.tocNo}>{num}</span>
                <span className={bk.tocBody}>
                  <span className={bk.tocTitle}>{c.title}</span>
                  {c.blurb && <span className={bk.tocBlurb}>{c.blurb}</span>}
                </span>
                <ArrowRight size={16} />
              </Link>
            </li>
          );
        })}
      </ol>

      {part.lacks.length > 0 && (
        <aside className={bk.note}>
          <h2 className={bk.noteHead}>Known gaps</h2>
          <ul>
            {part.lacks.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </aside>
      )}

      {book.repo && (
        <p className={bk.provenance}>
          Written from the {book.repo} repository. Each chapter ends with the
          sources it was checked against.
        </p>
      )}
    </article>
  );
}
