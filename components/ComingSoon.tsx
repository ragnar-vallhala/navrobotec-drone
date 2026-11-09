import styles from "./ComingSoon.module.css";

/* The picture for a product with no render yet.
 *
 * Drawn, not photographed: a faint grid, registration marks at the corners and
 * a dashed outline of the kind of thing it will be — a board, or an aircraft.
 * It uses the band tokens, so it sits on the same dark ground as the renders
 * and says plainly what it is. */
export default function ComingSoon({
  kind,
  compact = false,
}: {
  kind: "board" | "airframe";
  compact?: boolean;
}) {
  return (
    <span className={styles.root} data-compact={compact || undefined}>
      <svg
        className={styles.art}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        focusable="false"
      >
        <defs>
          <pattern id="cs-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.14" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#cs-grid)" />
        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
          <path d="M16 36V16H36M364 16H384V36M384 264V284H364M36 284H16V264" />
        </g>
        <g
          fill="none"
          stroke="var(--signal-lit)"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          opacity="0.7"
        >
          {kind === "board" ? (
            <>
              <rect x="110" y="90" width="180" height="94" rx="10" />
              <circle cx="124" cy="104" r="4" />
              <circle cx="276" cy="104" r="4" />
              <circle cx="124" cy="170" r="4" />
              <circle cx="276" cy="170" r="4" />
              <rect x="150" y="116" width="60" height="42" rx="3" />
              <rect x="224" y="116" width="40" height="42" rx="3" />
            </>
          ) : (
            <>
              <path d="M200 76V196M200 76L190 100V176L200 196L210 176V100Z" />
              <path d="M190 120L120 150L124 160L190 150M210 120L280 150L276 160L210 150" />
              <path d="M193 186L172 196L174 202L195 196M207 186L228 196L226 202L205 196" />
              <circle cx="120" cy="140" r="16" />
              <circle cx="280" cy="140" r="16" />
            </>
          )}
        </g>
      </svg>
      <span className={styles.label}>Coming soon</span>
    </span>
  );
}
