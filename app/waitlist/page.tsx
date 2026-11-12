import Cinematic from "@/components/Cinematic";
import { WaitlistForm } from "@/components/WaitlistDialog";
import { WAITLIST_LEDE } from "@/lib/waitlist";
import BoardPhoto from "@/components/BoardPhoto";
import { PRODUCT_MEDIA } from "@/lib/product-media";
import Link from "next/link";
import styles from "./page.module.css";

/* The X427 waitlist as a page of its own: the same form, copy and rules as
   the dialog, inline, so it can be linked, indexed and shared. The auto popup
   and the top banner are off here (see WaitlistPopup and WaitlistBanner). */

export const metadata = {
  title: "X427 waitlist",
  description:
    "Join the NAVIX X427 waitlist. Open to everyone; the first 50 college students on the waitlist receive a free board, first come, first served.",
  alternates: { canonical: "/waitlist" },
};

export default function Waitlist() {
  return (
    <div className="page-flush">
      <Cinematic
        kicker="Waitlist"
        title={<>Join the X427 waitlist.</>}
        lede={WAITLIST_LEDE}
      />
      <section className="section">
        <div className="shell">
          <div className={styles.layout}>
            <div className={styles.col}>
              <WaitlistForm />
            </div>
            <aside className={styles.side} aria-label="About the waitlist">
              <span className={styles.sidePhoto}>
                <BoardPhoto shot={PRODUCT_MEDIA.x427.hero} sizes="(max-width: 62rem) 100vw, 26rem" />
              </span>
              <p className="label label-signal">What you get</p>
              <ul className={styles.sideList}>
                <li>
                  <strong>Word when boards are available.</strong> Join the
                  waitlist to hear when the X427 is ready.
                </li>
                <li>
                  <strong>A free board, if you are one of the first 50 college
                  students.</strong> First come, first served.{" "}
                  <Link href="/waitlist/terms">Offer terms</Link>.
                </li>
                <li>
                  <strong>An engineer, if you have questions.</strong> Write to{" "}
                  <a href="mailto:support@navrobotec.com">support@navrobotec.com</a>.
                </li>
              </ul>
              <Link href="/products/x427" className={styles.sideLink}>
                See the X427 specifications &rarr;
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
