import { Unbounded, Dancing_Script } from "next/font/google";
import Mark from "./Mark";
import BgReady from "./BgReady";
import styles from "./Banner.module.css";

/* The brand banner: a clay relief of South Asia, the name with the rotor
 * standing in for the first O, and the tagline in script.
 *
 * Full-bleed, so put it between sections, outside any .shell. The wordmark is
 * set in text, not baked into the picture, so it stays sharp and readable by
 * screen readers; the relief behind it is decoration. */
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});
const script = Dancing_Script({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export default function Banner() {
  return (
    <section className={styles.banner} aria-label="NAVRobotec — man meets machine">
      <div className={styles.bg} data-bgreveal aria-hidden>
        <BgReady />
      </div>
      <div className={styles.lock}>
        <p className={`${styles.name} ${unbounded.className}`} aria-hidden>
          <span className={styles.left}>NAVR</span>
          <Mark className={styles.mark} />
          <span className={styles.right}>BOTEC</span>
        </p>
        <p className={`${styles.tagline} ${script.className}`} aria-hidden>
          man meets machine
        </p>
      </div>
    </section>
  );
}
