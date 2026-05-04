'use client';

import { motion } from 'framer-motion';
import styles from '../shared.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

export default function Team() {
    return (
        <div className={styles.container}>
            <div className={styles.standardContainer}>
                <div className={styles.headerArea}>
                    <motion.h1 {...fadeInUp}>The <span className={styles.gradientText}>Team.</span></motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>Built by engineers obsessed with control and autonomy.</motion.p>
                </div>

                <div className={styles.grid}>
                    <motion.div className={styles.card} {...fadeInUp}>
                        <div className={styles.cardHeader}>
                            <img src="/images/nipun.jpeg" alt="Nipun Singh" className={styles.avatar} />
                            <div className={styles.memberInfo}>
                                <h3>Nipun Singh</h3>
                                <strong>Founder & Director</strong>
                            </div>
                        </div>
                        <p>
                            Leading the strategic vision and operations of NAVRobotec. Focused on scaling autonomous intelligence and establishing a foundation for secure, independent aviation.
                        </p>
                    </motion.div>

                    <motion.div className={styles.card} {...fadeInUp} transition={{ delay: 0.2 }}>
                        <div className={styles.cardHeader}>
                            <img src="/images/Ashutosh.jpeg" alt="Ashutosh Vishwakarma" className={styles.avatar} />
                            <div className={styles.memberInfo}>
                                <h3>Ashutosh Vishwakarma</h3>
                                <strong>Founder & Core Hardware</strong>
                            </div>
                        </div>
                        <p>
                            Embedded systems developer and controls theory specialist. Responsible for VAIOS architecture, NavHAL implementation, and core flight stabilization logic.
                        </p>
                    </motion.div>

                    <motion.div className={styles.card} {...fadeInUp} transition={{ delay: 0.4 }}>
                        <div className={styles.cardHeader}>
                            <img src="/images/vibhu.png" alt="Vibhu Gupta" className={styles.avatar} />
                            <div className={styles.memberInfo}>
                                <h3>Vibhu Gupta</h3>
                                <strong>Core Software Engineer</strong>
                            </div>
                        </div>
                        <p>
                            Specializing in computer vision and collaborative swarm intelligence. Developing the perception layers and multi-agent coordination protocols for the Vayu stack.
                        </p>
                    </motion.div>
                </div>

                <div className={styles.headerArea} style={{ marginTop: '6rem' }}>
                    <motion.h2 {...fadeInUp}>Mentorship.</motion.h2>
                </div>

                <div className={styles.grid}>
                    <motion.div className={styles.card} {...fadeInUp}>
                        <h3>Dr. Vijay K. Pal</h3>
                        <p>
                            <strong>Technical Advisor</strong><br />
                            Providing critical guidance in control systems design, dynamic modeling, and autonomous navigation architectures.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
