'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '../shared.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

const visionNarrative = [
  {
    kicker: "Pillar One: True Autonomy",
    headline: "Eliminating the Pilot.",
    description: "We are moving past the era of remote piloting. True autonomy means a drone can exist in a human environment, interpret audio-visual cues, and execute complex assignments independently.",
    why: "Human intervention is the primary point of failure and the greatest bottleneck in scaling aerial operations. We need machines that can think and act, not just follow commands."
  },
  {
    kicker: "Pillar Two: Swarm Coordination",
    headline: "Unified Intelligence.",
    description: "Our vision is a sky where drones aren't just flying together, but thinking together. Through peer-to-peer communication and collaborative localization, swarms can solve problems that a single agent never could.",
    why: "The challenges of the future—from rapid search and rescue to complex industrial inspection—demand the redundancy and efficiency of a distributed machine mind."
  },
  {
    kicker: "Pillar Three: Sovereign Software",
    headline: "Zero-Dependency Reliability.",
    description: "In mission-critical environments, a single third-party weak link is an unacceptable risk. We reject 'black box' frameworks in favor of a totally sovereign, high-grade tested software stack.",
    why: "True security isn't just about code; it's about owning the foundation. If you don't own every line of code, you don't own the mission."
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
                        <section key={index} style={{ maxWidth: '850px' }}>
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
                                style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.1', fontWeight: 800 }}
                            >
                                {item.headline}
                            </motion.h2>
                            <motion.p 
                                {...fadeInUp} 
                                transition={{ delay: 0.2 }}
                                style={{ fontSize: '1.35rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '2rem' }}
                            >
                                {item.description}
                            </motion.p>
                            <motion.div 
                                {...fadeInUp} 
                                transition={{ delay: 0.3 }}
                                style={{ 
                                    background: 'rgba(233, 69, 96, 0.05)', 
                                    padding: '2rem', 
                                    borderRadius: '16px', 
                                    borderLeft: '4px solid var(--color-accent)' 
                                }}
                            >
                                <p style={{ 
                                    fontFamily: 'var(--font-mono)', 
                                    fontSize: '0.85rem', 
                                    color: 'var(--color-accent)', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.1em',
                                    marginBottom: '0.5rem'
                                }}>
                                    Why it matters
                                </p>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    {item.why}
                                </p>
                            </motion.div>
                        </section>
                    ))}
                </div>

                <motion.div 
                    {...fadeInUp} 
                    transition={{ delay: 0.4 }}
                    style={{ 
                        marginTop: '4rem', 
                        padding: '6rem 2rem', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: '32px', 
                        textAlign: 'center',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        marginBottom: '8rem'
                    }}
                >
                    <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Deep Dive into Our Technology.</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        Want to learn more about the engineering and philosophy behind Vayu? 
                        Explore our technical deep dives and project updates on our blog.
                    </p>
                    <Link href="/blogs" className={styles.ctaBtn}>Read Our Blogs</Link>
                </motion.div>
            </div>
        </div>
    );
}
