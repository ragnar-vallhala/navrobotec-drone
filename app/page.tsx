import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

/* The homepage.
 *
 * A server component with no motion library. The old one was a client
 * component whose sections used `viewport: { once: false, amount: 0.3 }` —
 * a section taller than the viewport can never be 30% visible, so it never
 * animated in and sat at opacity 0 permanently. Half the page was invisible.
 * Entrances here are CSS, they start from visible, and nothing on the page
 * depends on a frame arriving.
 *
 * The hero is the company's own numbers rather than a video. What was there
 * was 4.3 MB of stock footage of a bird on a railing, which says nothing
 * about a hard real-time flight stack and left the first screen blank until
 * it loaded. A 1 kHz loop and a 5.9 µs task-wake say considerably more.
 */

export const metadata = {
  title: "Sovereign software for autonomous flight",
};

const STACK = [
  {
    tier: "L3",
    name: "VAYU",
    role: "Flight application",
    body: "The aircraft itself — reading its sensors, estimating attitude, running the control loops, driving the motors.",
    facts: ["Cascaded PID", "1 kHz / 250 Hz loops", "Fail-safe recovery"],
  },
  {
    tier: "L2",
    name: "VaiOS",
    role: "Real-time operating system",
    body: "The core that decides what runs and when, holding the control loop to a fixed schedule every cycle.",
    facts: ["Preemptive kernel", "~5.9 µs task-wake", "Benchmarked vs FreeRTOS & Zephyr"],
  },
  {
    tier: "L1",
    name: "NavHAL",
    role: "Hardware abstraction layer",
    body: "Speaks straight to the silicon and hides the differences between chips, so the same flight code moves to new hardware untouched.",
    facts: ["~5-cycle GPIO", "Register-level, zero-cost", "STM32F4 · H7 · AVR"],
  },
  {
    tier: "L0",
    name: "Silicon",
    role: "The board it flies on",
    body: "The physical hardware the whole stack runs on — a reference board today, in-house boards next.",
    facts: ["STM32F401RE", "Cortex-M4F @ 84 MHz", "BMX160 IMU >1.5 kHz"],
  },
];

const FOCUS = [
  {
    image: "/images/in-house.jpg",
    title: "Sovereign foundation",
    body: "We own every layer — NavHAL at the hardware, VaiOS as the operating system, VAYU in the air. No black boxes, no foreign dependencies: a stack you can audit from the first register.",
  },
  {
    image: "/images/autonomous.jpg",
    title: "Real-time reliability",
    body: "A flight core that never misses its deadline. VaiOS holds the control loop to a fixed schedule every cycle — benchmarked head to head against FreeRTOS and Zephyr on the same hardware.",
  },
  {
    image: "/images/swarm.webp",
    title: "Built to grow",
    body: "Autonomy and swarms are not bolted on — they are how VaiOS is designed to scale, from one aircraft to many. UAVs come first because that is where we prove it.",
  },
];

const JOIN = [
  {
    who: "Developers",
    body: "Contribute to the core layers of VaiOS, from NavHAL up. Build on a stack you can read, audit and extend down to the register.",
    href: "/docs",
    cta: "Read the docs",
  },
  {
    who: "Manufacturers",
    body: "Co-develop custom hardware, or join the pilot programme to put a sovereign runtime in your fleet.",
    href: "/contact",
    cta: "Talk to us",
  },
  {
    who: "Investors",
    body: "Back the work of taking high-grade autonomous navigation out of foreign black boxes and into something auditable.",
    href: "/investors",
    cta: "The case",
  },
];

const RECOGNITION = [
  { src: "/logos/dpiit.png", alt: "DPIIT", width: 1969, height: 655 },
  { src: "/logos/i3c.png", alt: "I3C", width: 512, height: 512 },
  { src: "/logos/msme.png", alt: "MSME", width: 367, height: 137 },
  { src: "/logos/startup_up.png", alt: "Startup UP", width: 512, height: 512 },
];

