import Image from "next/image";
import Link from "next/link";
import Cinematic from "@/components/Cinematic";
import styles from "./page.module.css";

/* Was a client component whose only use of JavaScript was to fade three cards
   in on scroll. The cards are now three rows in the page, and the page ships
   nothing. */

export const metadata = {
  title: "Team",
  description:
    "The three founders of NAVRobotec, and which layer of the flight stack each of them answers for.",
};

const TEAM = [
  {
    name: "Nipun Singh",
    role: "Founder & Director",
    owns: "Strategy · operations",
    photo: "/images/nipun.jpeg",
    body: "Leads the strategic direction and operations of NAVRobotec. Focused on scaling autonomous intelligence and establishing a foundation for secure, independent aviation.",
  },
  {
    name: "Ashutosh Vishwakarma",
    role: "Founder & Core Hardware",
    owns: "VaiOS · NavHAL · control",
    photo: "/images/Ashutosh.jpeg",
    body: "Embedded systems developer and controls theory specialist. Responsible for the VaiOS architecture, the NavHAL implementation, and the core flight stabilisation logic.",
  },
  {
    name: "Vibhu Gupta",
    role: "Founder & Director",
    owns: "Perception · swarm",
    photo: "/images/vibhu.png",
    body: "Specialises in computer vision and collaborative swarm intelligence. Building the perception layers and the multi-agent coordination protocols for the Vayu stack.",
  },
];

export default function Team() {
  return (
    <div className="page-flush">
      <Cinematic
        kicker="The team"
        title={<>Three founders, one stack.</>}
        lede="Every layer between the register and the air has somebody who answers for it. Here is who."
      />

      <section className="section">
        <div className="shell">
          {/* A list, not a grid of cards. Three people read as three people;
              three boxes read as a directory with two thirds missing. */}
          <ul className={styles.people}>
            {TEAM.map((person) => (
              <li key={person.name} className={styles.person}>
                <Image
                  src={person.photo}
                  alt=""
                  width={96}
                  height={96}
                  className={styles.photo}
                />
                <div className={styles.who}>
                  <h2 className="h3">{person.name}</h2>
                  <p className={`label ${styles.role}`}>{person.role}</p>
                  <p className="body small">{person.body}</p>
                </div>
                <p className={`data ${styles.owns}`}>{person.owns}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`band ${styles.closing}`}>
        <div className="reticle" aria-hidden />
        <div className={`shell ${styles.closingInner}`}>
          <p className="label label-signal">Working on it too</p>
          <h2 className="h1">The stack is open to read, and to build on.</h2>
          <div className={styles.actions}>
            <Link href="/docs" className="btn btn-primary">
              Read the docs
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
