import styles from '../shared.module.css';

export default function Team() {
    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h1>The <span className={styles.gradientText}>Team</span></h1>
                <p>Built by engineers obsessed with control and autonomy.</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3>Ashutosh Vishwakarma</h3>
                    <p>
                        <strong>Founder & Core Hardware Engineer</strong><br />
                        Embedded systems developer and controls theory specialist.
                        Responsible for the VAIOS architecture, NavHAL implementation, and cascaded PID tuning.
                    </p>
                </div>

                <div className={styles.card}>
                    <h3>Core Team</h3>
                    <p>
                        Currently scaling the core group. Looking for brilliant embedded developers, AI/ML engineers for computer vision,
                        and aerospace engineers to join the project.
                    </p>
                </div>

                <div className={styles.card}>
                    <h3>Mentorship</h3>
                    <p>
                        <strong>Dr. Vijay K. Pal</strong>
                        <br />
                        Providing critical guidance in control systems design, dynamic modeling, and autonomous navigation architectures.
                    </p>
                </div>
            </div>
        </div>
    );
}
