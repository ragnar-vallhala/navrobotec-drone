"use client";

import { useRef, useEffect } from 'react';
import styles from '../app/page.module.css';

export default function HeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const highResUrl = '/vid/Drone_Home.mp4';

        // Preload the high res video
        const preloadVideo = document.createElement('video');
        preloadVideo.src = highResUrl;
        preloadVideo.preload = 'auto';

        preloadVideo.oncanplaythrough = () => {
            if (videoRef.current) {
                const currentTime = videoRef.current.currentTime;
                videoRef.current.src = highResUrl;
                videoRef.current.currentTime = currentTime;
                videoRef.current.play().catch(() => { });
            }
        };
    }, []);

    return (
        <div className={styles.heroVideoContainer}>
            <video
                ref={videoRef}
                className={styles.heroVideo}
                src="/vid/Drone_Home_Compressed.mp4"
                autoPlay
                loop
                muted
                playsInline
            />
            {/* Overlay to ensure text readability */}
            <div className={styles.heroVideoOverlay}></div>
        </div>
    );
}
