import Link from "next/link";
import { notFound } from "next/navigation";
import BoardPhoto from "@/components/BoardPhoto";
import ComingSoon from "@/components/ComingSoon";
import InterestDialog from "@/components/InterestDialog";
import WaitlistButton from "@/components/WaitlistButton";
import {
  hasDetails,
  kindLabel,
  kindOf,
  PRODUCT_MEDIA,
} from "@/lib/product-media";
import { getCatalogue, INTEREST_BY_SLUG, interestsFor } from "@/lib/products";
import X427 from "./X427";
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
      : hasDetails(product.slug)
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

  const details = hasDetails(product.slug);
  const media = PRODUCT_MEDIA[product.slug];
  const kind = kindOf(product.slug);
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
  const siblings = catalogue.products.filter(
    (other) => other.slug !== product.slug,
  );

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
      {isX427 ? (
        <X427
          name={product.name}
          interest={interest}
          options={interestsFor(catalogue.products)}
        />
      ) : (
        <>
      <section className={styles.crumbSection}>
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

      <section className={styles.leadSection}>
        <div className="shell">
          <div className={styles.lead}>
            <div className={styles.visual}>
              <div className={`${styles.frame} ${media ? styles.frameBoard : ""}`}>
                {media ? (
                  <BoardPhoto
                    shot={media.hero}
                    sizes="(max-width: 60rem) 100vw, 34rem"
                    priority
                  />
                ) : (
                  /* No published render. An empty dark rectangle reads as a
                     broken image, so it says which it is. */
                  <ComingSoon kind={kind} />
                )}
              </div>

              {media && media.gallery.length > 0 ? (
                <ul className={styles.gallery}>
                  {media.gallery.map((shot) => (
                    <li key={shot.src} className={styles.shot}>
                      <BoardPhoto
                        shot={shot}
                        sizes="(max-width: 60rem) 100vw, 34rem"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className={styles.intro}>
              <p className="label label-signal">
                {details && product.kicker ? product.kicker : kindLabel(product.slug)}
              </p>
              <h1 className={`h1 ${styles.name}`}>{product.name}</h1>

              <p className={styles.meta}>
                {details ? (
                  <>
                    {product.part ? (
                      <span className={`data ${styles.part}`}>{product.part}</span>
                    ) : null}
                    {product.status ? (
                      <span className={`data ${styles.status}`}>
                        {product.status}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </p>

              {details && product.summary ? (
                <p className={`lede ${styles.summary}`}>{product.summary}</p>
              ) : null}

              <div className={styles.actions}>
                <InterestDialog
                  label="Enquire"
                  title={`Enquire about ${product.name}`}
                  lede="Your message goes to an engineer, and the reply comes from one."
                  interest={interest}
                  options={interestsFor(catalogue.products)}
                />
                {/* The student waitlist is for the X427 only, and sits beside
                    Enquire rather than replacing it: one is a question for an
                    engineer, the other a place in the line. */}
                {product.slug === "x427" ? (
                  <WaitlistButton label="Join waitlist" />
                ) : null}
                <Link href="/docs" className="btn btn-ghost">
                  Read the documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {details && product.specs.length > 0 ? (
        <section className="section-tight rule">
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

            <p className={`small ${styles.caveat}`}>
              The images are renders. Measured results are in{" "}
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

        </>
      )}

      {siblings.length > 0 ? (
        <section className="section-tight rule">
          <div className="shell">
            <h2 className={`label ${styles.alsoHead}`}>Other products</h2>
            <ul className={styles.also}>
              {siblings.map((other) => (
                <li key={other.id}>
                  <Link href={`/products/${other.slug}`} className={styles.alsoCard}>
                    <span className={styles.alsoFrame}>
                      {hasDetails(other.slug) ? (
                        <BoardPhoto
                          shot={PRODUCT_MEDIA[other.slug].card}
                          sizes="12rem"
                        />
                      ) : (
                        <ComingSoon compact kind={kindOf(other.slug)} />
                      )}
                    </span>
                    <span className={styles.alsoBody}>
                      <span className={`h3 ${styles.alsoName}`}>{other.name}</span>
                      {hasDetails(other.slug) ? (
                        other.part ? (
                          <span className={`data ${styles.part}`}>{other.part}</span>
                        ) : null
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
