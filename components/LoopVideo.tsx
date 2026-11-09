"use client";

import { useEffect, useRef, useState } from "react";

/* A muted clip that plays only while it is on screen, and not at all for
   a visitor who has asked for less motion — they get the poster and the
   native controls instead. Below the fold, so preload stays at metadata. */

export default function LoopVideo({
  src,
  poster,
  label,
  className,
  controls = false,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  controls?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    if (controls) return;
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    watcher.observe(video);
    return () => watcher.disconnect();
  }, [controls]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      playsInline
      loop={!controls}
      preload="metadata"
      controls={controls || still}
      aria-label={label}
    />
  );
}
