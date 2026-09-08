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
 * The choice is remembered, but it applies here rather than site-wide: the
 * rest of the site is a light page with dark bands composed into it, and
 * turning that dark inverts the composition instead of re-theming it. See
 * ThemeToggle, whose own mount and unmount are what scope it.
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
