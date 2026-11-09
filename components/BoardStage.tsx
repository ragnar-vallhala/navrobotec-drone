import Image from "next/image";
import styles from "./BoardStage.module.css";

/* A board on an instrument ground.
 *
 * The render is a cut-out, so it sits on drawn ground rather than a photograph:
 * the site's reticle grid, a pool of signal green behind the board and a soft
 * shadow under it. All of it is CSS, so it costs no bytes and cannot fail to
 * load; the one image is the board.
 *
 * Fills its positioned parent. `sizes` is the board's rendered width, because
 * the browser picks a source from it before layout.
 */
export default function BoardStage({
  src,
  alt,
  sizes,
  /* Share of the frame's width the board may take. */
  fit = 62,
  priority = false,
  /* In a card-sized frame rather than under the page header. */
  framed = false,
  width = 979,
  height = 503,
}: {
  src: string;
  alt: string;
  sizes: string;
  fit?: number;
  priority?: boolean;
  framed?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <div className={styles.root} data-framed={framed || undefined}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.grid} aria-hidden />
      <div className={styles.board} style={{ ["--fit" as string]: `${fit}%` }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      </div>
    </div>
  );
}
