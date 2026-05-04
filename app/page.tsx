"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, Layers, Navigation, Rocket, Zap } from 'lucide-react';
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
  const visionCards = [
    { image: '/images/autonomous.jpg', title: 'True Autonomy', desc: 'Human-centric intelligence that eliminates the need for manual piloting. Interact via audio-visual cues and assign complex tasks that drones execute independently.' },
    { image: '/images/swarm.webp', title: 'Dynamic Swarms', desc: 'Unified multi-agent coordination where drones communicate, self-localize, and collaboratively plan to execute mission objectives as a single, cohesive entity.' },
    { image: '/images/in-house.jpg', title: 'Sovereign Software', desc: 'Zero-dependency architecture built from the ground up. By eliminating third-party weak links and implementing high-grade testing, we ensure mission-critical reliability.' },
  ];
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
        <section className={styles.missionSection}>
          <div className={styles.standardContainer}>
            {/* Founder Quote */}
            <motion.div className={styles.founderQuote} {...fadeInUp}>
              <span className={styles.quoteAccent}>&ldquo;</span>
              <blockquote className={styles.quoteText}>
                We are not building another autopilot. We are building the foundation — a sovereign, silicon-native intelligence that belongs entirely to its operator. No black boxes. No foreign dependencies. Just pure, auditable control.
              </blockquote>
              <div className={styles.founderAttrib}>
                <img src="/images/nipun.jpeg" alt="Nipun Singh" className={styles.founderAvatar} />
                <span className={styles.founderName}>Nipun Singh</span>
                <span className={styles.founderTitle}>Founder &amp; Director, NAVRobotec</span>
              </div>
            </motion.div>

            {/* Institutional Recognition Carousel */}
            <motion.div className={styles.logoCarousel} {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}>
              <p className={styles.recognizedBy}>Recognized by Leading Institutions</p>
              <div className={styles.carouselTrack}>
                {[1, 2].map((group) => (
                  <div key={group} className={styles.carouselGroup}>
                    <img src="/logos/dpiit.png" alt="DPIIT" className={styles.institutionLogo} />
                    <img src="/logos/i3c.png" alt="I3C" className={styles.institutionLogo} />
                    <img src="/logos/msme.png" alt="MSME" className={styles.institutionLogo} />
                    <img src="/logos/startup_up.png" alt="Startup UP" className={`${styles.institutionLogo} ${styles.startupUpLogo}`} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Vision Section */}
        <section className={styles.visionSectionOuter}>
          <div className={styles.standardContainer}>
            <div className={styles.visionHeader}>
              <motion.h2 className={styles.visionTitle} {...fadeInUp}>Our Focus.</motion.h2>
              <motion.p className={styles.visionDescription} {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}>
                We are redefining the boundaries of flight through three core pillars: human-centric autonomy, collaborative swarm intelligence, and a totally sovereign software stack. Our mission is to eliminate black boxes and foreign dependencies, ensuring total control for every mission.
              </motion.p>
            </div>
            <div className={styles.visionGrid}>
              {visionCards.map((card, i) => (
                <motion.div
                  key={i}
                  className={styles.visionCard}
                  {...fadeInUp}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                >
                  <div className={styles.visionCardImage} style={{ backgroundImage: `url(${card.image})` }} />
                  <div className={styles.visionCardOverlay}>
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Join the Mission Section */}
        <section className={styles.joinSection}>
          <div className={styles.wideContainer}>
            <div className={styles.joinInner}>
              <motion.div className={styles.sectionHeaderCenter} {...fadeInUp}>
                <p className={styles.mutedTextAccent}>Join the Mission</p>
                <h2>Help Us Build the Future of Autonomous Skies.</h2>
              </motion.div>

              <div className={styles.joinGrid}>
                <motion.div className={styles.joinCard} {...fadeInUp}>
                  <div className={styles.joinCardIcon}>
                    <Cpu className={styles.cardIcon} />
                  </div>
                  <div className={styles.cardContent}>
                    <h4>Developers</h4>
                    <p>Contribute to and improve core modules like NavHAL and VAIOS. Leverage our sovereign stack to build your own high-performance projects.</p>
                  </div>
                </motion.div>
                <motion.div className={styles.joinCard} {...fadeInUp} transition={{ delay: 0.1, duration: 0.8 }}>
                  <div className={styles.joinCardIcon}>
                    <Rocket className={styles.cardIcon} />
                  </div>
                  <div className={styles.cardContent}>
                    <h4>Manufacturers</h4>
                    <p>Partner with us to co-develop custom hardware or join our pilot program to integrate sovereign intelligence into your fleet.</p>
                  </div>
                </motion.div>
                <motion.div className={styles.joinCard} {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }}>
                  <div className={styles.joinCardIcon}>
                    <Zap className={styles.cardIcon} />
                  </div>
                  <div className={styles.cardContent}>
                    <h4>Investors</h4>
                    <p>Fuel the mission to redefine autonomous aviation. Help us scale this sovereign initiative and bring high-grade navigation to the global market.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className={styles.finalCTA}>
          <div className={styles.finalCTAOverlay} />
          <div className={styles.standardContainer}>
            <motion.div className={styles.finalCTAContent} {...fadeInUp}>
              <p className={styles.mutedTextAccent}>Ready to Lead?</p>
              <h2>The Future of Autonomy is <span className={`${styles.textAccent}`}>Here.</span></h2>
              <div className={styles.ctaGroupLarge}>
                <Link href="/contact" className={styles.primaryBtnLarge}>Start Your Mission</Link>
                <Link href="/blogs" className={styles.secondaryTextBtn}>Explore our Stack &rarr;</Link>
              </div>
            </motion.div>
          </div>
        </section >
      </div >
    </>
  );
}
