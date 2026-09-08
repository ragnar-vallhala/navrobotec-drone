import ThemeToggle from "./ThemeToggle";
import styles from "./ReadingBar.module.css";

/* The strip above long-form pages.
 *
 * The theme toggle lives here rather than in the site header because this is
 * where it is worth having: blogs and docs are where a reader sits for more
 * than a minute and actually has a preference. Putting it in the header would
 * offer it on a landing page nobody reads for five minutes, and take space
 * from the navigation on every one of them.
 *
 * The choice still applies site-wide once made — a setting that quietly stops
 * working when you navigate is worse than not offering one.
 */
export default function ReadingBar() {
  return (
    <div className={styles.bar}>
      <div className={`shell ${styles.inner}`}>
        <p className={`label ${styles.hint}`}>Reading view</p>
        <ThemeToggle />
      </div>
    </div>
  );
}
