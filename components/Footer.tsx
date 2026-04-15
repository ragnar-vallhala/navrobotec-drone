import Link from 'next/link';
import styles from './Footer.module.css';

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
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link href="/technology">Technology</Link></li>
                        <li><Link href="/vision">Vision</Link></li>
                        <li><Link href="/team">Team</Link></li>
                    </ul>
                </div>
                <div className={styles.contact}>
                    <h4>Connect</h4>
                    <p>contact@navrobotec.com</p>
                    <div className={styles.socials}>
                        <Link href="https://linkedin.com">LinkedIn</Link>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                &copy; {new Date().getFullYear()} NAVRobotec. All rights reserved.
            </div>
        </footer>
    );
}
