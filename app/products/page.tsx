import Banner from "@/components/Banner";
import Link from "next/link";
import ComingSoon from "@/components/ComingSoon";
import WaitlistButton from "@/components/WaitlistButton";
import BoardPhoto from "@/components/BoardPhoto";
import Cinematic from "@/components/Cinematic";
import {
  hasDetails,
  kindLabel,
  kindOf,
  PRODUCT_MEDIA,
  PRODUCTS_OPENING,
} from "@/lib/product-media";
import { getCatalogue } from "@/lib/products";
import styles from "./page.module.css";

/* The catalogue: one card per product, each opening its own page.
 *
 * This page used to be the catalogue entire — every specification of every
 * product stacked down one column. That reads as a datasheet three products
 * long: nothing can be compared, because no two things a reader would compare
 * are ever on screen together, and the page grows unreadable with the fourth
 * product rather than with the fourth paragraph.
 *
 * A card carries only what tells two products apart — the render, the part,
 * and one line of what it is for. The specifications belong on the page about
 * that product, where there is room to lay them out and nothing else is
 * competing for the reader.
 *
 * Read from the API rather than written here. A catalogue in a page's source
 * is a catalogue that needs a deploy to correct, which is how a wrong figure
 * stays up for a week. These rows come from the products table;
 * db/005_products.sql seeds them and the admin PATCH endpoint changes them.
 */

export const metadata = {
  title: "Products",
  description:
    "The hardware NAVRobotec is building around VaiOS: the NAVIX X427 flight controller and the boards and airframe to follow.",
};

/* The catalogue changes without a deploy, so the page must not be baked at
   build time. */
export const dynamic = "force-dynamic";

export default async function Products() {
  const catalogue = await getCatalogue();
  const products = catalogue.status === "ok" ? catalogue.products : [];

  return (
    <div className="page-flush">
      <Cinematic
        height="board"
        art={
          <BoardPhoto
            shot={PRODUCTS_OPENING.wide}
            narrow={PRODUCTS_OPENING.narrow}
            sizes="100vw"
            priority
          />
        }
        kicker="Products"
        title={<>Hardware, built around the stack.</>}
        lede="Flight controllers that run VaiOS and NavHAL because they were designed for them, starting with the NAVIX X427."
      />

      <section className="section">
        <div className="shell">
          {catalogue.status === "unavailable" ? (
            <p className={styles.empty}>
              The catalogue could not be loaded. Try again shortly, or{" "}
              <Link href="/contact" className={styles.link}>
                write to us
              </Link>
              .
            </p>
          ) : products.length === 0 ? (
            /* Answered, and empty. Not the same thing as unreachable, and not
               the same sentence: nothing is broken, there is just nothing here
               yet. */
            <p className={styles.empty}>
              No products are listed yet. The stack they run is described in{" "}
              <Link href="/technology" className={styles.link}>
                Technology
              </Link>
              .
            </p>
          ) : (
            <ul className={styles.grid}>
              {products.map((product, index) => {
                const details = hasDetails(product.slug);
                return (
                /* The whole card is the link, so the target is the card rather
                   than a four-word phrase inside it. One anchor per card, too:
                   a nested "read more" would put two links on one destination
                   and have a screen reader announce the product twice. */
                <li
                  key={product.id}
                  className={`rise ${styles.cell}`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Link href={`/products/${product.slug}`} className={styles.card}>
                    <span className={styles.frame}>
                      {details ? (
                        <BoardPhoto
                          shot={PRODUCT_MEDIA[product.slug].card}
                          sizes="(max-width: 48rem) 100vw, (max-width: 72rem) 50vw, 24rem"
                        />
                      ) : (
                        /* No render on this row yet. An empty dark rectangle
                           reads as a broken image, so it says which it is. */
                        <ComingSoon kind={kindOf(product.slug)} />
                      )}
                      {product.slug === "x427" || product.slug === "x427-mini" ? (
                        <span className={styles.badge}>Waitlist open</span>
                      ) : null}
                    </span>

                    <span className={styles.body}>
                      <span className={`label ${styles.role}`}>
                        {details && product.kicker
                          ? product.kicker
                          : kindLabel(product.slug)}
                      </span>
                      <h2 className={`h3 ${styles.name}`}>{product.name}</h2>

                      <span className={styles.meta}>
                        {details ? (
                          <>
                            {product.part ? (
                              <span className={`data ${styles.part}`}>
                                {product.part}
                              </span>
                            ) : null}
                            {product.status ? (
                              <span className={`data ${styles.status}`}>
                                {product.status}
                              </span>
                            ) : null}
                          </>
                        ) : null}
                      </span>

                      {details && product.summary ? (
                        <span className={styles.summary}>{product.summary}</span>
                      ) : null}

                      <span className={styles.more} aria-hidden>
                        View
                        <span className={styles.arrow}>&rarr;</span>
                      </span>
                    </span>
                  </Link>
                </li>
                );
              })}
            </ul>
          )}

          <aside className={styles.waitlist} aria-labelledby="products-wl">
            <div>
              <p className="label label-signal">X427 waitlist</p>
              <h2 id="products-wl" className="h3">
                X427 waitlist is open
              </h2>
              <p className="body small">
                Open to everyone. The first 50 college students on the
                waitlist receive a free board, first come, first served.
              </p>
            </div>
            <WaitlistButton label="Join the waitlist" className="btn btn-primary" />
          </aside>

        </div>
      </section>


      <Banner />
    </div>
  );
}
