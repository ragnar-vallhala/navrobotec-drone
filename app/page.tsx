"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const phrases = ["Unwavering Reliability", "Absolute Control", "Sovereign by Design"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const visionCards = [
    { image: '/images/in-house.jpg', title: 'Sovereign Foundation', desc: 'We own every layer — NavHAL at the hardware, VaiOS as the operating system, VAYU in the air. No black boxes, no foreign dependencies: a stack you can audit from the first register.' },
    { image: '/images/autonomous.jpg', title: 'Real-Time Reliability', desc: 'A flight core that never misses its deadline. VaiOS holds the control loop to a fixed schedule every cycle — benchmarked head-to-head against FreeRTOS and Zephyr on the same hardware.' },
    { image: '/images/swarm.webp', title: 'Built to Grow', desc: 'Autonomy and swarms are not bolted on — they are how VaiOS is designed to scale, from one aircraft to many. UAVs come first because that is where we prove it.' },
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
        {/* Hero Section */}
        <section className={`${styles.section} ${styles.hero}`}>
          <HeroVideo />

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
            <motion.p
              className={styles.heroTagline}
              variants={itemVariant}
            >
              An autonomous flight stack powered by <strong>VaiOS</strong> — our sovereign robotics runtime.
            </motion.p>
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
                We are not building another autopilot. We are building the foundation — VaiOS, a sovereign, silicon-native runtime that belongs entirely to its operator. No black boxes. No foreign dependencies. Just pure, auditable control.
              </blockquote>
              <div className={styles.founderAttrib}>
                <Image src="/images/nipun.jpeg" alt="Nipun Singh" width={72} height={72} className={styles.founderAvatar} />
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
                    <Image src="/logos/dpiit.png" alt="DPIIT" width={1969} height={655} className={styles.institutionLogo} />
                    <Image src="/logos/i3c.png" alt="I3C" width={512} height={512} className={styles.institutionLogo} />
                    <Image src="/logos/msme.png" alt="MSME" width={367} height={137} className={styles.institutionLogo} />
                    <Image src="/logos/startup_up.png" alt="Startup UP" width={200} height={200} className={`${styles.institutionLogo} ${styles.startupUpLogo}`} />
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
                Everything we fly runs on VaiOS — a sovereign robotics runtime we build from the silicon up. Our focus is the foundation: own every layer, hold it to hard real time, and prove it on UAVs before it grows further.
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
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.visionCardImage}
                    style={{ objectFit: 'cover' }}
                  />
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
                    <p>Contribute to the core layers of VaiOS — from NavHAL up. Build on a sovereign stack you can read, audit, and extend down to the register.</p>
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
                <Link href="/technology" className={styles.secondaryTextBtn}>Explore our Stack &rarr;</Link>
              </div>
            </motion.div>
          </div>
        </section >
      </div >
    </>
  );
}
