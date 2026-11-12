"use client";

import { useEffect, useRef } from "react";

/* For a picture painted by CSS (background-image), which cannot report that it
   has loaded. Put this inside the element that carries the background: it
   reads the URL from the computed style, downloads and decodes the file, then
   marks the parent data-ready. globals.css keeps the parent invisible until
   then (only when the page's script has run), so the picture appears whole
   instead of filling in from the top. */
export default function BgReady() {
  const mark = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const parent = mark.current?.parentElement;
    if (!parent) return;
    let dead = false;
    const show = () => {
      if (!dead) parent.setAttribute("data-ready", "");
    };
    const urls = [...getComputedStyle(parent).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1]);
    if (urls.length === 0) {
      show();
      return;
    }
    Promise.all(
      urls.map((u) => {
        const im = new Image();
        im.src = u;
        return im.decode().catch(() => {});
      }),
    ).then(show);
    return () => {
      dead = true;
    };
  }, []);
  return <span ref={mark} hidden />;
}
