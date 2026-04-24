"use client";

import { motion } from 'framer-motion';

interface SplitTextProps {
    children: string;
    isHovered: boolean;
    accentColor?: string;
}

const SplitText = ({ children, isHovered, accentColor = 'var(--color-accent)' }: SplitTextProps) => {
    return (
        <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
            <span style={{ display: 'inline-flex' }}>
                {children.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial={false}
                        animate={{ y: isHovered ? '-100%' : '0%' }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                            delay: i * 0.02
                        }}
                        style={{ display: 'inline-block', whiteSpace: 'pre' }}
                    >
                        {char}
                    </motion.span>
                ))}
            </span>
            <span style={{ display: 'inline-flex', position: 'absolute', top: '100%', left: 0 }}>
                {children.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial={false}
                        animate={{ y: isHovered ? '-100%' : '0%' }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                            delay: i * 0.02
                        }}
                        style={{ display: 'inline-block', whiteSpace: 'pre', color: accentColor }}
                    >
                        {char}
                    </motion.span>
                ))}
            </span>
        </span>
    );
};

export default SplitText;
