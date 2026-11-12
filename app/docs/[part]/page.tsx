import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import PartBody from "../PartBody";
import { getPart, PARTS } from "@/lib/parts";
import layout from "../DocsLayout.module.css";
import styles from "../DocsPage.module.css";

/* One page per part of the stack. NavHAL is not here: it already has a folder
   of chapters at /docs/navhal, whose index carries the same body. */
const ROUTED = PARTS.filter((part) => part.slug !== "navhal");

export const dynamicParams = false;

export function generateStaticParams() {
  return ROUTED.map((part) => ({ part: part.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ part: string }>;
}): Promise<Metadata> {
  const part = getPart((await params).part);
  if (!part) return { title: "Documentation" };
  return {
    title: `${part.title}: ${part.kicker.toLowerCase()}`,
    description: part.summary,
  };
}

export default async function PartPage({
  params,
}: {
  params: Promise<{ part: string }>;
}) {
  const { part: slug } = await params;
  const part = ROUTED.find((p) => p.slug === slug);
  if (!part) notFound();

  return (
    <div className={layout.hubContent}>
      <div className="shell">
        <article className={styles.article}>
          <header className={styles.header}>
            <Link href="/docs" className={styles.label}>
              <ArrowLeft size={12} /> Documentation
            </Link>
            <h1 className={styles.title}>{part.title}</h1>
            <p className={styles.partKicker}>{part.kicker}</p>
          </header>
          <PartBody part={part} />
        </article>
      </div>
    </div>
  );
}
