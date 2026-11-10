"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./WaitlistCarousel.module.css";
import type { Shot } from "@/lib/product-media";

/* A small slideshow of the X427 renders already on the site.
 *
 * Fixed size: it fills whatever positioned box it is placed in, and every
 * slide is `contain`ed in that box, so the card does not jump between slides.
 * Only the first slide loads eagerly; the others are lazy.
 *
 * Moves on by itself every 3 seconds unless the visitor prefers reduced
 * motion. It stops while the pointer is over it or focus is inside it, and
 * stops for good once the visitor moves it by hand (arrows, dots, keys,
 * swipe), so it never fights them. Arrow keys work when it has focus. */

const ADVANCE_MS = 3000;
const SWIPE_PX = 40;

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
    </svg>
  );
}

export default function WaitlistCarousel({
  shots,
  sizes,
  label,
}: {
  shots: Shot[];
  sizes: string;
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false); // pointer over or focus inside
  const [manual, setManual] = useState(false); // moved by hand: stop for good
  const [reduced, setReduced] = useState(true); // true until known: no motion first
  const drag = useRef<number | null>(null);
  const id = useId();
  const n = shots.length;

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const on = () => setReduced(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);

  const auto = !reduced && !held && !manual;
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), ADVANCE_MS);
    return () => clearInterval(t);
  }, [auto, n]);

  const go = useCallback(
    (to: number) => {
      setManual(true);
      setIndex(((to % n) + n) % n);
    },
    [n],
  );

  return (
    <div
      className={styles.carousel}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      }}
      onPointerDown={(e) => { drag.current = e.clientX; }}
      onPointerUp={(e) => {
        if (drag.current === null) return;
        const dx = e.clientX - drag.current;
        drag.current = null;
        if (Math.abs(dx) >= SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
      }}
      onPointerCancel={() => { drag.current = null; }}
    >
      <div
        id={id}
        className={styles.track}
        style={{ transform: `translateX(-${index * 100}%)` }}
        aria-live={auto ? "off" : "polite"}
      >
        {shots.map((shot, i) => (
          <div
            key={shot.src}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
            aria-hidden={i === index ? undefined : true}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes={sizes}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
              className={styles.image}
            />
          </div>
        ))}
      </div>

      <button type="button" className={`${styles.arrow} ${styles.prev}`} aria-label="Previous render" aria-controls={id} onClick={() => go(index - 1)}>
        <Chevron dir="left" />
      </button>
      <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Next render" aria-controls={id} onClick={() => go(index + 1)}>
        <Chevron dir="right" />
      </button>
      <div className={styles.dots}>
        {shots.map((shot, i) => (
          <button
            key={shot.src}
            type="button"
            className={styles.dot}
            aria-label={`Show render ${i + 1} of ${n}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
