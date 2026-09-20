import Image from "next/image";
import Link from "next/link";
import Cinematic from "@/components/Cinematic";
import EnquiryForm from "@/components/EnquiryForm";
import { getCatalogue, INTEREST_OPTIONS } from "@/lib/products";
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
    "The hardware NAVRobotec is building around VaiOS: the NAVIX-SMF446 and NAVIX-SMH747 flight controllers, and Vidyut, a sub-250 g airframe.",
};

/* The catalogue changes without a deploy, so the page must not be baked at
   build time. */
export const dynamic = "force-dynamic";

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ want?: string }>;
}) {
  const [catalogue, params] = await Promise.all([getCatalogue(), searchParams]);
  const products = catalogue.status === "ok" ? catalogue.products : [];
  const anyPlaceholder = products.some((product) => product.placeholder);
  const wanted = params.want ? [params.want] : [];

  return (
    <div className="page-flush">
      <Cinematic
        kicker="Products"
        title={<>Hardware, built around the stack.</>}
        lede="Flight controllers that run VaiOS and NavHAL because they were designed for them, and an aircraft light enough to fly almost anywhere."
      />

      <section className="section">
        <div className="shell">
          {anyPlaceholder ? (
            /* Loud, and it disappears on its own: it is driven by the
               `placeholder` column, so clearing the flag on the last row
               removes the notice. Nobody has to remember to delete it. */
            <p role="note" className={styles.notice}>
              <strong>Placeholder data.</strong> Some entries below still carry
              the seeded stand-in copy and specifications. They are marked, and
              this notice clears itself once the last one is corrected.
            </p>
          ) : null}

          {catalogue.status === "unavailable" ? (
            <p className={styles.empty}>
              The catalogue could not be loaded just now. Please{" "}
              <Link href="/contact" className={styles.link}>
                write to us
              </Link>{" "}
              and we will send it to you directly.
            </p>
          ) : products.length === 0 ? (
            /* Answered, and empty. Not the same thing as unreachable, and not
               the same sentence: nothing is broken, there is just nothing here
               yet. */
            <p className={styles.empty}>
              Nothing is listed yet. What we are building is described in{" "}
              <Link href="/technology" className={styles.link}>
                the technology
              </Link>
              , and we will list the hardware here when there is something to
              say about it.
            </p>
          ) : (
            <ul className={styles.grid}>
              {products.map((product, index) => (
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
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="(max-width: 48rem) 100vw, (max-width: 72rem) 50vw, 24rem"
                          className={styles.render}
                        />
                      ) : (
                        /* No render on this row yet. An empty dark rectangle
                           reads as a broken image, so it says which it is. */
                        <span className={styles.awaiting}>Render to come</span>
                      )}
                    </span>

                    <span className={styles.body}>
                      <span className={`h3 ${styles.name}`}>{product.name}</span>
                      {product.kicker ? (
                        <span className={`label ${styles.role}`}>
                          {product.kicker}
                        </span>
                      ) : null}

                      <span className={styles.meta}>
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
                        {product.placeholder ? (
                          <span className={`data ${styles.flag}`}>
                            Placeholder
                          </span>
                        ) : null}
                      </span>

                      {product.summary ? (
                        <span className={styles.summary}>{product.summary}</span>
                      ) : null}

                      <span className={styles.more} aria-hidden>
                        {product.specs.length > 0
                          ? `${product.specs.length} specifications`
                          : "Details"}
                        <span className={styles.arrow}>&rarr;</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className={`small muted ${styles.caveat}`}>
            The images are renders, not photographs — none of this has been
            manufactured yet. Nothing here is shipping and none of it has a
            date; the figures describe the parts these are built around, and
            anything measured on our own hardware is in{" "}
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

      <section id="interest" className="section rule tinted">
        <div className="shell">
          <header className={styles.head}>
            <p className="label">Register interest</p>
            <h2 className="h1">Tell us which one.</h2>
            <p className="lede">
              What gets built first is decided by who is waiting for it. No
              obligation and no mailing list — this reaches an engineer, and
              the reply comes from one.
            </p>
          </header>

          <div className={styles.formCol}>
            <EnquiryForm
              source="wishlist"
              fields={[
                { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
                { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
                { name: "company", label: "Company or team", type: "text", autoComplete: "organization", wide: true },
              ]}
              interests={{ legend: "Which of these", options: INTEREST_OPTIONS }}
              defaultInterests={wanted}
              message={{
                label: "What would you use it for?",
                placeholder:
                  "The aircraft, the payload, the environment, how many — whatever would help us build the right one first.",
                rows: 5,
              }}
              submit="Register interest"
              done={{
                title: "Thank you — that reached us.",
                body: "You are on the list for it. We write when there is something real to show, not before.",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
