import Link from "next/link";
import styles from "./page.module.css";

/* The terms of the X427 free board offer, and nothing wider.
 *
 * Only facts the offer states are written as facts. Everything else is a
 * visible TO CONFIRM blank for the owner to fill before this ships; none of it
 * is invented. Plain language, not legal advice. */

export const metadata = {
  title: "Free board offer terms",
  description:
    "Terms of the NAVIX X427 free board offer for the first 50 college students on the waitlist.",
  alternates: { canonical: "/waitlist/terms" },
};

const Tc = ({ children }: { children: string }) => (
  <mark className={styles.tc}>[TO CONFIRM: {children}]</mark>
);

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

          <h2 className="h3">Still being decided</h2>
          <ul className={styles.list}>
            <li>
              Shipping, delivery and who pays for it: <Tc>shipping terms</Tc>
            </li>
            <li>
              Countries or regions the offer covers: <Tc>eligible regions</Tc>
            </li>
            <li>
              Deadline for claiming the offer: <Tc>deadline</Tc>
            </li>
            <li>
              How student status is checked: <Tc>verification method</Tc>
            </li>
            <li>
              What happens after the first 50 students: <Tc>over-50 handling</Tc>
            </li>
            <li>
              How your details are used and how we contact you:{" "}
              <Tc>data use and contact</Tc>
            </li>
            <li>
              Whether the offer can be changed or withdrawn:{" "}
              <Tc>change or withdrawal terms</Tc>
            </li>
          </ul>

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
