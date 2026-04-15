"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';

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
  const phrases = ["Unwavering Reliability", "Unmatched Control", "Unrestricted Innovation"];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
              <motion.span variants={itemVariant} className={styles.titleAccent} style={{ display: 'block', marginBottom: '1rem' }}>VAYU</motion.span>
              <motion.span variants={itemVariant} className={styles.titleSecondary} style={{ display: 'block', marginBottom: '1rem' }}>Mastering The</motion.span>
              <motion.span variants={itemVariant} className={styles.titleAccent} style={{ display: 'block', marginBottom: '1rem' }}>SKIES</motion.span>
            </h1>
            <motion.div className={styles.subtextWrapper} variants={itemVariant}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={phraseIndex}
                  className={styles.subtext}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  {phrases[phraseIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
            <motion.div className={styles.ctaGroup} variants={itemVariant}>
              <Link href="/docs" className={styles.primaryBtn}>What We Do</Link>
              <Link href="/contact" className={styles.secondaryBtn}>Join the Mission</Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className={`${styles.section} ${styles.problem}`}>
          <motion.div className={styles.sectionImageWrapper} {...fadeInUp}>
            <img src="/images/autonomous.jpg" alt="Autonomous Drone Technology" className={styles.sectionImage} />
          </motion.div>
          <div className={styles.sectionContent}>
            <motion.div className={styles.sectionHeader} {...fadeInUp}>
              <h2>Our Mission.</h2>
            </motion.div>
            <div className={styles.grid2}>
              <motion.div className={styles.card} {...fadeInUp}>
                <h3>Sovereign Engineering</h3>
                <p>We are engineering indigenous, secure, and completely vertically-integrated flight stacks from the silicon up, ensuring absolute sovereignty over critical hardware.</p>
              </motion.div>
              <motion.div className={styles.card} {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}>
                <h3>Limitless Potential</h3>
                <p>By eliminating legacy codebase bloat and restrictive foreign dependencies, we hand you the keys to the hardware—unleashing unrestricted innovation in autonomous aviation.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className={`${styles.section} ${styles.highlights}`}>
          <div className={styles.sectionContent}>
            <motion.div className={styles.sectionHeader} {...fadeInUp}>
              <h2>Our Technology.</h2>
            </motion.div>
            <div className={styles.grid3}>
              <motion.div className={styles.highlightCard} {...fadeInUp}>
                <div className={styles.highlightIcon}></div>
                <h3>Deterministic Execution</h3>
                <p>Minimizes interrupt jitter through highly optimized, lock-free SPSC queue architectures.</p>
              </motion.div>
              <motion.div className={styles.highlightCard} {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}>
                <h3>Cascaded Control</h3>
                <p>Delivers absolute precision with high-frequency cascaded processing across both angle and rate loops.</p>
              </motion.div>
              <motion.div className={styles.highlightCard} {...fadeInUp} transition={{ delay: 0.4, duration: 0.8 }}>
                <h3>Bare-Metal Efficiency</h3>
                <p>Features our proprietary NavHAL, stripping away RTOS overhead by mapping directly to silicon registers.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Join Us Section */}
        <section className={`${styles.section} ${styles.traction}`}>
          <div className={styles.sectionContent}>
            <motion.div className={styles.sectionHeader} {...fadeInUp}>
              <h2>Why Join Us.</h2>
              <p className={styles.mutedText}>The Mission</p>
            </motion.div>
            <div className={styles.timeline}>
              <motion.div className={styles.timelineItem} {...fadeInUp}>
                <h4>Build the Unbuilt</h4>
                <p>Work on entirely sovereign flight control systems and avionics. Reject legacy bloat and shape the future of autonomous navigation from the ground up.</p>
              </motion.div>
              <motion.div className={styles.timelineItem} {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}>
                <h4>Solve Hard Problems</h4>
                <p>We deal with real-time hardware constraints, high-frequency PID loops, and deep silicon-level bare-metal coding every single day. Average is not an option.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
