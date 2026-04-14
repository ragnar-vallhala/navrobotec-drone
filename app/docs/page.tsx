import Link from 'next/link';
import styles from '../shared.module.css';

export default function Docs() {
    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h1>Technical <span className={styles.gradientText}>Documentation</span></h1>
                <p>Dive deep into the architecture of Vayu.</p>
            </div>

            <section className={styles.section}>
                <h2>Vayu Technical Report v1.0</h2>
                <p>
                    A comprehensive breakdown of our hardware design, software architecture, NavHAL specifications, and real-time execution model.
                    Includes detailed derivations of our control loops and benchmarking against legacy flight stacks.
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <Link href="/data/report/main.pdf" className={styles.primaryBtn} style={{
                        display: 'inline-block',
                        background: 'transparent',
                        border: '1px solid #555',
                        color: '#fff',
                        padding: '1rem 2rem',
                        borderRadius: '0px',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        textDecoration: 'none'
                    }}>
                        [ VIEW TECHNICAL REPORT ]
                    </Link>
                </div>
            </section>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3>Hardware Specifications</h3>
                    <p>Pinouts, schematic overviews, and power delivery notes for the STM32F4-based avionics.</p>
                </div>
                <div className={styles.card}>
                    <h3>VAIOS API Docs</h3>
                    <p>Information on SPSC queue implementation and task scheduling.</p>
                </div>
            </div>
        </div>
    );
}
