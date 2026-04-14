"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './page.module.css';
import { motion } from 'framer-motion';

import HeroVideo from '../components/HeroVideo';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const },
  viewport: { once: false, amount: 0.3 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <HeroVideo />

        {/* Hero Section */}
        <section className={`${styles.section} ${styles.hero}`}>
          <motion.div
            className={styles.heroContent}
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h1 className={styles.title}>
              <motion.span variants={itemVariant} style={{ display: 'block' }}>Mastering Autonomy</motion.span>
              <motion.span variants={itemVariant} style={{ display: 'block' }}>With</motion.span>
              <motion.span variants={itemVariant} className={styles.greyText} style={{ display: 'block' }}>Vayu Stack.</motion.span>
            </h1>
            <motion.p className={styles.subtext} variants={itemVariant}>
              The only indigenous drone flight control system that gives you the keys to the hardware. Built from the silicon up for infinite reliability and scale.
            </motion.p>
            <motion.div className={styles.ctaGroup} variants={itemVariant}>
              <Link href="/docs" className={styles.primaryBtn}>Documentation</Link>
              <Link href="/contact" className={styles.secondaryBtn}>Contact Us &rarr;</Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Problem Section */}
        <section className={`${styles.section} ${styles.problem}`}>
          <div className={styles.sectionContent}>
            <motion.div className={styles.sectionHeader} {...fadeInUp}>
              <h2>The Challenge.</h2>
            </motion.div>
            <div className={styles.grid2}>
              <motion.div className={styles.card} {...fadeInUp}>
                <h3>Foreign Dependency</h3>
                <p>Relying on external flight stacks makes local debugging impossible and creates enormous security vulnerabilities for defense platforms.</p>
              </motion.div>
              <motion.div className={styles.card} {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}>
                <h3>Bloated Complexity</h3>
                <p>Legacy systems suffer from deep complexity, lacking the necessary control to effectively implement modern hardware acceleration.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Product Highlights */}
        <section className={`${styles.section} ${styles.highlights}`}>
          <div className={styles.sectionContent}>
            <motion.div className={styles.sectionHeader} {...fadeInUp}>
              <h2>Core Capabilities.</h2>
            </motion.div>
            <div className={styles.grid3}>
              <motion.div className={styles.highlightCard} {...fadeInUp}>
                <div className={styles.highlightIcon}></div>
                <h3>Deterministic Execution</h3>
                <p>Minimizes interrupt jitter with lock-free SPSC queues.</p>
              </motion.div>
              <motion.div className={styles.highlightCard} {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}>
                <h3>Cascaded Control</h3>
                <p>High-frequency precision control across both angle and rate loops.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Now & Traction */}
        <section className={`${styles.section} ${styles.traction}`}>
          <div className={styles.sectionContent}>
            <motion.div className={styles.sectionHeader} {...fadeInUp}>
              <h2>Why Now?</h2>
              <p className={styles.mutedText}>Timeline</p>
            </motion.div>
            <div className={styles.timeline}>
              <motion.div className={styles.timelineItem} {...fadeInUp}>
                <h4>Sovereign Autonomy</h4>
                <p>The global push for sovereign platforms demands an independent and auditable tech stack.</p>
              </motion.div>
              <motion.div className={styles.timelineItem} {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}>
                <h4>Hardware Validation</h4>
                <p>Currently deep in flight testing on STM32F4-based avionics with custom NavHAL implementation.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
