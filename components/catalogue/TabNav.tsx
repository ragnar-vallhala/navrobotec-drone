"use client";

import { useEffect, useState } from "react";
import styles from "./catalogue.module.css";

/* The section tabs; the one whose section is under the bar is highlighted. */
export default function TabNav({ tabs }: { tabs: { id: string; label: string }[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.3;
      let current = tabs[0]?.id ?? "";
      for (const t of tabs) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top <= line) current = t.id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = tabs[tabs.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [tabs]);

  return (
    <nav className={styles.tabs} aria-label="Product sections">
      <div className="shell">
        <ul>
          {tabs.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} aria-current={t.id === active ? "true" : undefined}>
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
