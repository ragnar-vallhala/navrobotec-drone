# NAVRobotec — design rules

The site sells a flight control stack: hard real time, microsecond deadlines,
every layer auditable. It should read like an instrument — precise, dense with
real numbers, quiet everywhere it is not saying something.

Everything below is defined once in `app/globals.css`. Reference the tokens;
never hardcode a hex or a family name.

---

## Ground

**Light by default, with dark bands.** The page is paper; the hero and the
closing call are near-black. Long-form pages (`/blogs`, `/docs`) carry a theme
toggle, because that is where a reader sits for more than a minute and actually
has a preference. The choice is stored and applies site-wide — a setting that
silently stops working when you navigate is worse than not offering one.

| Token | Light | Role |
|---|---|---|
| `--paper` | `#f7f9f8` | the page |
| `--paper-2` | `#edf2ef` | tinted band, stripes |
| `--card` | `#ffffff` | panels above the page |
| `--ink` | `#0b1512` | headings |
| `--ink-2` | `#35443e` | body |
| `--muted` | `#6b7a73` | captions, labels |
| `--line` / `--line-strong` | `#dde5e0` / `#c4d0ca` | structure |

`:root[data-theme="dark"]` swaps those same names. Every rule in the site is
written against them, so nothing else has to know which theme is on.

**Always-dark bands** do not swap: `--band`, `--band-2`, `--band-text`,
`--band-muted`. Apply with the `.band` class, which also re-tones headings,
labels and buttons for the dark ground. In dark mode the band lifts instead of
sinking, so it still reads as a band rather than dissolving into the page.

## Signal

Emerald, from the VAYU render. **Two of them, because one green cannot serve
both grounds:**

- `--signal` `#05966a` — on paper. Dark enough to read.
- `--signal-lit` `#35e0a1` — on near-black. Bright enough to read.

Using the wrong one is the easiest mistake to make here. Inside `.band`, use
`--signal-lit`; the `.label-signal` and `.btn-*` classes already switch.

One accent, for one thing: the live value. Anything emerald should be a number,
a state, or the thing you are meant to click.

## Type

Three faces, each with a job. The site previously loaded five and set body copy
in a geometric display face, which is most of why it read badly at paragraph
sizes.

| Token | Face | Used for |
|---|---|---|
| `--font-display` | Space Grotesk | `h1`–`h6`, the `.display` class |
| `--font-sans` | Geist | body, UI — anything read at length |
| `--font-data` | Geist Mono | labels, nav, and every number |

Scale classes: `.display`, `.h1`, `.h2`, `.h3`, `.lede`, `.body`, `.small`,
`.label`, `.data`. All fluid via `clamp`, so no media query per level.

`.data` carries `font-variant-numeric: tabular-nums` — a column of numbers
lines up, and a changing value does not shuffle the ones beside it.

## Layout

One measure and one gutter for the whole site: `--measure` (76rem),
`--measure-prose` (44rem), `--gutter`. Use `.shell` for the column and
`.section` / `.section-tight` for vertical rhythm. Pages that invent their own
are half of every alignment problem.

`--bar` (68px) is the fixed header. `.page` clears it; `.page-flush` opts out
for a page opening on a band.

## Motion

One entrance — `.rise` — and it ends visible. Stagger with
`animation-delay` in the page's own module.

**Never animate opacity from 0 on scroll.** The old homepage used
`viewport: { once: false, amount: 0.3 }`; a section taller than the viewport
can never be 30% visible, so it never animated in and sat at `opacity: 0`
permanently. Half the page was invisible. Motion is for arrival, never for
legibility.

`prefers-reduced-motion` is honoured globally.

## Rules that are not negotiable

1. **Nothing that matters is invisible.** No scroll-linked opacity, no reveal
   that can leave text unreadable if a frame never arrives.
2. **The first screen works with no video, no WebGL and no JavaScript.** Those
   are decoration on a page that already says what this is.
3. **Real text in real elements.** No per-letter span splitting for hover
   effects: it made the nav read "H O M E H O M E" to a screen reader and to
   every crawler.
4. **`aria-current`, not a class,** for the page you are on — announced as well
   as shaded.
5. **Focus is always visible,** in the signal colour, on every interactive
   element.

## Migration shim

`app/globals.css` ends with a block mapping the old dark-only token names
(`--text-primary`, `--color-accent`, `--bg-primary`, …) onto the system above,
so pages whose CSS has not been rewritten still pick up the palette and follow
the theme.

It is a bridge, not an API. Delete it when this comes back empty:

```bash
grep -rn "var(--text-primary" app components
```
