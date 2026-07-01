'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Activity, Rocket } from 'lucide-react';
import styles from '../shared.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

const visionNarrative = [
  {
    kicker: "Pillar One: Sovereign Foundation",
    icon: Shield,
    headline: "Built From the Silicon Up.",
    description: "Most flight software is stacked on borrowed frameworks nobody fully controls. We took the opposite path and built our own: NavHAL speaking directly to the hardware, VaiOS as the operating system above it, and VAYU flying on top. Every layer is ours.",
    why: "If you don't own the foundation, you don't own the mission. Owning every layer means there are no black boxes and no foreign dependencies — a stack you can read, audit, and trust down to the last register."
  },
  {
    kicker: "Pillar Two: Real-Time Reliability",
    icon: Activity,
    headline: "A Core That Never Misses.",
    description: "A flight controller is judged in microseconds. VaiOS runs the control loop on a fixed schedule, every cycle, without exception — and we have benchmarked it head-to-head against FreeRTOS and Zephyr on the same hardware to prove it. VAYU is that reliability in the air.",
    why: "An aircraft does not get a second chance. A system that is usually fast but occasionally stalls will still drop a drone, so we engineer for the worst case, not the average."
  },
  {
    kicker: "Pillar Three: Built to Grow",
    icon: Rocket,
    headline: "From One Drone to Many.",
    description: "Autonomy and swarms aren't features bolted on at the end — they're how VaiOS is designed to scale. The same runtime that flies one aircraft is built to coordinate many, and to reach beyond drones as it matures. UAVs come first because that is where we are proving it.",
    why: "We are building a foundation, not a single product. Getting the hard real-time core right on a drone is what earns the right to carry it further."
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
                    {visionNarrative.map((item, index) => {
                        const Icon = item.icon;
                        return (
                        <section key={index} style={{ maxWidth: '850px' }}>
                            <motion.div
                                {...fadeInUp}
                                style={{
                                    width: 46,
                                    height: 46,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 12,
                                    background: 'rgba(255, 176, 0, 0.08)',
                                    border: '1px solid rgba(255, 176, 0, 0.22)',
                                    color: 'var(--color-accent)',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                <Icon size={22} strokeWidth={1.75} />
                            </motion.div>
                            <motion.span
                                {...fadeInUp}
                                style={{
                                    color: 'var(--color-accent)',
                                    fontFamily: 'var(--font-data)',
                                    fontSize: '0.82rem',
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
                                    background: 'rgba(217, 119, 6, 0.05)', 
                                    padding: '2rem', 
                                    borderRadius: '16px', 
                                    borderLeft: '4px solid var(--color-accent)' 
                                }}
                            >
                                <p style={{
                                    fontFamily: 'var(--font-data)',
                                    fontSize: '0.78rem',
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
                        );
                    })}
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
                        Want to see how the stack fits together — NavHAL, VaiOS, and VAYU?
                        Walk through the architecture, or read the engineering journal on our blog.
                    </p>
                    <Link href="/technology" className={styles.ctaBtn}>Explore the Stack</Link>
                </motion.div>
            </div>
        </div>
    );
}
