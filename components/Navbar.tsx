"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight - 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
                    NAVR
                    <img src="/logo.svg" alt="O" className={styles.logoIcon} style={{ height: '30px', width: 'auto', display: 'block', margin: '0 -6px' }} />
                    BOTEC
                </Link>
                <ul className={styles.navLinks}>
                    <li><Link href="/">HOME</Link></li>
                    <li><Link href="/technology">TECHNOLOGY</Link></li>
                    <li><Link href="/demo">DEMO</Link></li>
                    <li><Link href="/vision">VISION</Link></li>
                    <li><Link href="/team">TEAM</Link></li>
                    <li><Link href="/docs">DOCS</Link></li>
                </ul>
                <div className={styles.cta}>
                    <Link href="/contact" className={styles.contactBtn}>Contact</Link>
                </div>
            </div>
        </nav>
    );
}
