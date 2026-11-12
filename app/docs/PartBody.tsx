import type { Block, Part } from "@/lib/parts";
import styles from "./DocsPage.module.css";

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === "p") return <p key={i}>{block.text}</p>;
        if (block.kind === "code")
          return (
            <pre key={i} className={styles.partCode} tabIndex={0}>
              <code>{block.lines.join("\n")}</code>
            </pre>
          );
        return (
          <ul key={i} className={styles.partList}>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      })}
    </>
  );
}

/* The body of a part's page, shared by every part. The NavHAL part reuses it
   on top of its existing chapter list. */
export default function PartBody({ part }: { part: Part }) {
  return (
    <div className={styles.part}>
      <p className={styles.lead}>{part.overview}</p>

      <dl className={styles.partFacts}>
        <div>
          <dt className="label">Who it is for</dt>
          <dd>{part.audience}</dd>
        </div>
        {part.version.map((v) => (
          <div key={v.label}>
            <dt className="label">{v.label}</dt>
            <dd className="data">{v.value}</dd>
          </div>
        ))}
      </dl>

      {part.sections.map((section) => (
        <section key={section.heading} className={styles.partSection}>
          <h2 className={styles.partH2}>{section.heading}</h2>
          <Blocks blocks={section.blocks} />
        </section>
      ))}

      <section className={styles.partSection}>
        <h2 className={styles.partH2}>Where to read more</h2>
        <p>
          Paths are inside the {part.title} repository, given for reference.
        </p>
        <ul className={`${styles.partList} ${styles.partPaths}`}>
          {part.read.map((path) => (
            <li key={path}>
              <code>{path}</code>
            </li>
          ))}
        </ul>
      </section>

      {part.lacks.length > 0 ? (
        <section className={styles.partSection}>
          <h2 className={styles.partH2}>What is missing</h2>
          <ul className={styles.partList}>
            {part.lacks.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
