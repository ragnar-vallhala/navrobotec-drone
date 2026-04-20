'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '../shared.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

export default function Contact() {
    return (
        <div className={styles.container}>
            <div className={styles.standardContainer}>
                <div className={styles.headerArea}>
                    <motion.h1 {...fadeInUp}>Get in <span className={styles.gradientText}>Touch.</span></motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>We are actively looking for investors and partners.</motion.p>
                </div>

                <section className={styles.section} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <motion.h2 {...fadeInUp}>Contact Information</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }} style={{ marginBottom: '3rem', marginInline: 'auto' }}>
                        Interested in what we are building? Whether you are looking to invest, partner, or use our technology for
                        defense, agriculture, and research platforms—we want to hear from you.
                    </motion.p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                        <motion.a
                            href="mailto:support@navrobotec.com"
                            {...fadeInUp}
                            transition={{ delay: 0.4 }}
                            style={{
                                fontSize: '1.5rem',
                                color: 'var(--color-accent)',
                                fontWeight: '700',
                                textDecoration: 'none',
                                fontFamily: 'var(--font-mono)'
                            }}
                        >
                            support@navrobotec.com
                        </motion.a>

                        <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
                            <Link href="https://www.linkedin.com/company/107500953" style={{
                                fontSize: '1.2rem',
                                color: 'var(--text-secondary)',
                                fontWeight: '600',
                                textDecoration: 'none',
                                borderBottom: '2px solid var(--color-accent)',
                                paddingBottom: '4px'
                            }}>
                                Connect on LinkedIn
                            </Link>
                        </motion.div>
                    </div>
                </section>

                <section className={styles.section} style={{ marginTop: '8rem' }}>
                    <motion.h2 {...fadeInUp}>Core Use Cases & Applications</motion.h2>
                    <div className={styles.grid}>
                        <motion.div className={styles.card} {...fadeInUp}>
                            <h3>Defense Drones</h3>
                            <p>Secure, deterministic flight profiles with non-reliant architectures.</p>
                        </motion.div>
                        <motion.div className={styles.card} {...fadeInUp} transition={{ delay: 0.2 }}>
                            <h3>Agriculture</h3>
                            <p>Heavy-lift capable stabilization loops suitable for massive payloads.</p>
                        </motion.div>
                        <motion.div className={styles.card} {...fadeInUp} transition={{ delay: 0.4 }}>
                            <h3>Swarm Robotics</h3>
                            <p>High-efficiency compute ensuring enough headroom for multi-agent networking.</p>
                        </motion.div>
                        <motion.div className={styles.card} {...fadeInUp} transition={{ delay: 0.6 }}>
                            <h3>Research Platforms</h3>
                            <p>Transparent architectural access for universities and institutions.</p>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
}

