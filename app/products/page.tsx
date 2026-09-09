import Link from "next/link";
import Cinematic from "@/components/Cinematic";
import EnquiryForm from "@/components/EnquiryForm";
import { getProducts } from "@/lib/products";
import styles from "./page.module.css";

/* The hardware, read from the API rather than written here.
 *
 * A catalogue in a page's source is a catalogue that needs a deploy to
 * correct, which is how a wrong figure stays up for a week. These rows come
 * from the products table; db/005_products.sql seeds them and the admin
 * PATCH endpoint changes them.
 *
 * Rendered on the server at request time, so the specifications are in the
 * HTML a crawler and a reader both receive, and never cached — a cached page
 * would put the deploy back.
 *
 * No photographs: none of this has shipped, and a render of an unbuilt board
 * beside a specification reads as a catalogue entry however carefully the
 * copy is worded. The frame is the plain Cinematic band for the same reason.
 */

export const metadata = {
  title: "Products",
  description:
    "The hardware NAVRobotec is building around VaiOS: flight controllers on STM32F446 and STM32H747, and a sub-250 g airframe.",
};

/* The catalogue changes without a deploy, so the page must not be baked at
   build time. */
export const dynamic = "force-dynamic";

/* The chips the API validates against, keyed by slug.
 *
 * Fixed labels rather than the product names from the database: the API
 * checks them against kInterests and drops what it does not know, so renaming
 * a product must not silently stop recording who asked for it. Keyed by slug
 * so a card can link to the form already saying which one it is about. */
const INTEREST_BY_SLUG: Record<string, string> = {
  "fc-f446": "Flight controller (F446)",
  "fc-h747": "Flight controller (H7)",
  "airframe-sub250": "Sub-250 g airframe",
};
const INTEREST_OPTIONS = Object.values(INTEREST_BY_SLUG);

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ want?: string }>;
}) {
  const [products, params] = await Promise.all([
    getProducts(),
    searchParams,
  ]);
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

          {products.length === 0 ? (
            <p className={styles.empty}>
              The catalogue could not be loaded just now. Please{" "}
              <Link href="/contact" className={styles.link}>
                write to us
              </Link>{" "}
              and we will send it to you directly.
            </p>
          ) : (
            <ol className={styles.items}>
              {products.map((product) => {
                const interest = INTEREST_BY_SLUG[product.slug];
                return (
                  <li key={product.id} className={styles.item}>
                    {/* The identity block. Both flight controllers are called
                        "Flight controller"; what tells them apart is the part,
                        so the part is what the card leads with rather than a
                        grey subtitle a reader has to compare. */}
                    <div className={styles.badge}>
                      <span className={styles.designator}>{product.part}</span>
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
                    </div>

                    <div className={styles.body}>
                      <p className={`label ${styles.role}`}>
                        {product.name}
                        {product.kicker ? ` — ${product.kicker}` : ""}
                      </p>

                      {product.summary ? (
                        <p className={`lede ${styles.summary}`}>
                          {product.summary}
                        </p>
                      ) : null}

                      {product.specs.length > 0 ? (
                        <dl className={styles.specs}>
                          {product.specs.map((spec) => (
                            <div key={spec.label} className={styles.spec}>
                              <dt className={`label ${styles.specLabel}`}>
                                {spec.label}
                              </dt>
                              <dd className={`data ${styles.specValue}`}>
                                {spec.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}

                      {interest ? (
                        <Link
                          href={`/products?want=${encodeURIComponent(interest)}#interest`}
                          className={styles.want}
                        >
                          Register interest in this
                          <span aria-hidden>&rarr;</span>
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <p className={`small muted ${styles.caveat}`}>
            Nothing here is shipping, and none of it has a date. The figures
            describe the parts these are built around; anything measured on our
            own hardware is in{" "}
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
