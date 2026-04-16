"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (pathname !== '/') {
                setIsScrolled(true);
                return;
            }

            if (window.scrollY > window.innerHeight - 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    // Close menu on navigation
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''} ${isMenuOpen ? styles.navbarOpen : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
                    NAVR
                    <img src="/logo.svg" alt="O" className={styles.logoIcon} style={{ height: '30px', width: 'auto', display: 'block', margin: '0 -6px' }} />
                    BOTEC
                </Link>

                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Navigation"
                >
                    <div className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''}`}></div>
                </button>

                <div className={`${styles.navContent} ${isMenuOpen ? styles.navContentOpen : ''}`}>
                    <ul className={styles.navLinks}>
                        <li><Link href="/">HOME</Link></li>
                        <li><Link href="/technology">TECHNOLOGY</Link></li>
                        <li><Link href="/vision">VISION</Link></li>
                        <li><Link href="/demo">DEMO</Link></li>
                        <li><Link href="/team">TEAM</Link></li>
                        <li><Link href="/docs">DOCS</Link></li>
                    </ul>
                    <div className={styles.cta}>
                        <Link href="/contact" className={styles.contactBtn}>Contact</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
