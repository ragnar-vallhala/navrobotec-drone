import Link from "next/link";
import type { Product } from "@/lib/products";
import { kindOf } from "@/lib/product-media";
import { availabilityOf, buildView, categoryOf } from "@/lib/product-view";
import Gallery from "./Gallery";
import TabNav from "./TabNav";
import ProductActions from "./ProductActions";
import styles from "./catalogue.module.css";

/* One product, laid out as a catalogue page: pictures on the left, the buy box
   on the right, then the sections a shopper looks for. Each section appears
   only when the product's data has something for it. */
export default function ProductDetail({
  product,
  interest,
  options,
}: {
  product: Product;
  interest?: string;
  options: string[];
}) {
  const view = buildView(product);
  const availability = availabilityOf(product);
  const category = categoryOf(product);
  const { description } = view;

  const tabs = [
    description.paragraphs.length || description.points.length
      ? { id: "description", label: "Description" }
      : null,
    view.specs.length ? { id: "specs", label: "Specifications" } : null,
    view.docs.length || view.drawings.length ? { id: "documents", label: "Drawings and documents" } : null,
    view.faq.length ? { id: "questions", label: "Questions" } : null,
  ].filter((t): t is { id: string; label: string } => t !== null);

  const actions = (
    <ProductActions
      name={product.name}
      interest={interest}
      options={options}
      waitlist={view.waitlist}
      block
    />
  );

  return (
    <>
      <div className="shell">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/products">Products</Link>
          <span aria-hidden>/</span>
          <span>{category}</span>
          <span aria-hidden>/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className={styles.top}>
          <Gallery items={view.gallery} kind={kindOf(product.slug)} name={product.name} />

          <div className={styles.buy}>
            <p className="label label-signal">{category}</p>
            <h1 className={`h1 ${styles.title}`}>{product.name}</h1>
            {product.part && availability !== "Coming soon" ? (
              <p className={`data ${styles.part}`}>{product.part}</p>
            ) : null}

            {view.bullets.length ? (
              <ul className={styles.bullets}>
                {view.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : description.paragraphs[0] ? (
              <p className={styles.lead}>{description.paragraphs[0]}</p>
            ) : null}

            <div className={styles.box}>
              <p>
                <span className={`data ${styles.badge}`}>{availability}</span>
              </p>
              <div className={styles.cta}>{actions}</div>
            </div>

            {view.addon ? (
              <div className={styles.addon}>
                <p className="label">{view.addon.label}</p>
                <h2 className={styles.addonTitle}>{view.addon.title}</h2>
                <p>{view.addon.body}</p>
                <Link href={view.addon.href} className={styles.addonLink}>
                  {view.addon.link}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {tabs.length ? <TabNav tabs={tabs} /> : null}

      <div className="shell">
        {description.paragraphs.length || description.points.length ? (
          <section id="description" className={styles.section}>
            <h2 className="h2">Description</h2>
            <div className={styles.prose}>
              {description.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {description.points.length ? (
                <ul className={styles.points}>
                  {description.points.map((pt) => (
                    <li key={pt.title}>
                      <strong>{pt.title}</strong> {pt.body}
                    </li>
                  ))}
                </ul>
              ) : null}
              {description.status.length ? (
                <>
                  <h3 className="h3">Where it stands</h3>
                  {description.status.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </>
              ) : null}
            </div>
          </section>
        ) : null}

        {view.specs.length ? (
          <section id="specs" className={styles.section}>
            <h2 className="h2">Specifications</h2>
            {view.specs.map((group) => (
              <div key={group.title} className={styles.specGroup}>
                <h3 className={`label ${styles.specTitle}`}>{group.title}</h3>
                <dl className={styles.specTable}>
                  {group.rows.map((row) => (
                    <div key={row.label} className={styles.specRow}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </section>
        ) : null}

        {view.docs.length || view.drawings.length ? (
          <section id="documents" className={styles.section}>
            <h2 className="h2">Drawings and documents</h2>
            {view.drawings.length ? (
              <div className={styles.drawings}>
                {view.drawings.map((d) => (
                  <figure key={d.src}>
                    <a href={d.src} target="_blank" rel="noopener" title="Open full size">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.src} alt={d.alt} width={d.width} height={d.height} loading="lazy" />
                    </a>
                    <figcaption>{d.caption}</figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
            <ul className={styles.docs}>
              {view.docs.map((d) => (
                <li key={d.href}>
                  {d.external ? (
                    <a href={d.href} target="_blank" rel="noopener">
                      {d.label}
                    </a>
                  ) : (
                    <Link href={d.href}>{d.label}</Link>
                  )}
                  {d.note ? <span className="label">{d.note}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {view.faq.length ? (
          <section id="questions" className={styles.section}>
            <h2 className="h2">Questions</h2>
            <div className={styles.faq}>
              {view.faq.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* Phones: the buy box scrolls away, so the actions are kept in reach. */}
      <div className={styles.sticky}>
        <div className={styles.stickyInfo}>
          <span className={`data ${styles.stickyName}`}>{product.name}</span>
        </div>
        <div className={styles.stickyActions}>
          <ProductActions
            name={product.name}
            interest={interest}
            options={options}
            waitlist={view.waitlist}
          />
        </div>
      </div>
    </>
  );
}
