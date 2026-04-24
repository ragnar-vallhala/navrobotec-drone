'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '../shared.module.css';
import contactStyles from './page.module.css';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

export default function Contact() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        project: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ firstName: '', lastName: '', email: '', project: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.standardContainer}>
                <div className={styles.headerArea}>
                    <motion.h1 {...fadeInUp}>Get in <span className={styles.gradientText}>Touch.</span></motion.h1>
                    <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                        We are actively looking for <span className={contactStyles.linkWrapper}>
                            <Link href="/investors" className={contactStyles.highlightLink}>investors and partners</Link>
                            <span className={contactStyles.clickMe}>
                                <svg width="80" height="50" viewBox="0 0 80 50" className={contactStyles.curvedArrow}>
                                    <path 
                                        d="M75,35 C60,45 30,45 5,5 M5,5 L12,8 M5,5 L8,15" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                click me!
                            </span>
                        </span>.
                    </motion.p>
                </div>

                <div className={contactStyles.contactWrapper}>
                    <motion.div 
                        className={contactStyles.infoColumn}
                        {...fadeInUp}
                    >
                        <div className={contactStyles.infoCard}>
                            <h3>Email</h3>
                            <p>support@navrobotec.com</p>
                        </div>
                        <div className={contactStyles.infoCard}>
                            <h3>Phone</h3>
                            <p>+91 9596917316</p>
                        </div>
                        <div className={contactStyles.infoCard}>
                            <h3>Headquarters</h3>
                            <p>Ghaziabad, India</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        className={contactStyles.formColumn}
                        {...fadeInUp}
                        transition={{ delay: 0.2 }}
                    >
                        {status === 'success' ? (
                            <motion.div 
                                className={contactStyles.successMessage}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <h2>Message Sent!</h2>
                                <p>Thank you for reaching out. We'll get back to you shortly.</p>
                                <button 
                                    onClick={() => setStatus('idle')}
                                    className={contactStyles.secondaryButton}
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form className={contactStyles.contactForm} onSubmit={handleSubmit}>
                                <div className={contactStyles.formRow}>
                                    <div className={contactStyles.formGroup}>
                                        <label htmlFor="firstName">First Name</label>
                                        <input 
                                            type="text" 
                                            id="firstName" 
                                            placeholder="John" 
                                            required 
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div className={contactStyles.formGroup}>
                                        <label htmlFor="lastName">Last Name</label>
                                        <input 
                                            type="text" 
                                            id="lastName" 
                                            placeholder="Doe" 
                                            required 
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                
                                <div className={contactStyles.formGroup}>
                                    <label htmlFor="email">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        placeholder="john@example.com" 
                                        required 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>

                                <div className={contactStyles.formGroup}>
                                    <label htmlFor="project">Project Details</label>
                                    <textarea 
                                        id="project" 
                                        rows={5} 
                                        placeholder="Tell us about your project or inquiry..." 
                                        required
                                        value={formData.project}
                                        onChange={(e) => setFormData({...formData, project: e.target.value})}
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className={contactStyles.submitButton}
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                                </button>

                                {status === 'error' && (
                                    <p className={contactStyles.errorMessage}>Something went wrong. Please try again.</p>
                                )}
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
