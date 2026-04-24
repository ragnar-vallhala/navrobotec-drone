'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from '../shared.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

const visionNarrative = [
  {
    kicker: "The Paradigm Shift",
    headline: "Breaking the Black Box.",
    description: "Modern autonomous systems rely on bloated, opaque frameworks. We are shifting away from blind assembly toward true engineering, stripping away unnecessary complexity to reveal pure function."
  },
  {
    kicker: "Our Achievement",
    headline: "Total Architectural Ownership.",
    description: "An indigenous, first-principles approach. We do not just use the system; we own every layer from the silicon up. Uncompromising transparency. Absolute deterministic control."
  },
  {
    kicker: "The Horizon",
    headline: "Beyond Flight.",
    description: "Vayu is the beginning. We are establishing a universal, scalable foundation not just for drones, but for the next generation of embedded intelligence and autonomous robotics."
  }
];

export default function Vision() {
    return (
        <div className={styles.container}>
            <div className={styles.standardContainer}>
                <div className={styles.headerArea}>
                    <motion.h1 {...fadeInUp}>The <span className={styles.gradientText}>Vision.</span></motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>Our mission to redefine autonomous intelligence.</motion.p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', marginTop: '4rem', paddingBottom: '8rem' }}>
                    {visionNarrative.map((item, index) => (
                        <section key={index} style={{ maxWidth: '800px' }}>
                            <motion.span 
                                {...fadeInUp}
                                style={{ 
                                    color: 'var(--color-accent)', 
                                    fontFamily: 'var(--font-mono)', 
                                    fontSize: '0.9rem', 
                                    letterSpacing: '0.2em', 
                                    textTransform: 'uppercase',
                                    display: 'block',
                                    marginBottom: '1rem'
                                }}
                            >
                                {item.kicker}
                            </motion.span>
                            <motion.h2 
                                {...fadeInUp} 
                                transition={{ delay: 0.1 }}
                                style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.1' }}
                            >
                                {item.headline}
                            </motion.h2>
                            <motion.p 
                                {...fadeInUp} 
                                transition={{ delay: 0.2 }}
                                style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}
                            >
                                {item.description}
                            </motion.p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
