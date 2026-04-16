'use client';

import { motion } from 'framer-motion';
import styles from '../shared.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

export default function Demo() {
    return (
        <div className={styles.container}>
            <div className={styles.standardContainer}>
                <div className={styles.headerArea}>
                    <motion.h1 {...fadeInUp}><span className={styles.gradientText}>System Showcase.</span></motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>Witness Vayu in action across various environments.</motion.p>
                </div>

                <section className={styles.section}>
                    <motion.h2 {...fadeInUp}>Flight Stabilization Tests</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>Testing the cascaded PID angle and rate loops on a test rig to ensure optimal tuning.</motion.p>
                    <motion.div className={styles.mediaPlaceholder} {...fadeInUp}>[ Stabilization Video Placeholder ]</motion.div>
                </section>

                <section className={styles.section}>
                    <motion.h2 {...fadeInUp}>Bench Testing & Hardware</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>Validating NavHAL interfaces, SPI sensor data acqusition, and lock-free execution queues.</motion.p>
                    <motion.div className={styles.mediaPlaceholder} {...fadeInUp}>[ Bench Test Video Placeholder ]</motion.div>
                </section>

                <section className={styles.section}>
                    <motion.h2 {...fadeInUp}>Control Response Curves</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>Raw telemetry logs via VAIOS demonstrating ultra-low latency inputs and step response settling times.</motion.p>
                    <motion.div className={styles.mediaPlaceholder} {...fadeInUp}>[ Telemetry Graphs Placeholder ]</motion.div>
                </section>
            </div>
        </div>
    );
}

