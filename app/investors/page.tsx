'use client';

import { motion } from 'framer-motion';
import styles from '../shared.module.css';
import contactStyles from '../contact/page.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

export default function InvestorOnboarding() {
    return (
        <div className={styles.container}>
            <div className={styles.standardContainer}>
                <div className={styles.headerArea}>
                    <motion.h1 {...fadeInUp}>Partnership <span className={styles.gradientText}>Inquiry.</span></motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                        Please complete the official onboarding form below.
                    </motion.p>
                </div>

                <motion.div 
                    className={contactStyles.iframeContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    style={{ 
                        width: '100%', 
                        marginTop: '3rem', 
                        borderRadius: '24px', 
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-card)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        backgroundColor: '#fff'
                    }}
                >
                    <iframe 
                        src="https://docs.google.com/forms/d/e/1FAIpQLScSWAK8vBPcc8MIGL5Dj-n7z1xvVcFEy1YCE5jtWs7MDC8Hkg/viewform?embedded=true" 
                        width="100%" 
                        height="800" 
                        frameBorder="0" 
                        marginHeight={0} 
                        marginWidth={0}
                        style={{ display: 'block' }}
                    >
                        Loading…
                    </iframe>
                </motion.div>
            </div>
        </div>
    );
}
