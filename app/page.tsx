import Link from "next/link";
import Image from "next/image";
import ScrollSteps from "@/components/ScrollSteps";
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

/* Brand colour, with the baked-in white plate taken off — see
   scripts/make-logo-marks.py; sources in assets/logos-source. Every one of
   these shipped as its mark printed on an opaque white rectangle, which is
   why the strip could not be made to work on both grounds with CSS alone.

   They sit on a white chip in both themes, because that is the ground they
   are drawn for: on near-black the navy in the i3c mark and the black in
   DPIIT simply disappear.

   `scale` sizes each one by eye rather than by height. A square mark and a
   3:1 wordmark set to the same height do not look the same size, because
   what the eye compares is closer to area; these sit about half way between
   equal height and equal area, which is where a mixed row settles. */
const RECOGNITION = [
  { src: "/logos/dpiit-colour.png", alt: "DPIIT, Startup India", width: 900, height: 336, scale: 1 },
  { src: "/logos/i3c-colour.png", alt: "Institute Incubation & Innovation Council", width: 492, height: 477, scale: 1.3 },
  { src: "/logos/msme-colour.png", alt: "Ministry of Micro, Small & Medium Enterprises", width: 284, height: 137, scale: 1.08 },
  { src: "/logos/startup_up-colour.png", alt: "Start in UP", width: 196, height: 77, scale: 1 },
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
        {/* Painted by CSS, not carried by an <img>.
        
            The point of the change is honest about its limits: it removes
            "Save image as" from the context menu, and that is all it removes.
            The file is still one line down in the Network tab, and a
            screenshot needs no tools at all. Anything a browser renders, the
            visitor already has. What this does buy is that the frame stops
            being an object on the page and becomes the surface — which is
            also why the art direction moves to a media query, where it
            belongs for a purely decorative image.

            Preloaded, with the same media conditions, so making it a
            background does not cost the first paint: without this the browser
            does not know about the file until it has parsed the stylesheet. */}
        <div className={styles.stage} aria-hidden>
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

        <div className={`shell ${styles.scrollCue}`} aria-hidden>
          <span className="label">Scroll</span>
          <span className={styles.cueLine} />
        </div>

        {/* The page still needs one, and the frame carries no text. Announced
            to a screen reader and to a crawler; drawn for nobody. */}
        <h1 className="sr-only">
          NAVRobotec — sovereign software for autonomous flight
        </h1>
      </section>

      {/* ---------------- the stack ----------------
          A descent, not a list. The section is a dark band that runs on from
          the hero — the same shot continuing — and it holds for four screens
          while the reader falls through the stack: VAYU at the top, silicon at
          the bottom, one layer to a screen. The index in the margin shows the
          whole depth the whole time, so the reader always knows where in the
          four they are and how much is left.

          Off the pinned path — no JavaScript, reduced motion, or a screen too
          narrow to hold it — the same four layers are simply listed down the
          band. See ScrollSteps. */}
      <section className={styles.stackSection}>
        <ScrollSteps className={styles.track}>
          <div className={styles.stackStage}>
            <div aria-hidden className="reticle" />

            <div className={`shell ${styles.stageInner}`}>
              <header className={styles.stackHead}>
                <p className="label">Four layers, all ours</p>
                <h2 className={styles.stackTitle}>
                  The aircraft rests on an operating system, which rests on the
                  silicon.
                </h2>
                <p className={styles.stackLede}>
                  Read it top to bottom. Each layer is ours, so each one can be
                  opened, measured and replaced without asking anybody.
                </p>
              </header>

              {/* The depth gauge. It repeats the tiers rather than owning
                  them, so it is hidden from the reading order — the slides
                  below carry the real content. */}
              <ol className={styles.depth} aria-hidden>
                {STACK.map((layer) => (
                  <li key={layer.tier} className={styles.depthItem} data-step-mirror>
                    <span className={styles.depthNode} />
                    <span className={`data ${styles.depthTier}`}>{layer.tier}</span>
                  </li>
                ))}
              </ol>

              <div className={styles.slides}>
                {STACK.map((layer) => (
                  <article
                    key={layer.tier}
                    className={styles.slide}
                    data-step-item
                  >
                    <span aria-hidden className={styles.ghost}>
                      {layer.tier}
                    </span>
                    <p className={`data ${styles.slideRole}`}>
                      <span className={styles.slideTier}>{layer.tier}</span>
                      {layer.role}
                    </p>
                    <h3 className={styles.slideName}>{layer.name}</h3>
                    <p className={styles.slideBody}>{layer.body}</p>
                    <ul className={styles.slideFacts}>
                      {layer.facts.map((fact) => (
                        <li key={fact} className={`data ${styles.fact}`}>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <p className={styles.stackAfter}>
                <Link href="/technology" className="btn btn-ghost">
                  Read the stack in full
                </Link>
              </p>
            </div>

            {/* How far through the descent. A hairline, at the foot of the
                frame, moving continuously rather than in four jumps. */}
            <div aria-hidden className={styles.scrub}>
              <span className={styles.scrubFill} />
            </div>
          </div>
        </ScrollSteps>
      </section>

      {/* ---------------- the claim ----------------
          Where the page comes up out of the descent, so it is the brightest
          ground on the page rather than the palest — it was tinted, arriving
          from near-black as a wash, and the recognition strip below it was
          near enough the same value that the two read as one grey slab. The
          tint has moved down to that strip, which is the one meant to
          recede. */}
      <section className="section">
        <div className="shell">
          <blockquote className={styles.quote}>
            <p className={styles.quoteText}>
              &ldquo;We are not building another autopilot. We are building the
              foundation — VaiOS, a sovereign, silicon-native runtime that
              belongs entirely to its operator. No black boxes. No foreign
              dependencies. Just pure, auditable control.&rdquo;
            </p>
            {/* The rule runs the whole measure and the attribution sits
                under it: it gives the block a bottom edge, and it gives the
                right half of the frame something to hold. */}
            <footer className={styles.attrib}>
              <span className={styles.attribWho}>
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
              </span>
              <Link href="/team" className={styles.attribLink}>
                Meet the team
                <span aria-hidden>→</span>
              </Link>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ---------------- recognition ---------------- */}
      <section className="section-tight tinted rule">
        <div className="shell">
          <p className={`label ${styles.recognitionLabel}`}>
            Recognised by
          </p>
          {/* A static row, not a marquee. Four logos fit; scrolling them made
              a fixed list look like a longer one. */}
          <ul className={styles.logos}>
            {RECOGNITION.map((logo) => (
              <li key={logo.alt} className={styles.logoChip}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={styles.logo}
                  style={{ "--scale": logo.scale } as React.CSSProperties}
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
