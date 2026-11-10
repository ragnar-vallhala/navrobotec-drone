import Cinematic from "@/components/Cinematic";
import { WaitlistForm } from "@/components/WaitlistDialog";
import { WAITLIST_LEDE } from "@/lib/waitlist";
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
          <div className={styles.col}>
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
}
