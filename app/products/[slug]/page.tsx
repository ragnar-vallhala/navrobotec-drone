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
import {
  AUDIENCE,
  FAQ,
  GLANCE,
  MECHANICAL,
  ON_BOARD,
  PORTS,
  POWER,
  STACK,
  STATUS,
  type Row,
} from "@/lib/x427-details";
import styles from "./product.module.css";

function Table({ rows }: { rows: Row[] }) {
  return (
    <dl className={styles.table}>
      {rows.map((row) => (
        <div key={row.label} className={styles.row}>
          <dt className={`label ${styles.rowLabel}`}>{row.label}</dt>
          <dd className={styles.rowValue}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}


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
      ? "NAVIX X427 Rev A: STM32F427 flight controller with dual-IMU option, DroneCAN, 14 PWM outputs, microSD logging and a power mux, built for the NavHAL, VaiOS and VAYU stack."
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
          "STM32F427 flight controller board, Rev A, for the NavHAL, VaiOS and VAYU stack.",
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

      {isX427 ? (
        <>
          <section className="section-tight rule" id="at-a-glance">
            <div className="shell">
              <h2 className={`h2 ${styles.specsHead}`}>At a glance</h2>
              <dl className={styles.specs}>
                {GLANCE.map((spec) => (
                  <div key={spec.label} className={styles.spec}>
                    <dt className={`label ${styles.specLabel}`}>{spec.label}</dt>
                    <dd className={`data ${styles.specValue}`}>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="section-tight rule" id="on-the-board">
            <div className="shell">
              <h2 className={`h2 ${styles.specsHead}`}>What is on the board</h2>
              <div className={styles.groups}>
                {ON_BOARD.map((group) => (
                  <div key={group.title}>
                    <h3 className={`h3 ${styles.groupHead}`}>{group.title}</h3>
                    <Table rows={group.rows} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section-tight rule" id="ports">
            <div className="shell">
              <h2 className={`h2 ${styles.specsHead}`}>Ports and interfaces</h2>
              <Table rows={PORTS} />
              <p className={`small ${styles.caveat}`}>
                The connector set is in the{" "}
                <Link href="/docs/report/hardware/hw-overview" className={styles.link}>
                  hardware chapter
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="section-tight rule" id="power">
            <div className="shell">
              <h2 className={`h2 ${styles.specsHead}`}>Power design</h2>
              <Table rows={POWER} />
              <p className={`small ${styles.caveat}`}>
                Background in the{" "}
                <Link href="/docs/report/hardware/hw-power" className={styles.link}>
                  power section of the report
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="section-tight rule" id="software">
            <div className="shell">
              <h2 className={`h2 ${styles.specsHead}`}>The software stack</h2>
              <ul className={styles.stack}>
                {STACK.map((layer) => (
                  <li key={layer.name}>
                    <Link href={layer.href} className={styles.stackCard}>
                      <span className={`h3 ${styles.stackName}`}>{layer.name}</span>
                      <span className={styles.stackBody}>{layer.body}</span>
                      <span className={`data ${styles.stackGo}`}>Read the chapter</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section-tight rule" id="mechanical">
            <div className="shell">
              <h2 className={`h2 ${styles.specsHead}`}>Mechanical</h2>
              <Table rows={MECHANICAL} />
            </div>
          </section>

          <section className="section-tight rule" id="who-for">
            <div className="shell">
              <h2 className={`h2 ${styles.specsHead}`}>Who it is for</h2>
              <ul className={styles.plain}>
                {AUDIENCE.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="section-tight rule" id="status">
            <div className="shell">
              <h2 className={`h2 ${styles.specsHead}`}>Where it stands</h2>
              <div className={styles.plain}>
                {STATUS.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className={styles.actions}>
                <WaitlistButton label="Join waitlist" />
                <Link href="/waitlist" className="btn btn-ghost">
                  Free board offer for students
                </Link>
              </div>
            </div>
          </section>

          <section className="section-tight rule" id="faq">
            <div className="shell">
              <h2 className={`h2 ${styles.specsHead}`}>Questions</h2>
              <div className={styles.faq}>
                {FAQ.map((item) => (
                  <details key={item.q} className={styles.faqItem}>
                    <summary className={styles.faqQ}>{item.q}</summary>
                    <p className={styles.faqA}>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

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
