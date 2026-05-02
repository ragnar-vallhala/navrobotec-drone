"use client";

import { useState } from 'react';
import Link from 'next/link';
import SplitText from './SplitText';
import styles from './Footer.module.css';

const LinkedinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z" />
    </svg>
);

const FooterHeading = ({ children }: { children: string }) => {
    return (
        <h4 className={styles.footerHeading} style={{ margin: 0 }}>
            {children}
        </h4>
    );
};

const FooterLink = ({ href, children }: { href: string, children: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className={styles.footerLinkWrapper} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Link href={href}>
                <SplitText isHovered={isHovered}>{children}</SplitText>
            </Link>
        </div>
    );
};

const EmailLink = ({ children }: { children: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <p 
            className={styles.email} 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            <a href={`mailto:${children}`}>
                <SplitText isHovered={isHovered}>{children}</SplitText>
            </a>
        </p>
    );
};

const PhoneLink = ({ children }: { children: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <p 
            className={styles.phone} 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            <a href={`tel:${children.replace(/\s+/g, '')}`}>
                <SplitText isHovered={isHovered}>{children}</SplitText>
            </a>
        </p>
    );
};

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        NAVR
                        <img src="/logo.svg" alt="O" className={styles.logoIcon} style={{ height: '35px', width: 'auto', display: 'block', filter: 'invert(1)', margin: '0 -6px' }} />
                        BOTEC
                    </Link>
                    <p className={styles.description}>
                        Indigenous autonomous systems and defense stack.
                    </p>
                </div>
                <div className={styles.links}>
                    <FooterHeading>QUICK LINKS</FooterHeading>
                    <FooterLink href="/blogs">Blogs</FooterLink>
                    <FooterLink href="/vision">Vision</FooterLink>
                    <FooterLink href="/team">Team</FooterLink>
                </div>
                <div className={styles.contact}>
                    <FooterHeading>CONNECT</FooterHeading>
                    <EmailLink>support@navrobotec.com</EmailLink>
                    <PhoneLink>+91 9596917316</PhoneLink>
                    <div className={styles.socials}>
                        <Link href="https://www.linkedin.com/company/navrobotec/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialIcon}>
                            <LinkedinIcon />
                        </Link>
                        <Link href="https://www.instagram.com/navrobotec" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
                            <InstagramIcon />
                        </Link>
                        <Link href="https://x.com/NAVRobotec" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className={styles.socialIcon}>
                            <XIcon />
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.bigNavContainer}>
                <div className={styles.bigNav}>
                    <span className={styles.navPart}>N<span className={styles.accentLetter}>A</span>V</span>
                    <span className={styles.robotecPart}>ROBOTEC</span>
                </div>
            </div>
            <div className={styles.bottom}>
                &copy; {new Date().getFullYear()} NAVRobotec. All rights reserved.
            </div>
        </footer>
    );
}
