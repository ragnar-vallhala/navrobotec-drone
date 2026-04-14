import styles from '../shared.module.css';

export default function Vision() {
    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h1>Company <span className={styles.gradientText}>Vision</span></h1>
                <p>The roadmap to sovereign autonomous technology.</p>
            </div>

            <section className={styles.section}>
                <h2>Sovereignty in Autonomy</h2>
                <p>
                    We are committed to building 100% indigenous autonomous systems. Reliance on global open-source giants creates
                    a black box effect that limits the ability of defense and enterprise to truly own their platform capabilities.
                </p>
            </section>

            <section className={styles.section}>
                <h2>The Problem at Scale</h2>
                <p>
                    Today's drones operate on bloated software stacks designed to support thousands of different hardware configurations.
                    The result is a labyrinth of abstractions that compromise performance, reliability, and security at critical moments.
                </p>
            </section>

            <section className={styles.section}>
                <h2>Our Approach: Vertical Integration</h2>
                <p>
                    By developing our own hardware abstraction (NavHAL), execution environment (VAIOS), and control logic (Vayu),
                    we achieve deep hardware-software synergy. This vertical integration allows for determinism and performance
                    impossible with fragmented stacks.
                </p>
            </section>

            <section className={styles.section}>
                <h2>Long-Term Horizon</h2>
                <p>
                    Vayu is not just a drone controller. It is becoming a universal, scalable platform for all autonomous mobility:
                    from aerial swarms to ground robotics and advanced defense interception systems.
                </p>
            </section>
        </div>
    );
}
