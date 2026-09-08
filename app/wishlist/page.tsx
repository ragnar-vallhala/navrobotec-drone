import Link from "next/link";
import Cinematic from "@/components/Cinematic";
import EnquiryForm from "@/components/EnquiryForm";
import styles from "./page.module.css";

/* What we intend to build, and a way to say you want one.
 *
 * Deliberately not a product page. Nothing here has a price, a date or a
 * photograph, because none of it has shipped — and a render of an unbuilt
 * board next to specifications reads as a catalogue entry however carefully
 * the copy is worded. The frame is the plain Cinematic band for the same
 * reason: a stock photograph of somebody else\u2019s flight controller at the top
 * of a page about ours would be the one misleading thing on it.
 *
 * What each item can honestly carry is the part it is built around. The MCU
 * figures below are the manufacturer\u2019s, not ours: they describe the silicon
 * that has been chosen, not performance anyone has measured on a finished
 * board. Everything that would be a claim about our own hardware is absent
 * until there is hardware to measure.
 */

export const metadata = {
  title: "Wishlist",
  description:
    "The hardware NAVRobotec intends to build around VaiOS: two flight controllers and a sub-250 g airframe. Nothing is shipping yet — tell us which you would want.",
};

/* `interest` must match kInterests in api/src/domain/Enquiry.cc, or the chip
   is dropped on the way in and the signal is lost. */
const ITEMS = [
  {
    id: "01",
    name: "Flight controller",
    /* STM32F446RE: Cortex-M4F at 180 MHz, 512 KB flash, 128 KB SRAM. ST\u2019s
       figures for the part, not ours for a board. */
    mcu: "STM32F446",
    role: "The workhorse",
    body: "The board VaiOS and NavHAL are developed against today, taken from a reference design to something we make. Same Cortex-M4 family as the STM32F401 the benchmarks were run on, with the headroom that the extra clock and memory buy.",
    facts: ["Cortex-M4F @ 180 MHz", "512 KB flash · 128 KB SRAM", "NavHAL port exists"],
    interest: "Flight controller (F446)",
  },
  {
    id: "02",
    name: "Flight controller",
    /* NOTE: this was given as "H767", which is not a part ST makes — their H7
       line runs H723/H725/H730/H735/H742/H743/H745/H747/H750/H753/H755/H757.
       H743 is the one flight controllers are usually built on, so it is here
       as the likely reading. If it should be H747 (dual-core) or another,
       this string and the two figures under it are the whole change. */
    mcu: "STM32H743",
    role: "The one with room",
    body: "A Cortex-M7 part for the work the M4 runs out of headroom for: tighter loops, more estimation, more sensors on the bus at once. The point of owning NavHAL is that the flight code above it does not change when the chip does.",
    facts: ["Cortex-M7 @ 480 MHz", "2 MB flash · 1 MB RAM", "Double-precision FPU"],
    interest: "Flight controller (H7)",
  },
  {
    id: "03",
    name: "Sub-250 g airframe",
    mcu: null,
    role: "The one you can fly",
    body: "A complete aircraft under 250 grams, flying our own stack rather than somebody else\u2019s. Under 250 g is the nano class in India\u2019s Drone Rules, 2021 — the lightest of the five weight categories, and the one that makes an aircraft straightforward to put in the air for a demonstration or a trial.",
    facts: ["< 250 g all-up", "Nano class, Drone Rules 2021", "VaiOS + VAYU throughout"],
    interest: "Sub-250 g airframe",
  },
];

export default function Wishlist() {
  return (
    <div className="page-flush">
      <Cinematic
        kicker="Wishlist"
        title={<>What we want to build next.</>}
        lede="Two flight controllers and an aircraft light enough to fly almost anywhere. None of it is shipping, none of it has a date — this page exists so that what gets built first is what people actually asked for."
      />

      <section className="section">
        <div className="shell">
          <ol className={styles.items}>
            {ITEMS.map((item) => (
              <li key={item.interest} className={styles.item}>
                <p className={`data ${styles.index}`}>{item.id}</p>

                <div className={styles.body}>
                  <h2 className="h2">
                    {item.name}
                    {item.mcu ? (
                      <span className={`data ${styles.mcu}`}>{item.mcu}</span>
                    ) : null}
                  </h2>
                  <p className={`label ${styles.role}`}>{item.role}</p>
                  <p className="body">{item.body}</p>

                  <ul className={styles.facts}>
                    {item.facts.map((fact) => (
                      <li key={fact} className={`data ${styles.fact}`}>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          {/* Said once, plainly, rather than hedged into every paragraph
              above. The figures beside the boards are the chip makers\u2019 —
              what the silicon does, not what a finished board of ours has
              been measured doing. */}
          <p className={`small muted ${styles.caveat}`}>
            Nothing on this page is a product, a price or a promise. The
            figures are the manufacturers\u2019 for the parts chosen; anything
            measured on our own hardware is in{" "}
            <Link href="/docs/report/vaios/vaios-performance" className={styles.link}>
              the benchmark
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section rule tinted">
        <div className="shell">
          <header className={styles.head}>
            <p className="label">Register interest</p>
            <h2 className="h1">Tell us which one.</h2>
            <p className="lede">
              What gets built first is decided by who is waiting for it. No
              obligation, and no mailing list — this reaches an engineer, and
              the reply comes from one.
            </p>
          </header>

          <div className={styles.formCol}>
            <EnquiryForm
              source="wishlist"
              fields={[
                { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
                { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
                { name: "company", label: "Company or team", type: "text", autoComplete: "organization", wide: true },
              ]}
              interests={{
                legend: "Which of these",
                options: ITEMS.map((item) => item.interest),
              }}
              message={{
                label: "What would you use it for?",
                placeholder:
                  "The aircraft, the payload, the environment, how many — whatever would help us build the right one first.",
                rows: 5,
              }}
              submit="Register interest"
              done={{
                title: "Thank you — that reached us.",
                body: "You are on the list for it. We write when there is something real to show, not before.",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
