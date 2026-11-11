import Link from "next/link";
import styles from "./page.module.css";

/* The terms of the X427 free board offer, and nothing wider. Plain language,
 * not legal advice. */

export const metadata = {
  title: "Free board offer terms",
  description:
    "Terms of the NAVIX X427 free board offer for the first 50 college students on the waitlist.",
  alternates: { canonical: "/waitlist/terms" },
};

export default function WaitlistTerms() {
  return (
    <div className="page">
      <article className="section-tight">
        <div className={`shell ${styles.col}`}>
          <p className="label label-signal">X427 waitlist</p>
          <h1 className="h2">Free board offer terms</h1>
          <p className="body">
            These terms cover one thing: the free NAVIX X427 board offered to
            college students who join the X427 waitlist. They are written in
            plain language and are not legal advice.
          </p>

          <h2 className="h3">The offer</h2>
          <ul className={styles.list}>
            <li>
              The first 50 college students on the X427 waitlist receive a
              free X427 board.
            </li>
            <li>
              It is first come, first served. Your place is the time you signed
              up to the waitlist.
            </li>
            <li>
              You must give the name of your college or club when you sign up.
            </li>
            <li>One board per person.</li>
            <li>
              The board is for your own learning and project use.
            </li>
          </ul>

          <h2 className="h3">Shipping, eligibility and claiming</h2>
          <ul className={styles.list}>
            <li>
              Shipping: Navrobotec pays the shipping charge when it is under
              INR 500. If it is more than INR 500, you pay it and Navrobotec
              refunds up to INR 500.
            </li>
            <li>
              The offer covers every region India Post can deliver to.
            </li>
            <li>The offer closes on 31 December 2026.</li>
            <li>
              Students selected for a free board must submit their student ID.
            </li>
          </ul>

          <h2 className="h3">Your details</h2>
          <p className="body">
            We collect your email address when you join the waitlist and use it
            to contact you.
          </p>

          <h2 className="h3">Changes</h2>
          <p className="body">
            All rights over the rules and terms of this offer rest with
            Navrobotec.
          </p>

          <p className="body small">
            Questions: write to{" "}
            <a href="mailto:support@navrobotec.com">support@navrobotec.com</a>.
          </p>
          <p>
            <Link href="/waitlist" className="btn btn-primary">
              Join the waitlist
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}
