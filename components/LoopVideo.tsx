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
  from = 0,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  controls?: boolean;
  /* Seconds to start (and restart) from, to skip an opening title card. */
  from?: number;
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
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    watcher.observe(video);
    return () => watcher.disconnect();
  }, []);

  /* A loop that restarts at `from` rather than 0. */
  const restart = () => {
    const video = ref.current;
    if (!video || from <= 0) return;
    video.currentTime = from;
    video.play().catch(() => {});
  };
  const seekStart = () => {
    const video = ref.current;
    if (video && from > 0 && video.currentTime < from) video.currentTime = from;
  };

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      playsInline
      loop={from <= 0}
      onLoadedMetadata={seekStart}
      onPlay={seekStart}
      onEnded={restart}
      preload="metadata"
      controls={controls || still}
      aria-label={label}
    />
  );
}
