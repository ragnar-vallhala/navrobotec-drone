import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
                    NAVR
                    <img src="/logo.svg" alt="O" className={styles.logoIcon} style={{ height: '30px', width: 'auto', display: 'block', filter: 'invert(1)', margin: '0 -6px' }} />
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
