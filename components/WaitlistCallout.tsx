"use client";

import { useWaitlist } from "./WaitlistProvider";
import styles from "./WaitlistCallout.module.css";

/* The card at the end of a post or a docs page. Appended after the content,
   never inside it. */
export default function WaitlistCallout() {
  const { openWaitlist } = useWaitlist();
  return (
    <aside className={styles.card} aria-labelledby="wl-callout-title">
      <div>
        <p className="label label-signal">X427 waitlist</p>
        <h2 id="wl-callout-title" className={`h3 ${styles.title}`}>
          X427 waitlist is open
        </h2>
        <p className={`body small ${styles.text}`}>
          Open to everyone. The first 50 college students on the waitlist
          receive a free board, first come, first served.
        </p>
      </div>
      <button type="button" className="btn btn-primary" onClick={openWaitlist}>
        Join the waitlist
      </button>
    </aside>
  );
}
