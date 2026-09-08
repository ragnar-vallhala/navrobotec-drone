"use client";

import { useEffect, useRef } from "react";

/* A section that advances through its own children as you scroll past it.
 *
 * It publishes two things and decides nothing about how they look:
 *   • `data-step` and `--progress` on itself — which step, and how far through
 *     the whole track the reader is;
 *   • `data-step-state` of "past" | "active" | "next" on every descendant
 *     marked `data-step-item`.
 *
 * No React state, so a scroll never re-renders anything: the handler writes
 * two attributes and a custom property, and nothing else.
 *
 * `data-enhanced` is what turns the behaviour on at all, and it is set on
 * mount. Without JavaScript — or when the reader has asked for reduced motion
 * — it is absent, the CSS leaves the section at its natural height, and every
 * step is on the page at once. The sequence changes which step is *featured*,
 * never whether the content is reachable, and there is no frame that has to
 * arrive for the section to be readable.
 */
export default function ScrollSteps({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-step-item]"),
    );
    if (items.length === 0) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let listening = false;
    let lastStep = -1;

    const paint = (index: number, progress: number) => {
      if (index !== lastStep) {
        lastStep = index;
        el.dataset.step = String(index);
        items.forEach((item, i) => {
          item.dataset.stepState =
            i === index ? "active" : i < index ? "past" : "next";
        });
      }
      el.style.setProperty("--progress", progress.toFixed(4));
    };

    /* Handled on the scroll event itself rather than coalesced into
       requestAnimationFrame. A pending frame that never arrives — a
       backgrounded tab is the ordinary case — leaves an "is a frame already
       queued" flag stuck on and the section wedged at whichever step it was
       on. The work here is one getBoundingClientRect and one attribute write,
       and the browser already fires scroll at most once per frame. */
    const measure = () => {
      const rect = el.getBoundingClientRect();
      // The track is one viewport taller than its travel: the stage is pinned
      // for `travel` pixels, and that is the distance the steps are spread
      // over. A track shorter than the viewport cannot pin, so it is left as
      // the plain list.
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) {
        paint(0, 0);
        return;
      }
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      paint(Math.min(items.length - 1, Math.floor(progress * items.length)), progress);
    };

    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("resize", measure, { passive: true });
      } else {
        window.removeEventListener("scroll", measure);
        window.removeEventListener("resize", measure);
      }
    };

    const sync = () => {
      if (motion.matches) {
        listen(false);
        delete el.dataset.enhanced;
        delete el.dataset.step;
        el.style.removeProperty("--progress");
        items.forEach((item) => delete item.dataset.stepState);
        lastStep = -1;
        return;
      }
      el.dataset.enhanced = "";
      listen(true);
      measure();
    };

    sync();
    motion.addEventListener("change", sync);

    return () => {
      motion.removeEventListener("change", sync);
      listen(false);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
