import Link from 'next/link';
import styles from '../shared.module.css';

export default function Contact() {
    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h1>Get in <span className={styles.gradientText}>Touch</span></h1>
                <p>We are actively looking for investors and partners.</p>
            </div>

            <section className={styles.section} style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Contact Information</h2>
                <p style={{ marginBottom: '2rem' }}>
                    Interested in what we are building? Whether you are looking to invest, partner, or use our technology for
                    defense, agriculture, and research platforms—we want to hear from you.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                    <a href="mailto:contact@navrobotec.com" style={{
                        fontSize: '1.2rem',
                        color: '#00e5ff',
                        fontWeight: 'bold',
                        textDecoration: 'none'
                    }}>
                        📧 contact@navrobotec.com
                    </a>

                    <Link href="https://linkedin.com" style={{
                        fontSize: '1.2rem',
                        color: '#00e5ff',
                        fontWeight: 'bold',
                        textDecoration: 'none'
                    }}>
                        💼 Connect on LinkedIn
                    </Link>
                </div>
            </section>

            <section className={styles.section} style={{ marginTop: '4rem' }}>
                <h2>Core Use Cases & Applications</h2>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3>Defense Drones</h3>
                        <p>Secure, deterministic flight profiles with non-reliant architectures.</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Agriculture</h3>
                        <p>Heavy-lift capable stabilization loops suitable for massive payloads.</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Swarm Robotics</h3>
                        <p>High-efficiency compute ensuring enough headroom for multi-agent networking.</p>
                    </div>
                    <div className={styles.card}>
                        <h3>Research Platforms</h3>
                        <p>Transparent architectural access for universities and institutions.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
