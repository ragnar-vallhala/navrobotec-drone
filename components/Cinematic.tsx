import Image from "next/image";
import styles from "./Cinematic.module.css";
import type { ReactNode } from "react";

/* The page opening, everywhere.
 *
 * An establishing shot, then a title card. Nothing is written across the
 * frame: a scrim heavy enough to make words legible over a photograph is
 * heavy enough to flatten it, so you pay for an image and then dim it. The
 * words come after, on flat ground, where they cost the picture nothing.
 *
 * The frame runs to the top of the window and under the header, which floats
 * on it the way a title bar does, and fades into the band at its foot rather
 * than ending on an edge.
 */

export default function Cinematic({
  src,
  kicker,
  title,
  lede,
  children,
  /* Where the interesting part of this particular photograph is. A single
     centred crop suits none of them: the board shot has its subject low, the
     landscape has it on the horizon. */
  focus = "center",
  /* Tall frames earn more height; a 1:1 render does not need 82vh of it. */
  height = "tall",
}: {
  /* Optional, and often absent on purpose. A cinematic opening does not
     require a photograph — it requires the page to begin with one idea and
     nothing else. Half the images to hand are documentation shots: sharp and
     useful in a section, weak blown up to a full frame. A page with no strong
     image opens on the band itself rather than on a stock landscape, which is
     the usual way this treatment turns into padding. */
  src?: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  focus?: string;
  height?: "tall" | "short";
}) {
  return (
    <section className={`band ${styles.opening} ${src ? "" : styles.plain}`}>
      {src ? (
        <div
          className={`${styles.stage} ${height === "short" ? styles.short : ""}`}
          aria-hidden
        >
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.image}
            style={{ objectPosition: focus }}
          />
          <div className={styles.fade} />
        </div>
      ) : (
        <div className="reticle" aria-hidden />
      )}

      <div className={`shell ${styles.card}`}>
        <p className={`label label-signal ${styles.kicker}`}>{kicker}</p>
        <h1 className={`display ${styles.title}`}>{title}</h1>
        {lede ? <p className={`lede ${styles.lede}`}>{lede}</p> : null}
        {children}
      </div>
    </section>
  );
}
