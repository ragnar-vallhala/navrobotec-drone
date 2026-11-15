import Banner from "@/components/Banner";
import Link from "next/link";
import ProductGrid from "@/components/catalogue/ProductGrid";
import { cardOf } from "@/lib/product-card";
import { getCatalogue, interestsFor } from "@/lib/products";
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
    <div className="page">
      <section className={styles.head}>
        <div className="shell">
          <p className="label label-signal">Catalogue</p>
          <h1 className="h1">Products</h1>
          <p className={`body ${styles.sub}`}>
            Flight controllers that run VaiOS and NavHAL because they were
            designed for them, starting with the NAVIX X427.
          </p>
        </div>
      </section>

      <section className="section-tight">
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
            /* Answered, and empty: nothing is broken, there is just nothing
               here yet. */
            <p className={styles.empty}>
              No products are listed yet. The stack they run is described in{" "}
              <Link href="/technology" className={styles.link}>
                Technology
              </Link>
              .
            </p>
          ) : (
            <ProductGrid
              cards={products.map(cardOf)}
              options={interestsFor(products)}
            />
          )}

        </div>
      </section>

      <Banner />
    </div>
  );
}
