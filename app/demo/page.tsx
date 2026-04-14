import styles from '../shared.module.css';

export default function Demo() {
    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h1><span className={styles.gradientText}>System Showcase</span></h1>
                <p>Witness Vayu in action across various environments.</p>
            </div>

            <section className={styles.section}>
                <h2>Flight Stabilization Tests</h2>
                <p>Testing the cascaded PID angle and rate loops on a test rig to ensure optimal tuning.</p>
                <div className={styles.mediaPlaceholder}>[ Stabilization Video Placeholder ]</div>
            </section>

            <section className={styles.section}>
                <h2>Bench Testing & Hardware</h2>
                <p>Validating NavHAL interfaces, SPI sensor data acqusition, and lock-free execution queues.</p>
                <div className={styles.mediaPlaceholder}>[ Bench Test Video Placeholder ]</div>
            </section>

            <section className={styles.section}>
                <h2>Control Response Curves</h2>
                <p>Raw telemetry logs via VAIOS demonstrating ultra-low latency inputs and step response settling times.</p>
                <div className={styles.mediaPlaceholder}>[ Telemetry Graphs Placeholder ]</div>
            </section>
        </div>
    );
}
