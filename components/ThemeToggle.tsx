"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

/* Light or dark, for the pages people read.
 *
 * Offered on blogs and docs because that is where a reader sits for more than
 * a minute and actually has a preference. The choice is stored and applies to
 * the whole site: a setting that silently stops working when you navigate is
 * worse than not offering one.
 *
 * The value is applied before first paint by the inline script in the layout —
 * this component only reflects and changes it. Reading localStorage here
 * instead would flash the wrong theme on every load.
 */

type Theme = "light" | "dark";

export default function ThemeToggle() {
  /* Starts as null rather than "light": until the effect runs we do not know
     what the inline script chose, and rendering a confident wrong label is
     worse than rendering none. */
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current =
      (document.documentElement.dataset.theme as Theme | undefined) ?? "light";
    setTheme(current);
  }, []);

  const set = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("navrobotec.theme", next);
    } catch {
      /* Private mode, or storage disabled. The theme still applies for this
         page; it just will not be remembered, which is the right failure. */
    }
    setTheme(next);
  };

  return (
    <div className={styles.group} role="group" aria-label="Colour theme">
      {(["light", "dark"] as const).map((option) => (
        <button
          key={option}
          type="button"
          className={styles.option}
          aria-pressed={theme === option}
          onClick={() => set(option)}
        >
          <span aria-hidden className={styles.icon}>
            {option === "light" ? "☀" : "☾"}
          </span>
          {option === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
