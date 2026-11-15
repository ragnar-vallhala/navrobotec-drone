"use client";

import { useRef, useState } from "react";
import BoardPhoto from "@/components/BoardPhoto";
import ComingSoon from "@/components/ComingSoon";
import LoopVideo from "@/components/LoopVideo";
import type { GalleryItem } from "@/lib/product-view";
import styles from "./catalogue.module.css";

/* Thumbnails on the left (a row under the picture on a phone), the chosen
   item large. The first item is what the server renders. */
export default function Gallery({
  items,
  kind,
  name,
}: {
  items: GalleryItem[];
  kind: "board" | "airframe";
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const strip = useRef<HTMLUListElement>(null);
  const slide = (dir: -1 | 1) => {
    const el = strip.current;
    if (!el) return;
    const vertical = el.scrollHeight > el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1;
    el.scrollBy({ [vertical ? "top" : "left"]: dir * (vertical ? el.clientHeight * 0.8 : el.clientWidth * 0.8), behavior: "smooth" });
  };
  const item = items[index];

  if (!item) {
    return (
      <div className={styles.gallery}>
        <div className={styles.stage}>
          <ComingSoon kind={kind} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      {items.length > 1 ? (
        <div className={styles.thumbsWrap}><div className={styles.thumbsInner}>
          {items.length > 5 ? (
            <button type="button" className={styles.arrow} aria-label="Earlier pictures" onClick={() => slide(-1)}>
              <span className={styles.chevPrev} aria-hidden />
            </button>
          ) : null}
        <ul className={styles.thumbs} ref={strip} aria-label={`${name} pictures`}>
          {items.map((t, i) => (
            <li key={`${t.kind}-${i}`}>
              <button
                type="button"
                className={styles.thumb}
                aria-label={`${t.label}${t.kind === "video" ? "" : `, picture ${i + 1}`}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                onMouseEnter={() => setIndex(i)}
              >
                {t.kind === "video" ? (
                  // eslint-disable-next-line @next/next/no-img-element -- poster still
                  <img src={t.poster} alt="" className={styles.thumbImg} />
                ) : t.kind === "drawing" ? (
                  // eslint-disable-next-line @next/next/no-img-element -- line art, served as it is
                  <img src={t.shot.src} alt="" className={styles.thumbDrawing} loading="lazy" />
                ) : (
                  <span className={styles.thumbFrame}>
                    <BoardPhoto shot={t.shot} sizes="5rem" />
                  </span>
                )}
                {t.kind === "video" ? <span className={styles.play} aria-hidden>&#9654;</span> : null}
              </button>
            </li>
          ))}
        </ul>
          {items.length > 5 ? (
            <button type="button" className={styles.arrow} aria-label="More pictures" onClick={() => slide(1)}>
              <span className={styles.chevNext} aria-hidden />
            </button>
          ) : null}
        </div></div>
      ) : null}

      <figure className={styles.main}>
        <div
          className={`${styles.stage} ${item.kind === "drawing" ? styles.stageDrawing : ""} ${item.kind === "image" ? styles.zoomable : ""}`}
          data-zoom={zoom && item.kind === "image" ? "on" : undefined}
          style={zoom ? ({ "--zx": `${zoom.x}%`, "--zy": `${zoom.y}%` } as React.CSSProperties) : undefined}
          onMouseMove={item.kind === "image" ? onMove : undefined}
          onMouseLeave={() => setZoom(null)}
        >
          {item.kind === "video" ? (
            <LoopVideo
              key={item.src}
              src={item.src}
              poster={item.poster}
              label={item.alt}
              className={styles.video}
              from={item.from}
              controls
            />
          ) : item.kind === "drawing" ? (
            // eslint-disable-next-line @next/next/no-img-element -- line art, served as it is: the image loader would re-encode it lossy
            <img
              key={item.shot.src}
              src={item.shot.src}
              alt={item.shot.alt}
              width={item.shot.width}
              height={item.shot.height}
              className={styles.drawingImg}
            />
          ) : (
            <BoardPhoto
              key={item.shot.src}
              shot={item.shot}
              sizes="(max-width: 60rem) 100vw, 40rem"
              priority={index === 0}
            />
          )}
        </div>
      </figure>
    </div>
  );
}
