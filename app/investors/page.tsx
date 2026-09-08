import Link from "next/link";
import Cinematic from "@/components/Cinematic";
import styles from "./page.module.css";

/* Was a client component whose only JavaScript faded a paragraph and an
   iframe in. Both are now just in the page. */

export const metadata = {
  title: "Investors",
  description:
    "NAVRobotec builds VaiOS, a sovereign robotics runtime engineered from the silicon up. Recognised by DPIIT, MSME and Startup UP.",
};

const FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLScSWAK8vBPcc8MIGL5Dj-n7z1xvVcFEy1YCE5jtWs7MDC8Hkg/viewform?embedded=true";

const POINTS = [
  {
    k: "The difference",
    v: "Depth, not features. Every layer of the flight stack is ours — NavHAL at the hardware, VaiOS as the operating system, VAYU in the air — with no foreign dependencies in the flight path.",
  },
  {
    k: "The beachhead",
    v: "UAVs, because hard real time is hardest to fake there. The same runtime is designed to reach further into robotics once the core is proved in the air.",
  },
  {
    k: "Recognition",
    v: "DPIIT, MSME and the Startup UP initiative.",
  },
];

export default function Investors() {
  return (
    <div className="page-flush">
      <Cinematic
        kicker="Investors"
        title={<>Backing a foundation, not a product.</>}
        lede="Most drone companies build on borrowed software. We build the foundation itself — VaiOS, a sovereign robotics runtime engineered from the silicon up."
      />

      <section className="section">
        <div className="shell">
          <dl className={styles.points}>
            {POINTS.map((point) => (
              <div key={point.k} className={styles.point}>
                <dt className="label">{point.k}</dt>
                <dd className={`body ${styles.pointBody}`}>{point.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section rule tinted">
        <div className="shell">
          <header className={styles.head}>
            <p className="label">Onboarding</p>
            <h2 className="h1">Tell us where you fit.</h2>
            <p className="lede">
              A few questions, so the first conversation starts somewhere
              useful.
            </p>
          </header>

          {/* A third-party form in a frame. Given a title, because a frame
              without one is announced as "frame" and nothing else, and a
              height that is generous rather than clipped — a scrollbar inside
              a scrollbar is how an embedded form gets abandoned. */}
          <div className={styles.frame}>
            <iframe
              src={FORM}
              title="Investor onboarding form"
              className={styles.iframe}
              loading="lazy"
            >
              Loading…
            </iframe>
          </div>

          <p className="note small muted">
            The form is hosted by Google. If it does not load —
            an extension or a network policy will do that —{" "}
            <Link href="/contact" className={styles.link}>
              write to us directly
            </Link>{" "}
            instead.
          </p>
        </div>
      </section>
    </div>
  );
}
