"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from './SplitText';
import styles from './Navbar.module.css';

const NavLink = ({ href, children, isContact }: { href: string, children: string, isContact?: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link 
            href={href} 
            className={isContact ? styles.contactBtn : styles.navLinkWrapper}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <SplitText isHovered={isHovered || isActive}>{children}</SplitText>
            {!isContact && (
                <motion.div 
                    className={styles.underline}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (isHovered || isActive) ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
            )}
        </Link>
    );
};

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
                        <li><NavLink href="/">HOME</NavLink></li>
                        <li><NavLink href="/technology">TECHNOLOGY</NavLink></li>
                        <li><NavLink href="/vision">VISION</NavLink></li>
                        <li><NavLink href="/demo">DEMO</NavLink></li>
                        <li><NavLink href="/team">TEAM</NavLink></li>
                        <li><NavLink href="/docs">DOCS</NavLink></li>
                    </ul>
                    <div className={styles.cta}>
                        <NavLink href="/contact" isContact>CONTACT</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}
