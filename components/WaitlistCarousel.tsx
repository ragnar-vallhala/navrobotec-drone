"use client";

import Image from "@/components/Photo";
import { useEffect, useState } from "react";
import styles from "./WaitlistCarousel.module.css";
import type { Shot } from "@/lib/product-media";

/* The X427 renders already on the site, swapping by themselves every 2
 * seconds. Purely decorative motion: no controls, no keyboard or pointer
 * handling, and it does not react to hover or focus.
 *
 * Every image fills the panel edge to edge (`cover`), so the card has the same
 * size on every slide. Only the first slide loads eagerly. Under reduced
 * motion the swap still happens but without a fade. */

const SWAP_MS = 2000;

export default function WaitlistCarousel({
  shots,
  sizes,
}: {
  shots: Shot[];
  sizes: string;
}) {
  const [index, setIndex] = useState(0);
  const n = shots.length;

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % n), SWAP_MS);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div className={styles.carousel}>
      {shots.map((shot, i) => (
        <div
          key={shot.src}
          className={`${styles.slide} ${i === index ? styles.on : ""}`}
          aria-hidden={i === index ? undefined : true}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes={sizes}
            loading={i === 0 ? "eager" : "lazy"}
            className={styles.image}
          />
        </div>
      ))}
    </div>
  );
}