export default function Home() {
  return (
    <div className="page-flush">
      {/* ---------------- hero ---------------- */}
      <section className={`band ${styles.hero}`}>
        {/* An establishing shot: the aircraft alone, nothing written across
            it. Text over an image always costs the image — a scrim heavy
            enough to make words legible is heavy enough to flatten the fog
            this render is mostly made of. The words come after, on flat
            ground, where they can be read without taking anything away.

            `priority` because this is the first screen — without it Next
            lazy-loads it and the page opens on an empty box, which is the
            fault the old video hero had. */}
        <div className={styles.stage} aria-hidden>
          <Image
            src="/images/vayu-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          {/* Only at the foot, so the frame dissolves into the band instead of
              ending on a hard edge. */}
          <div className={styles.fade} />
        </div>

        {/* Only the two ways in. The frame says what this is; a headline,
            a paragraph and four figures underneath it were the page
            explaining a picture that did not need explaining.

            The numbers are not lost — the same four open /technology, where
            they are the subject rather than a caption. */}
        <div className={`shell ${styles.heroActions}`}>
          <Link href="/technology" className="btn btn-primary">
            The stack
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Join the mission
          </Link>
        </div>

        {/* The page still needs one, and the frame carries no text. Announced
            to a screen reader and to a crawler; drawn for nobody. */}
        <h1 className="sr-only">
          NAVRobotec — sovereign software for autonomous flight
        </h1>
      </section>

      {/* ---------------- the stack ---------------- */}
      <section className="section rule">
        <div className="shell">
          <header className={styles.head}>
            <p className="label">Four layers, all ours</p>
            <h2 className="h1">
              The aircraft rests on an operating system, which rests on the
              silicon.
            </h2>
            <p className="lede">
              Read it top to bottom. Each layer is ours, so each one can be
              opened, measured and replaced without asking anybody.
            </p>
          </header>

          <ol className={styles.stack}>
            {STACK.map((layer) => (
              <li key={layer.tier} className={styles.layer}>
                <span className={`data ${styles.tier}`}>{layer.tier}</span>
                <div className={styles.layerBody}>
                  <h3 className="h3">
                    {layer.name}
                    <span className={styles.layerRole}>{layer.role}</span>
                  </h3>
                  <p className="body small">{layer.body}</p>
                </div>
                <ul className={styles.facts}>
                  {layer.facts.map((fact) => (
                    <li key={fact} className={`data ${styles.fact}`}>
                      {fact}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <p className={styles.after}>
            <Link href="/technology" className="btn btn-ghost">
              Read the stack in full
            </Link>
          </p>
        </div>
      </section>

      {/* ---------------- the claim ---------------- */}
      <section className={`section tinted ${styles.quoteSection}`}>
        <div className="shell">
          <blockquote className={styles.quote}>
            <p className={styles.quoteText}>
              &ldquo;We are not building another autopilot. We are building the
              foundation — VaiOS, a sovereign, silicon-native runtime that
              belongs entirely to its operator. No black boxes. No foreign
              dependencies. Just pure, auditable control.&rdquo;
            </p>
            <footer className={styles.attrib}>
              <Image
                src="/images/nipun.jpeg"
                alt=""
                width={56}
                height={56}
                className={styles.avatar}
              />
              <span>
                <span className={styles.attribName}>Nipun Singh</span>
                <span className={`label ${styles.attribRole}`}>
                  Founder &amp; Director
                </span>
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ---------------- recognition ---------------- */}
      <section className="section-tight rule">
        <div className="shell">
          <p className={`label ${styles.recognitionLabel}`}>
            Recognised by
          </p>
          {/* A static row, not a marquee. Four logos fit; scrolling them made
              a fixed list look like a longer one. */}
          <ul className={styles.logos}>
            {RECOGNITION.map((logo) => (
              <li key={logo.alt}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={styles.logo}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- focus ---------------- */}
      <section className="section rule">
        <div className="shell">
          <header className={styles.head}>
            <p className="label">Our focus</p>
            <h2 className="h1">Own every layer, and prove it.</h2>
          </header>
          <div className={styles.focus}>
            {FOCUS.map((card) => (
              <article key={card.title} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width: 62rem) 100vw, 33vw"
                    className={styles.cardImg}
                  />
                </div>
                <h3 className="h3">{card.title}</h3>
                <p className="body small">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- join ---------------- */}
      <section className="section rule">
        <div className="shell">
          <header className={styles.head}>
            <p className="label">Join the mission</p>
            <h2 className="h1">Three ways in.</h2>
          </header>
          <div className={styles.join}>
            {JOIN.map((route) => (
              <article key={route.who} className={styles.route}>
                <h3 className="h3">{route.who}</h3>
                <p className="body small">{route.body}</p>
                <Link href={route.href} className={styles.routeLink}>
                  {route.cta}
                  <span aria-hidden> →</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- closing ---------------- */}
      <section className={`band ${styles.closing}`}>
        <div className="reticle" aria-hidden />
        <div className={`shell ${styles.closingInner}`}>
          {/* "The future of autonomy is here" says nothing and asks for
              nothing. This says what you can actually do next. */}
          <p className="label label-signal">Next</p>
          <h2 className="display">Read it before you trust it.</h2>
          <p className={`lede ${styles.closingLede}`}>
            The technical report, the per-layer guides, and the benchmarks
            against FreeRTOS and Zephyr are all public. Start there — or write
            to us about putting the runtime in your fleet.
          </p>
          <div className={styles.closingActions}>
            <Link href="/docs" className="btn btn-primary">
              Read the docs
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
