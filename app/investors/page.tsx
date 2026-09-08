import Cinematic from "@/components/Cinematic";
import EnquiryForm from "@/components/EnquiryForm";
import styles from "./page.module.css";

/* Was a client component whose only JavaScript faded a paragraph and an
   iframe in. */

export const metadata = {
  title: "Investors",
  description:
    "NAVRobotec builds VaiOS, a sovereign robotics runtime engineered from the silicon up. Recognised by DPIIT, MSME and Startup UP.",
};

/* Sectors, and the size of cheque. Both are stored as written — the labels
   have to match kInterests and kBudgets in api/src/domain/Enquiry.cc or the
   value is dropped on the way in. */
const SECTORS = [
  "Defence & security",
  "Industrial inspection",
  "Logistics & delivery",
  "Agriculture",
  "Deep-tech platform",
  "Not sector-specific",
];

const TICKETS = [
  "Under ₹50L",
  "₹50L – ₹2Cr",
  "₹2Cr – ₹10Cr",
  "₹10Cr+",
  "Depends on the round",
];

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
              Four questions, so the first conversation starts somewhere
              useful.
            </p>
          </header>

          {/* Was a Google form in an iframe: 78rem tall, a scrollbar inside a
              scrollbar, blocked outright by a fair number of corporate
              networks, and — the part that mattered — writing to a
              spreadsheet rather than to the enquiries table, so nothing it
              collected was ever visible beside everything else. */}
          <div className={styles.formCol}>
            <EnquiryForm
              source="investor"
              fields={[
                { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
                { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
                { name: "company", label: "Fund or organisation", type: "text", autoComplete: "organization", wide: true },
              ]}
              interests={{ legend: "Where you invest", options: SECTORS }}
              budget={{ legend: "Typical cheque", options: TICKETS }}
              message={{
                label: "What would you want to see first?",
                placeholder:
                  "The benchmark numbers, the board, the roadmap, a call — whatever would make the first conversation useful.",
                rows: 5,
              }}
              submit="Send"
              done={{
                title: "Thank you — that reached us.",
                body: "A founder reads these and writes the reply, usually within two working days.",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
