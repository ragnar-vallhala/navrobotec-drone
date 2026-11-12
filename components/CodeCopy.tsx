"use client";

import { useEffect } from "react";

function copyText(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  // Previews are served over plain http, where navigator.clipboard is missing.
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    ta.remove();
    if (ok) resolve();
    else reject(new Error("copy failed"));
  });
}

/** Adds a language label and a Copy button to every code block in a [data-zoom] prose. */
export default function CodeCopy() {
  useEffect(() => {
    for (const pre of document.querySelectorAll<HTMLElement>("[data-zoom] pre")) {
      if (pre.dataset.copy) continue;
      pre.dataset.copy = "1";
      const wrap = document.createElement("div");
      wrap.className = "codeblock";
      pre.replaceWith(wrap);
      wrap.appendChild(pre);
      if (pre.dataset.lang) {
        const l = document.createElement("span");
        l.className = "codelang";
        l.textContent = pre.dataset.lang;
        wrap.appendChild(l);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "codecopy";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      let timer: ReturnType<typeof setTimeout> | undefined;
      btn.addEventListener("click", async () => {
        const code = (pre.querySelector("code") ?? pre).cloneNode(true) as HTMLElement;
        code.querySelectorAll(".tok-pr").forEach((n) => n.remove());
        const text = (code.textContent ?? "").replace(/\n$/, "");
        try {
          await copyText(text);
          btn.textContent = "Copied";
          btn.setAttribute("data-done", "");
        } catch {
          btn.textContent = "Press Ctrl+C";
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.textContent = "Copy";
          btn.removeAttribute("data-done");
        }, 1500);
      });
      wrap.appendChild(btn);
    }
  }, []);
  return null;
}
