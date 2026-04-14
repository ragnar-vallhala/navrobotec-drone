"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [percent, setPercent] = useState(0);

    useEffect(() => {
        return scrollYProgress.onChange((latest) => {
            setPercent(Math.round(latest * 100));
        });
    }, [scrollYProgress]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.label}>
                <span className={styles.fraction}>
                    {Math.min(4, Math.floor((percent / 100) * 4) + 1)} / 4
                </span>
                <span className={styles.percentage}>{percent}%</span>
            </div>
            <div className={styles.barBackground}>
                <motion.div className={styles.bar} style={{ scaleX }} />
            </div>
        </div>
    );
}
