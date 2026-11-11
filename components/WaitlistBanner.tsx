"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWaitlist } from "./WaitlistProvider";
import { bannerDismissed, dismissBanner, isWaitlisted } from "@/lib/waitlist";
import styles from "./WaitlistBanner.module.css";

/* The slim strip above the nav.
 *
 * It is always in the server HTML at a fixed height (--banner-h), and the nav
 * and --bar are offset by that same variable, so nothing moves when the page
 * hydrates. It is hidden by html[data-wl-banner="off"], which BANNER_SCRIPT
 * sets before first paint when it has been dismissed, the visitor has joined,
 * or the page is /waitlist, and which this component keeps in step afterwards
 * (client navigation, dismissal, joining). */

export const BANNER_SCRIPT = `try{var l=localStorage,p=location.pathname;if(l.getItem("navrobotec.waitlisted")!==null||l.getItem("navrobotec.waitlistBannerDismissed")!==null||p==="/waitlist"||p.indexOf("/waitlist/")===0)document.documentElement.dataset.wlBanner="off"}catch(e){if(location.pathname==="/waitlist")document.documentElement.dataset.wlBanner="off"}`;

export default function WaitlistBanner() {
  const pathname = usePathname();
  const { openWaitlist } = useWaitlist();

  useEffect(() => {
    const off =
      pathname === "/waitlist" || isWaitlisted() || bannerDismissed();
    if (off) document.documentElement.dataset.wlBanner = "off";
    else delete document.documentElement.dataset.wlBanner;
  }, [pathname]);

  return (
    <div className={styles.banner} data-wl-banner-el role="region" aria-label="X427 free board offer">
      <span className={styles.dot} aria-hidden />
      <p className={styles.text}>
        <strong>FREE X427 board</strong>
        <span className={styles.long}> for the first 50 college students</span>
        <span className={styles.short}> · first 50</span>
        <span className={styles.long}>
          <span aria-hidden> · </span>offer ends 31 Dec
        </span>
      </p>
      <button type="button" className={styles.join} onClick={openWaitlist}>
        Claim yours
      </button>
      <button
        type="button"
        className={styles.close}
        aria-label="Dismiss"
        onClick={() => {
          dismissBanner();
          document.documentElement.dataset.wlBanner = "off";
        }}
      >
        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
          <path d="M2 2l10 10M12 2 2 12" />
        </svg>
      </button>
    </div>
  );
}
