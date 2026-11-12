"use client";

import { useEffect } from "react";

/* The same reveal as Photo, for plain <img> tags that arrive as HTML (blog
   bodies). Marks every img[data-reveal] on the page data-ready once its file
   is downloaded and decoded. */
export default function RevealAll() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLImageElement>("img[data-reveal]:not([data-ready])").forEach((el) => {
      const show = () => el.setAttribute("data-ready", "");
      if (el.complete) {
        (el.naturalWidth > 0 ? el.decode().catch(() => {}) : Promise.resolve()).then(show);
        return;
      }
      const onLoad = () => el.decode().catch(() => {}).finally(show);
      el.addEventListener("load", onLoad, { once: true });
      el.addEventListener("error", show, { once: true });
      cleanups.push(() => el.removeEventListener("load", onLoad));
    });
    return () => cleanups.forEach((c) => c());
  }, []);
  return null;
}
