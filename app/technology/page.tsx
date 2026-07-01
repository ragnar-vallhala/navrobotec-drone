import Link from "next/link";
import { Fragment } from "react";
import type { Metadata } from "next";
import { Navigation, Activity, Microchip, Cpu } from "lucide-react";
import styles from "../shared.module.css";
import tech from "./technology.module.css";

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
    icon: Navigation,
    blurb:
      "The aircraft itself — reading its sensors, estimating attitude, running the control loops, and driving the motors.",
    chips: ["Cascaded PID", "1 kHz / 250 Hz loops", "Complementary + Mahony", "Fail-safe recovery"],
  },
  {
    name: "VaiOS",
    role: "Real-time operating system",
    icon: Activity,
    blurb:
      "The core that decides what runs and when, holding the control loop to a fixed schedule every cycle. This is the layer built to grow.",
    chips: ["Preemptive kernel", "~5.9 µs task-wake", "Benchmarked vs FreeRTOS & Zephyr"],
  },
  {
    name: "NavHAL",
    role: "Hardware abstraction layer",
    icon: Microchip,
    blurb:
      "Speaks straight to the silicon and hides the differences between chips — so the same flight code moves to new hardware untouched.",
    chips: ["~5-cycle GPIO", "Register-level, zero-cost", "STM32F4 · H7 · AVR"],
  },
  {
    name: "Silicon",
    role: "The board it flies on",
    icon: Cpu,
    blurb:
      "The physical hardware the whole stack runs on — a reference board today, in-house boards next.",
    chips: ["STM32F401RE", "Cortex-M4F @ 84 MHz", "BMX160 IMU >1.5 kHz"],
  },
];

export default function Technology() {
  return (
    <div className={styles.container}>
      <div className={styles.standardContainer}>
        <div className={styles.headerArea}>
          <h1>
            The <span className={styles.gradientText}>Stack.</span>
          </h1>
          <p>One sovereign runtime, built from the silicon up.</p>
        </div>

        {/* Instrument readout */}
        <div className={tech.readout}>
          {readout.map((r) => (
            <div key={r.num + r.label} className={tech.readoutItem}>
              <div className={tech.readoutNum}>{r.num}</div>
              <div className={tech.readoutLabel}>{r.label}</div>
            </div>
          ))}
        </div>

        {/* Philosophy */}
        <section className={styles.section} style={{ marginTop: "7rem" }}>
          <h2>Own Every Layer</h2>
          <p>
            Most flight software is stacked on borrowed frameworks that nobody
            fully controls. We took the opposite path. From the chip to the sky,
            every layer of our stack is ours — so there are no black boxes, no
            foreign dependencies, and nothing in the flight path we cannot read,
            test, and trust.
          </p>
        </section>

        {/* The layered stack — the spine of the page */}
        <section className={styles.section}>
          <h2>Four Layers, All Ours</h2>
          <p>
            The aircraft rests on an operating system, which rests on a hardware
            layer, which rests on the silicon. Read it top to bottom — VAYU in
            the air down to the register.
          </p>
          <div className={tech.stack}>
            {layers.map((l, i) => {
              const Icon = l.icon;
              return (
              <Fragment key={l.name}>
                <div className={tech.layer}>
                  <div>
                    <div className={tech.layerTop}>
                      <span className={tech.layerIcon}>
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                      <span className={tech.layerIndex}>
                        L{layers.length - 1 - i}
                      </span>
                    </div>
                    <div className={tech.layerName}>{l.name}</div>
                    <div className={tech.layerRole}>{l.role}</div>
                  </div>
                  <div>
                    <p className={tech.layerBlurb}>{l.blurb}</p>
                    <div className={tech.chips}>
                      {l.chips.map((c) => (
                        <span key={c} className={tech.chip}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {i < layers.length - 1 && <div className={tech.connector} />}
              </Fragment>
              );
            })}
          </div>
        </section>

        {/* Horizon */}
        <section className={styles.section}>
          <h2>Built to Grow</h2>
          <p>
            Today the stack flies a drone. The same runtime is designed to
            coordinate many aircraft, and to reach beyond drones as it matures.
            UAVs come first because that is where we are proving it — getting the
            hard real-time core right is what earns the right to carry it
            further.
          </p>
        </section>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/docs" className={styles.ctaBtn}>
            Read the Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
