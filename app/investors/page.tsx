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
                        Backing a sovereign foundation for autonomous flight.
                    </motion.p>
                </div>

                <motion.div
                    {...fadeInUp}
                    transition={{ delay: 0.3 }}
                    style={{ maxWidth: '850px', margin: '0 auto 4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
                >
                    <p style={{ fontSize: '1.35rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        Most drone companies build on borrowed software. We build the foundation itself —
                        <strong> VaiOS</strong>, a sovereign robotics runtime engineered from the silicon up.
                    </p>
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                        Our differentiation is depth. We own every layer of the flight stack — NavHAL at the
                        hardware, VaiOS as the operating system, and VAYU in the air — with no foreign
                        dependencies in the flight path. UAVs are our beachhead: the place we prove the
                        real-time core before the same runtime reaches further into robotics. The work is
                        already recognized by DPIIT, MSME, and the Startup UP initiative.
                    </p>
                    <p style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-accent)',
                        textTransform: 'uppercase', letterSpacing: '0.1em'
                    }}>
                        Tell us where you fit — complete the onboarding form below.
                    </p>
                </motion.div>

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
