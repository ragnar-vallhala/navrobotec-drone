'use client';

import { motion } from 'framer-motion';
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
                <div className={styles.headerArea} style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <motion.h1 {...fadeInUp}>Vayu Blogs.</motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }} style={{ fontSize: '2rem', marginTop: '2rem', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.1em' }}>
                        COMING SOON
                    </motion.p>
                    <motion.p {...fadeInUp} transition={{ delay: 0.4 }} style={{ maxWidth: '600px', margin: '1rem auto' }}>
                        We are currently documenting our engineering journey and technical breakthroughs. Stay tuned for deep dives into autonomous intelligence.
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
