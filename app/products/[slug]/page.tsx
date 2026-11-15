import Banner from "@/components/Banner";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/catalogue/ProductCard";
import ProductDetail from "@/components/catalogue/ProductDetail";
import { cardOf } from "@/lib/product-card";
import { hasPage, kindLabel } from "@/lib/product-media";
import { getCatalogue, INTEREST_BY_SLUG, interestsFor } from "@/lib/products";
import styles from "./product.module.css";

/* One product.
 *
 * The render leads, because the render is what tells these apart at a glance,
 * and the specifications sit beside it rather than under it: a reader who came
 * here from a card came for the numbers, and they should not have to scroll
 * past a picture they have already seen to reach them.
 *
 * Not prerendered. The catalogue is edited through the admin console without a
 * deploy, so a baked page would put the deploy back — the same reason the
 * index opts out. There is no generateStaticParams for the same reason: the
 * set of products is a row count, not a directory listing.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalogue = await getCatalogue();
  const product =
    catalogue.status === "ok"
      ? catalogue.products.find((candidate) => candidate.slug === slug)
      : undefined;
  if (!product) return { title: "Product" };

  return {
    title: product.name,
    description: product.slug === "x427"
      ? "NAVIX X427 Rev A: STM32F427 flight controller with dual-IMU option, DroneCAN, 14 PWM outputs, microSD logging and a power mux, from the STM32F4 family, built for the NavHAL, VaiOS and VAYU stack."
      : hasPage(product.slug)
      ? product.summary || product.kicker || undefined
      : `${product.name}: ${kindLabel(product.slug).toLowerCase()} from NAVRobotec, coming soon. Register your interest.`,
    /* No og:image. The renders are transparent PNGs keyed to sit on a dark
       band; a share card composites them on whatever it likes, and a board
       cut out against white nothing is a worse advertisement than no image. */
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalogue = await getCatalogue();

  /* One fetch for the page: the row this page is about and the rest of the
     catalogue come out of the same list, because the API's rate limit is five
     a minute for every visitor together and a second call would spend two of
     them on one page view. */
  if (catalogue.status === "unavailable") {
    return (
      <div className="page">
        <section className="section">
          <div className="shell">
            <p className="label">Products</p>
            <h1 className="h1">The catalogue could not be loaded.</h1>
            <p className="lede">
              Try again shortly, or{" "}
              <Link href="/contact" className={styles.link}>
                write to us
              </Link>
              .
            </p>
            <p className={styles.back}>
              <Link href="/products" className={styles.link}>
                All products
              </Link>
            </p>
          </div>
        </section>
      </div>
    );
  }

  const product = catalogue.products.find(
    (candidate) => candidate.slug === slug,
  );

  /* Only a slug the catalogue has never heard of is a 404, and this is the
     branch that knows the difference: the catalogue answered, and this is not
     in it. An unreachable API took the branch above and apologised, because it
     must not tell a reader that the product they were linked to never existed. */
  if (!product) notFound();

  const interest = INTEREST_BY_SLUG[product.slug];
  const isX427 = product.slug === "x427";
  const jsonLd = isX427
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        category: "Flight controller",
        description:
          "STM32F427 (STM32F4, Cortex-M4F) flight controller board, Rev A, built for the NavHAL, VaiOS and VAYU stack.",
        brand: { "@type": "Brand", name: "NAVRobotec" },
      }
    : null;
  const options = interestsFor(catalogue.products);
  const siblings = catalogue.products
    .filter((other) => other.slug !== product.slug)
    .map(cardOf);

  return (
    <div className="page">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <ProductDetail product={product} interest={interest} options={options} />

      {siblings.length > 0 ? (
        <section className={styles.also}>
          <div className="shell">
            <h2 className={`label ${styles.alsoHead}`}>Other products</h2>
            <ul className={styles.alsoGrid}>
              {siblings.map((card) => (
                <li key={card.slug} className={styles.alsoCell}>
                  <ProductCard card={card} options={options} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Banner />
    </div>
  );
}
