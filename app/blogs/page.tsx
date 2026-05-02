'use client';

import { motion } from 'framer-motion';
import { Cpu, Layers, Navigation, Zap } from 'lucide-react';
import Link from 'next/link';
import ArchitectureStack from '@/components/ArchitectureStack';
import DataFlowPipeline from '@/components/DataFlowPipeline';
import styles from './page.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

export default function Blogs() {
    return (
        <div className={styles.container}>
            <div className={styles.standardContainer}>
                <div className={styles.headerArea}>
                    <motion.h1 {...fadeInUp}>Vayu Blogs.</motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>The absolute foundation of autonomous supremacy.</motion.p>
                </div>
            </div>

            <section className={`${styles.techSection} ${styles.overview}`}>
                <div className={styles.standardContainer}>
                    <motion.h2 {...fadeInUp}>What is Vayu?</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                        Vayu is a clean-sheet autonomous drone flight control stack designed from the
                        ground up to eliminate dependency on foreign monolithic architectures like PX4 and ArduPilot.
                        We prioritize raw hardware performance and deterministic safety over generic abstraction.
                    </motion.p>
                </div>
            </section>

            <section className={`${styles.techSection} ${styles.architectureDark}`}>
                <div className={styles.standardContainer}>
                    <motion.h2 {...fadeInUp} className="text-white">System Architecture</motion.h2>
                    <ArchitectureStack />
                </div>
            </section>

            <div className={styles.standardContainer}>
                <section className={`${styles.techSection} ${styles.dataFlow}`}>
                    <motion.h2 {...fadeInUp}>Data Flow Pipeline</motion.h2>
                    <DataFlowPipeline />
                </section>

                <section className={`${styles.techSection} ${styles.controlSystem}`}>
                    <motion.h2 {...fadeInUp}>Control System</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                        Our flight controller features an ultra-fast <strong>Cascaded PID</strong> system that splits
                        stabilization into external Angle and internal Rate loops, prioritizing extreme angular velocity responsiveness and rejection of external disturbances.
                    </motion.p>
                </section>

                <section className={`${styles.techSection} ${styles.differentiation}`}>
                    <motion.h2 {...fadeInUp}>Differentiation</motion.h2>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                        Unlike <strong>PX4</strong> or <strong>ArduPilot</strong>, which try to be everything for everyone,
                        Vayu is purpose-built. We discard heavy POSIX-like overhead in favor of raw bare-metal predictability,
                        using lock-free SPSC queues to eliminate interrupt jitter and ensure mission-critical timing.
                    </motion.p>
                </section>
            </div>
        </div>
    );
}
