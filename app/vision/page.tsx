'use client';

import { motion } from 'framer-motion';
import styles from '../shared.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

export default function Vision() {
    return (
        <div className={styles.container}>
            <div className={styles.standardContainer}>
                <div className={styles.headerArea}>
                    <motion.h1 {...fadeInUp}>Company <span className={styles.gradientText}>Vision.</span></motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>The roadmap to sovereign autonomous technology.</motion.p>
                </div>

                <section className={styles.section}>
                    <motion.h2 {...fadeInUp}>Sovereignty in Autonomy</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                        We are committed to building 100% indigenous autonomous systems. Reliance on global open-source giants creates
                        a black box effect that limits the ability of defense and enterprise to truly own their platform capabilities.
                    </motion.p>
                </section>

                <section className={styles.section}>
                    <motion.h2 {...fadeInUp}>The Problem at Scale</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                        Today's drones operate on bloated software stacks designed to support thousands of different hardware configurations.
                        The result is a labyrinth of abstractions that compromise performance, reliability, and security at critical moments.
                    </motion.p>
                </section>

                <section className={styles.section}>
                    <motion.h2 {...fadeInUp}>Our Approach: Vertical Integration</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                        By developing our own hardware abstraction (NavHAL), execution environment (VAIOS), and control logic (Vayu),
                        we achieve deep hardware-software synergy. This vertical integration allows for determinism and performance
                        impossible with fragmented stacks.
                    </motion.p>
                </section>

                <section className={styles.section}>
                    <motion.h2 {...fadeInUp}>Long-Term Horizon</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                        Vayu is not just a drone controller. It is becoming a universal, scalable platform for all autonomous mobility:
                        from aerial swarms to ground robotics and advanced defense interception systems.
                    </motion.p>
                </section>
            </div>
        </div>
    );
}

