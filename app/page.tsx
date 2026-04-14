import Link from 'next/link';
import styles from './page.module.css';
import DroneModel from '../components/DroneModel';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <DroneModel />

        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span>Mastering Autonomy</span>
            <span>With</span>
            <span className={styles.greyText}>Vayu Stack.</span>
          </h1>
          <p className={styles.subtext}>
            The only indigenous drone flight control system that gives you the keys to the hardware. Built from the silicon up for infinite reliability and scale. Don't rent your autonomy, own it.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/docs" className={styles.primaryBtn}>Documentation</Link>
            <Link href="/contact" className={styles.secondaryBtn}>Contact Us &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className={styles.problem}>
        <div className={styles.sectionHeader}>
          <h2>The Problem with Modern UAVs</h2>
        </div>
        <div className={styles.grid2}>
          <div className={styles.card}>
            <h3>Foreign Stack Dependency</h3>
            <p>Relying on external flight stacks makes local debugging impossible and creates enormous security vulnerabilities for defense platforms.</p>
          </div>
          <div className={styles.card}>
            <h3>Bloated Complexity</h3>
            <p>Legacy systems suffer from deep complexity, lacking the necessary control to effectively implement modern hardware acceleration.</p>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className={styles.highlights}>
        <div className={styles.sectionHeader}>
          <h2>Capabilities.</h2>
        </div>
        <div className={styles.grid3}>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon}>⚡</div>
            <h3>Lock-free Execution</h3>
            <p>Minimizes interrupt jitter with deterministic SPSC queues.</p>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon}>🧠</div>
            <h3>Cascaded PID</h3>
            <p>High-frequency precision control across both angle and rate loops.</p>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon}>🛡️</div>
            <h3>Robust Failsafes</h3>
            <p>Designed with hardware interlocks and RC disruption recovery.</p>
          </div>
        </div>
      </section>

      {/* Why Now & Traction */}
      <section className={styles.traction}>
        <div className={styles.sectionHeader}>
          <h2>Why Now?</h2>
          <p className={styles.mutedText}>Timeline</p>
        </div>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <h4>Explosive Drone Growth</h4>
            <p>The global push for sovereign autonomy platforms demands an independent tech stack.</p>
          </div>
          <div className={styles.timelineItem}>
            <h4>Prototype Status</h4>
            <p>Currently deep in hardware validation and flight testing on STM32F4-based avionics.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
