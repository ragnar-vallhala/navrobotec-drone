import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import InterestDialog from "@/components/InterestDialog";
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
    description: product.summary || product.kicker || undefined,
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
            <h1 className="h1">The catalogue is not answering.</h1>
            <p className="lede">
              This is at our end, not yours — the product you were after does
              exist. Try again in a moment, or{" "}
              <Link href="/contact" className={styles.link}>
                write to us
              </Link>{" "}
              and we will send its specifications directly.
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
  const siblings = catalogue.products.filter(
    (other) => other.slug !== product.slug,
  );

  return (
    <div className="page">
      <section className="section-tight">
        <div className="shell">
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/products" className={styles.crumb}>
              Products
            </Link>
            <span className={styles.sep} aria-hidden>
              /
            </span>
            <span aria-current="page" className={styles.here}>
              {product.name}
            </span>
          </nav>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell">
          <div className={styles.lead}>
            <div className={styles.frame}>
              {product.image ? (
                <Image
                  src={product.image}
                  alt={`${product.name}, a render`}
                  fill
                  sizes="(max-width: 60rem) 100vw, 34rem"
                  className={styles.render}
                  priority
                />
              ) : (
                /* The row has no render yet. An empty dark rectangle reads as
                   a broken image, so it says which it is. */
                <span className={styles.awaiting}>Render to come</span>
              )}
            </div>

            <div className={styles.intro}>
              {product.kicker ? (
                <p className="label label-signal">{product.kicker}</p>
              ) : null}
              <h1 className={`h1 ${styles.name}`}>{product.name}</h1>

              <p className={styles.meta}>
                {product.part ? (
                  <span className={`data ${styles.part}`}>{product.part}</span>
                ) : null}
                {product.status ? (
                  <span className={`data ${styles.status}`}>
                    {product.status}
                  </span>
                ) : null}
                {product.placeholder ? (
                  <span className={`data ${styles.flag}`}>Placeholder</span>
                ) : null}
              </p>

              {product.summary ? (
                <p className={`lede ${styles.summary}`}>{product.summary}</p>
              ) : null}

              {product.placeholder ? (
                <p role="note" className={styles.notice}>
                  <strong>Placeholder data.</strong> This entry still carries
                  seeded stand-in copy and specifications. Treat the figures
                  below as illustrative until this notice is gone.
                </p>
              ) : null}

              <InterestDialog
                label="Register interest"
                title="Waiting on this one?"
                lede="What gets built first is decided by who is waiting for it. No obligation and no mailing list — this reaches an engineer, and the reply comes from one."
                interest={interest}
                options={interestsFor(catalogue.products)}
              />
            </div>
          </div>
        </div>
      </section>

      {product.specs.length > 0 ? (
        <section className="section rule">
          <div className="shell">
            <h2 className={`h2 ${styles.specsHead}`}>Specifications</h2>
            <dl className={styles.specs}>
              {product.specs.map((spec) => (
                <div key={spec.label} className={styles.spec}>
                  <dt className={`label ${styles.specLabel}`}>{spec.label}</dt>
                  <dd className={`data ${styles.specValue}`}>{spec.value}</dd>
                </div>
              ))}
            </dl>

            <p className={`small muted ${styles.caveat}`}>
              The image is a render, not a photograph — this has not been
              manufactured. Nothing here is shipping and none of it has a date;
              the figures describe the parts it is built around, and anything
              measured on our own hardware is in{" "}
              <Link
                href="/docs/report/vaios/vaios-performance"
                className={styles.link}
              >
                the benchmark
              </Link>
              .
            </p>
          </div>
        </section>
      ) : null}

      {siblings.length > 0 ? (
        <section className="section rule">
          <div className="shell">
            <h2 className={`label ${styles.alsoHead}`}>The rest of it</h2>
            <ul className={styles.also}>
              {siblings.map((other) => (
                <li key={other.id}>
                  <Link href={`/products/${other.slug}`} className={styles.alsoCard}>
                    <span className={styles.alsoFrame}>
                      {other.image ? (
                        <Image
                          src={other.image}
                          alt=""
                          fill
                          sizes="12rem"
                          className={styles.render}
                        />
                      ) : null}
                    </span>
                    <span className={styles.alsoBody}>
                      <span className={`h3 ${styles.alsoName}`}>{other.name}</span>
                      {other.part ? (
                        <span className={`data ${styles.part}`}>{other.part}</span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
