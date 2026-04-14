"use client";

import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LoadingScreen.module.css";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onFinished }: { onFinished: () => void }) {
    const { progress } = useProgress();
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (progress === 100) {
            // Small delay for smooth transition
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onFinished, 500); // Wait for fade out
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [progress, onFinished]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <div className={styles.content}>
                        <div className={styles.labelGroup}>
                            <motion.span
                                className={styles.status}
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                INITIALIZING VAYU STACK
                            </motion.span>
                            <span className={styles.percentage}>{Math.round(progress)}%</span>
                        </div>

                        <div className={styles.barBackground}>
                            <motion.div
                                className={styles.bar}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            />
                        </div>

                        <div className={styles.footer}>
                            <span>SYSTEMS: ACTIVE</span>
                            <span>COMM: LINKED</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
