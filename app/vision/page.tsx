import Link from "next/link";
import Cinematic from "@/components/Cinematic";
import styles from "./page.module.css";

/* Rewritten from a client component whose every rule was an inline style with
   a hardcoded amber rgba in it. Nothing here is interactive, so nothing here
   needs to ship JavaScript. */

export const metadata = {
  title: "Vision",
  description:
    "Own every layer, hold it to hard real time, and prove it on UAVs before it grows further — why NAVRobotec builds the whole flight stack rather than assembling one.",
};

const PILLARS = [
  {
    n: "01",
    kicker: "Sovereign foundation",
    headline: "Built from the silicon up.",
    body: "Most flight software is stacked on borrowed frameworks nobody fully controls. We took the opposite path and built our own: NavHAL speaking directly to the hardware, VaiOS as the operating system above it, and VAYU flying on top. Every layer is ours.",
    why: "If you do not own the foundation, you do not own the mission. Owning every layer means there are no black boxes and no foreign dependencies — a stack you can read, audit and trust down to the last register.",
  },
  {
    n: "02",
    kicker: "Real-time reliability",
    headline: "A core that never misses.",
    body: "A flight controller is judged in microseconds. VaiOS runs the control loop on a fixed schedule, every cycle, without exception — and we have benchmarked it head to head against FreeRTOS and Zephyr on the same hardware to prove it. VAYU is that reliability in the air.",
    why: "An aircraft does not get a second chance. A system that is usually fast but occasionally stalls will still drop a drone, so we engineer for the worst case, not the average.",
  },
  {
    n: "03",
    kicker: "Built to grow",
    headline: "From one aircraft to many.",
    body: "Autonomy and swarms are not features bolted on at the end — they are how VaiOS is designed to scale. The same runtime that flies one aircraft is built to coordinate many, and to reach beyond drones as it matures. UAVs come first because that is where we are proving it.",
    why: "We are building a foundation, not a single product. Getting the hard real-time core right on a drone is what earns the right to carry it further.",
  },
];

export default function Vision() {
  return (
    <div className="page-flush">
      {/* No frame: the only landscape to hand is a blurred hillside with a
          speck of aircraft in it, which blown up to a full frame says less
          than the band does. */}
      <Cinematic
        kicker="The vision"
        title={
          <>
            If you do not own it,
            <br />
            you cannot trust it.
          </>
        }
        lede="Three commitments, in the order they have to be met: own every layer, hold it to hard real time, and prove it on an aircraft before carrying it further."
      />

      {PILLARS.map((pillar, i) => (
        <section
          key={pillar.n}
          className={`section ${i > 0 ? "rule" : ""} ${i % 2 ? "tinted" : ""}`}
        >
          <div className="shell">
            <div className={styles.pillar}>
              <p className={`data ${styles.n}`}>{pillar.n}</p>
              <div className={styles.pillarBody}>
                <p className="label">{pillar.kicker}</p>
                <h2 className={`h1 ${styles.headline}`}>{pillar.headline}</h2>
                <p className={`lede ${styles.body}`}>{pillar.body}</p>
                <div className={styles.why}>
                  <p className="label">Why it matters</p>
                  <p className={styles.whyBody}>{pillar.why}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className={`band ${styles.closing}`}>
        <div className="reticle" aria-hidden />
        <div className={`shell ${styles.closingInner}`}>
          <p className="label label-signal">Next</p>
          <h2 className="h1">See how the four layers fit together.</h2>
          <div className={styles.actions}>
            <Link href="/technology" className="btn btn-primary">
              The stack
            </Link>
            <Link href="/blogs" className="btn btn-ghost">
              Engineering journal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
