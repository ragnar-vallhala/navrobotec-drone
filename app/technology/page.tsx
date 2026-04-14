import Link from 'next/link';
import styles from './page.module.css';

export default function Technology() {
    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h1>Technology Stack</h1>
                <p>The foundation of autonomous supremacy.</p>
            </div>

            <section className={`${styles.techSection} ${styles.overview}`}>
                <h2>What is Vayu?</h2>
                <p>
                    Vayu is a clean-sheet autonomous drone flight control stack designed from the
                    ground up to eliminate dependency on foreign monolithic architectures like PX4 and ArduPilot.
                </p>
            </section>

            <section className={`${styles.techSection} ${styles.architecture}`}>
                <h2>System Architecture</h2>
                <div className={styles.layers}>
                    <div className={styles.layerCard}>
                        <h3>4. Vayu Stack</h3>
                        <p>High-level guidance, autonomy, and advanced navigation components.</p>
                    </div>
                    <div className={styles.layerCard}>
                        <h3>3. VAIOS (Execution Layer)</h3>
                        <p>Real-time scheduler, inter-task communication (SPSC queues), and execution environment.</p>
                    </div>
                    <div className={styles.layerCard}>
                        <h3>2. NavHAL</h3>
                        <p>Hardware Abstraction Layer ensuring the core stack is agnostic of silicon vendors.</p>
                    </div>
                    <div className={styles.layerCard}>
                        <h3>1. Hardware</h3>
                        <p>Custom PCB, STM32 microcontrollers, IMUs, embedded sensors, and ESCs.</p>
                    </div>
                </div>
            </section>

            <section className={`${styles.techSection} ${styles.dataFlow}`}>
                <h2>Data Flow Pipeline</h2>
                <div className={styles.flowDiagram}>
                    <div className={styles.flowNode}>Sensors</div>
                    <div className={styles.flowArrow}>→</div>
                    <div className={styles.flowNode}>Estimation</div>
                    <div className={styles.flowArrow}>→</div>
                    <div className={styles.flowNode}>Control</div>
                    <div className={styles.flowArrow}>→</div>
                    <div className={styles.flowNode}>Actuation</div>
                </div>
            </section>

            <section className={`${styles.techSection} ${styles.controlSystem}`}>
                <h2>Control System</h2>
                <p>
                    Our flight controller features an ultra-fast <strong>Cascaded PID</strong> system that splits
                    stabilization into external Angle and internal Rate loops, prioritizing extreme angular velocity responsiveness.
                </p>
            </section>

            <section className={`${styles.techSection} ${styles.differentiation}`}>
                <h2>Differentiation</h2>
                <p>
                    Unlike <strong>PX4</strong> or <strong>ArduPilot</strong>, which try to be everything for everyone,
                    Vayu is purpose-built. We discard heavy POSIX-like overhead in favor of raw bare-metal predictability,
                    using lock-free SPSC queues to eliminate interrupt jitter.
                </p>
            </section>
        </div>
    );
}
