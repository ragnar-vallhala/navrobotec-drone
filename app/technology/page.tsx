import Link from "next/link";
import type { Metadata } from "next";
import tech from "./technology.module.css";
import Cinematic from "@/components/Cinematic";

export const metadata: Metadata = {
  title: "Technology | NAVRobotec",
  description:
    "The VaiOS stack, explained. NavHAL speaks to the silicon, VaiOS runs the real-time core, and VAYU flies on top — a sovereign flight stack built from the register up.",
};

const readout = [
  { num: "1 kHz", label: "Real-time control loop" },
  { num: "~5.9 µs", label: "Task-wake latency" },
  { num: "0", label: "Foreign flight-critical deps" },
  { num: "4 layers", label: "Owned, silicon to sky" },
];

const layers = [
  {
    name: "VAYU",
    role: "Flight application",
    blurb:
      "The aircraft itself — reading its sensors, estimating attitude, running the control loops, and driving the motors.",
    chips: ["Cascaded PID", "1 kHz / 250 Hz loops", "Complementary + Mahony", "Fail-safe recovery"],
  },
  {
    name: "VaiOS",
    role: "Real-time operating system",
    blurb:
      "The core that decides what runs and when, holding the control loop to a fixed schedule every cycle. This is the layer built to grow.",
    chips: ["Preemptive kernel", "~5.9 µs task-wake", "Benchmarked vs FreeRTOS & Zephyr"],
  },
  {
    name: "NavHAL",
    role: "Hardware abstraction layer",
    blurb:
      "Speaks straight to the silicon and hides the differences between chips — so the same flight code moves to new hardware untouched.",
    chips: ["~5-cycle GPIO", "Register-level, zero-cost", "STM32F4 · H7 · AVR"],
  },
  {
    name: "Silicon",
    role: "The board it flies on",
    blurb:
      "The physical hardware the whole stack runs on — a reference board today, in-house boards next.",
    chips: ["STM32F401RE", "Cortex-M4F @ 84 MHz", "BMX160 IMU >1.5 kHz"],
  },
];

export default function Technology() {
  return (
    <div className="page-flush">
      <Cinematic
        src="/images/frame-technology.jpg"
        focus="center 62%"
        kicker="The stack"
        title={<>Four layers, all ours.</>}
        lede="One sovereign runtime, built from the silicon up — from the register NavHAL writes to, up to the aircraft VAYU flies."
      />

      <section className="section rule">
        <div className="shell">
          {/* The readout, where these figures are the subject rather than a
              caption — which is why the homepage no longer carries them. */}
          <dl className={tech.readout}>
            {readout.map((r) => (
              <div key={r.num + r.label} className={tech.reading}>
                <dt className={`data ${tech.readingValue}`}>{r.num}</dt>
                <dd className={`label ${tech.readingLabel}`}>{r.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section rule">
        <div className="shell">
          <div className={tech.split}>
            <div>
              <p className="label">The principle</p>
              <h2 className="h1">Own every layer.</h2>
            </div>
            <p className="lede">
              Most flight software is stacked on borrowed frameworks that nobody
              fully controls. We took the opposite path. From the chip to the
              sky, every layer is ours — so there are no black boxes, no foreign
              dependencies, and nothing in the flight path we cannot read, test
              and trust.
            </p>
          </div>
        </div>
      </section>

      {/* The spine of the page: four rows, read top to bottom, the numbering
          carrying the structure so no connector graphics are needed to
          explain it. */}
      <section className="section rule tinted">
        <div className="shell">
          <header className={tech.head}>
            <p className="label">The stack</p>
            <h2 className="h1">Four layers, all ours.</h2>
            <p className="lede">
              The aircraft rests on an operating system, which rests on a
              hardware layer, which rests on the silicon. Read it top to bottom
              — VAYU in the air, down to the register.
            </p>
          </header>

          <ol className={tech.stack}>
            {layers.map((l, i) => (
              <li key={l.name} className={tech.layer}>
                <span className={`data ${tech.tier}`}>
                  L{layers.length - 1 - i}
                </span>
                <div className={tech.layerBody}>
                  <h3 className="h3">
                    {l.name}
                    <span className={tech.layerRole}>{l.role}</span>
                  </h3>
                  <p className="body small">{l.blurb}</p>
                </div>
                <ul className={tech.chips}>
                  {l.chips.map((c) => (
                    <li key={c} className={`data ${tech.chip}`}>
                      {c}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section rule">
        <div className="shell">
          <div className={tech.split}>
            <div>
              <p className="label">The horizon</p>
              <h2 className="h1">Built to grow.</h2>
            </div>
            <p className="lede">
              Today the stack flies a drone. The same runtime is designed to
              coordinate many aircraft, and to reach beyond drones as it
              matures. UAVs come first because that is where we are proving it —
              getting the hard real-time core right is what earns the right to
              carry it further.
            </p>
          </div>
        </div>
      </section>

      <section className={`band ${tech.closing}`}>
        <div className="reticle" aria-hidden />
        <div className={`shell ${tech.closingInner}`}>
          <p className="label label-signal">Next</p>
          <h2 className="h1">The report, the guides, the benchmarks.</h2>
          <p className="lede">
            All of it is public — including the head-to-head against FreeRTOS
            and Zephyr on the same hardware.
          </p>
          <div className={tech.actions}>
            <Link href="/docs" className="btn btn-primary">
              Read the documentation
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
