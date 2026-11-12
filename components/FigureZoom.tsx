"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import CodeCopy from "./CodeCopy";
import styles from "./FigureZoom.module.css";

/**
 * Click-to-zoom for every figure inside an element marked data-zoom. The
 * figures are SVG, so they stay sharp at any size. The lightbox scrolls, so on
 * a phone you pan around the enlarged figure; Esc, the close button or a tap
 * on the backdrop closes it.
 */
export default function FigureZoom() {
  const [fig, setFig] = useState<{ src: string; alt: string } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const imgs = () =>
      Array.from(document.querySelectorAll<HTMLImageElement>("[data-zoom] img"));
    for (const img of imgs()) {
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `Enlarge figure: ${img.alt || "figure"}`);
      img.style.cursor = "zoom-in";
    }
    const open = (img: HTMLImageElement) => setFig({ src: img.currentSrc || img.src, alt: img.alt });
    const onClick = (e: MouseEvent) => {
      const t = e.target;
      if (t instanceof HTMLImageElement && t.closest("[data-zoom]")) open(t);
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if ((e.key === "Enter" || e.key === " ") && t instanceof HTMLImageElement && t.closest("[data-zoom]")) {
        e.preventDefault();
        open(t);
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!fig) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFig(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [fig]);

  if (!fig) return <CodeCopy />;
  return (
    <>
    <CodeCopy />
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={fig.alt || "Figure"} onClick={() => setFig(null)}>
      <button ref={closeRef} type="button" className={styles.close} aria-label="Close figure" onClick={() => setFig(null)}>
        <X size={20} />
      </button>
      <div className={styles.scroller}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fig.src} alt={fig.alt} className={styles.img} onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
    </>
  );
}
