"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

/* Light or dark, for the pages people read.
 *
 * Offered on blogs and docs because that is where a reader sits for more than
 * a minute and actually has a preference, and because those are the only
 * pages built to work either way. The rest of the site is a light page with
 * dark bands composed into it; turning that dark inverts the composition
 * rather than re-theming it.
 *
 * So the choice is remembered but scoped. This component is rendered only
 * inside the reading layouts, which makes its own lifetime the right signal:
 * it applies the stored theme when it mounts and puts the page back to light
 * when it unmounts, so leaving for the homepage takes the dark with it and
 * coming back brings it again. The inline script in the layout does the same
 * for the first paint of a hard load, which this effect is too late for.
 */

type Theme = "light" | "dark";

export default function ThemeToggle() {
  /* Starts as null rather than "light": until the effect runs we do not know
     what the inline script chose, and rendering a confident wrong label is
     worse than rendering none. */
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    let stored: Theme | null = null;
    try {
      const value = localStorage.getItem("navrobotec.theme");
      if (value === "dark" || value === "light") stored = value;
    } catch {
      /* Private mode, or storage disabled. Light, and no memory of it. */
    }

    const current =
      stored ?? ((root.dataset.theme as Theme | undefined) ?? "light");
    root.dataset.theme = current;
    setTheme(current);

    /* Leaving the reading pages. React runs this and the next layout's
       effects in one commit, so moving between /blogs and /docs does not
       flash light in between. */
    return () => {
      root.dataset.theme = "light";
    };
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
