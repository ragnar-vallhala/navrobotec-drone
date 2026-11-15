import Link from "next/link";
import BoardPhoto from "@/components/BoardPhoto";
import ComingSoon from "@/components/ComingSoon";
import type { Shot } from "@/lib/product-media";
import type { WaitlistProduct } from "@/lib/waitlist";
import ProductActions from "./ProductActions";
import styles from "./catalogue.module.css";

export type CardData = {
  slug: string;
  name: string;
  category: string;
  availability: string;
  summary: string;
  shot?: Shot;
  kind: "board" | "airframe";
  interest?: string;
  waitlist: WaitlistProduct | false;
};

/* One product in the grid. The picture and the name are the link; the
   buttons sit below them as separate controls, so no link wraps a button. */
export default function ProductCard({
  card,
  options,
}: {
  card: CardData;
  options: string[];
}) {
  const href = `/products/${card.slug}`;
  return (
    <article className={styles.card}>
      <Link href={href} className={styles.frame} tabIndex={-1} aria-hidden>
        {card.shot ? (
          <BoardPhoto
            shot={card.shot}
            sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 20rem"
          />
        ) : (
          <ComingSoon kind={card.kind} />
        )}
      </Link>
      <div className={styles.body}>
        <p className={`label ${styles.category}`}>{card.category}</p>
        <h2 className={`h3 ${styles.name}`}>
          <Link href={href} className={styles.nameLink}>
            {card.name}
          </Link>
        </h2>
        {card.summary ? <p className={styles.summary}>{card.summary}</p> : null}
        <p>
          <span className={`data ${styles.badge}`}>{card.availability}</span>
        </p>
        <div className={styles.actions}>
          <ProductActions
            name={card.name}
            interest={card.interest}
            options={options}
            waitlist={card.waitlist}
            block
          />
        </div>
      </div>
    </article>
  );
}
