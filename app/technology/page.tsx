'use client';

import { motion } from 'framer-motion';
import { Cpu, Layers, Navigation, Zap } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

export default function Technology() {
    return (
        <div className={styles.container}>
            <div className={styles.standardContainer}>
                <div className={styles.headerArea}>
                    <motion.h1 {...fadeInUp}>The Technology Stack.</motion.h1>
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

            <div className={styles.standardContainer}>
                <section className={`${styles.techSection} ${styles.architecture}`}>
                    <motion.h2 {...fadeInUp}>System Architecture</motion.h2>
                    <div className={styles.stackDiagram}>
                        <motion.div className={styles.stackLayer} {...fadeInUp} transition={{ delay: 0.6 }}>
                            <div className={styles.stackIcon}><Navigation size={24} /></div>
                            <div className={styles.stackInfo}>
                                <h3>Vayu Flight Stack</h3>
                                <p>Sovereign autonomy components, high-level guidance, and mission planning engine.</p>
                            </div>
                        </motion.div>
                        <div className={styles.stackConnector} />
                        <motion.div className={styles.stackLayer} {...fadeInUp} transition={{ delay: 0.4 }}>
                            <div className={styles.stackIcon}><Layers size={24} /></div>
                            <div className={styles.stackInfo}>
                                <h3>VaiOS (Execution Layer)</h3>
                                <p>Real-time scheduler and deterministic environment architected for safety-critical intelligence.</p>
                            </div>
                        </motion.div>
                        <div className={styles.stackConnector} />
                        <motion.div className={styles.stackLayer} {...fadeInUp} transition={{ delay: 0.2 }}>
                            <div className={styles.stackIcon}><Cpu size={24} /></div>
                            <div className={styles.stackInfo}>
                                <h3>NavHAL</h3>
                                <p>Bare-metal Hardware Abstraction Layer ensuring silicon-agnostic core stack execution.</p>
                            </div>
                        </motion.div>
                        <div className={styles.stackConnector} />
                        <motion.div className={styles.stackLayer} {...fadeInUp}>
                            <div className={styles.stackIcon}><Zap size={24} /></div>
                            <div className={styles.stackInfo}>
                                <h3>The Hardware Foundation</h3>
                                <p>Custom PCB architecture, STM32 MCU, and high-frequency IMU sensors mapping directly to the stack.</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className={`${styles.techSection} ${styles.dataFlow}`}>
                    <motion.h2 {...fadeInUp}>Data Flow Pipeline</motion.h2>
                    <div className={styles.flowDiagram}>
                        <div className={styles.flowNode}>Sensors</div>
                        <div className={styles.flowArrow}>→</div>
                        <div className={styles.flowNode}>Estimation</div>
                        <div className={styles.flowArrow}>→</div>
                        <div className={styles.flowNode}>Control</div>
                        <div className={styles.flowArrow}>→</div>
                        <div className={styles.flowNode}>Actuation</div>
                    </div>
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
