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
                        <h3>Ashutosh Vishwakarma</h3>
                        <p>
                            <strong>Founder & Core Hardware Engineer</strong><br />
                            Embedded systems developer and controls theory specialist.
                            Responsible for the VAIOS architecture, NavHAL implementation, and cascaded PID tuning.
                        </p>
                    </motion.div>

                    <motion.div className={styles.card} {...fadeInUp} transition={{ delay: 0.2 }}>
                        <h3>Core Team</h3>
                        <p>
                            Currently scaling the core group. Looking for brilliant embedded developers, AI/ML engineers for computer vision,
                            and aerospace engineers to join the project.
                        </p>
                    </motion.div>

                    <motion.div className={styles.card} {...fadeInUp} transition={{ delay: 0.4 }}>
                        <h3>Mentorship</h3>
                        <p>
                            <strong>Dr. Vijay K. Pal</strong>
                            <br />
                            Providing critical guidance in control systems design, dynamic modeling, and autonomous navigation architectures.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

