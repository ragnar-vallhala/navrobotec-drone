# NAVRobotec Brand Design Rules

## Color Palette

| Token              | Hex       | Usage                                               |
| ------------------ | --------- | --------------------------------------------------- |
| Primary Background | `#ffffff` | Page body, section backgrounds                      |
| Dark Primary       | `#1a1a2e` | Navbar, footer, darkest UI surfaces                 |
| Dark Secondary     | `#16213e` | Sub-surfaces, secondary dark panels                 |
| Dark Elevated      | `#0f3460` | Cards, elevated elements on dark bg                 |
| Body Text          | `#1a1a2e` | All body text on light backgrounds                  |
| Accent Pink        | `#e94560` | Hover states, highlights, CTAs, decorative emphasis |
| Accent Blue        | `#16213e` | Secondary accents, link underlines                  |

> White body text (`#ffffff`) and peach (`#f8cba6`) secondary text are reserved **exclusively** for elements with a dark background (navbar, footer).

---

## Typography

### Headings — Times New Roman

- Font: `"Times New Roman", Times, serif`
- Weight: `700` (Bold)
- Letter-spacing: `-0.02em` globally; individual overrides apply in hero
- Usage: All `h1`–`h6` elements

### Body — Courier New

- Font: `"Courier New", Courier, monospace`
- Weight: `400` (Regular)
- Usage: All `body`, `p`, `span`, subtext, captions

### Hero Typography

| Class                             | Size      | Weight | Letter-spacing     |
| --------------------------------- | --------- | ------ | ------------------ |
| `.titleAccent` (VAYU / SKIES)     | `7rem`    | `800`  | `0.5em`            |
| `.titleSecondary` (MASTERING THE) | `3rem`    | `300`  | `0.3em`            |
| `.subtext` (cycling tagline)      | `1.25rem` | `400`  | default, monospace |

- All hero text is **centered** over the video background
- `.titleAccent` has `text-shadow: 0 4px 20px rgba(0,0,0,0.4)` for legibility over video
- `.titleSecondary` uses `text-transform: uppercase`

---

## Logo Lockup

```
NAVR [spinning SVG icon] BOTEC
```

- The SVG replaces the letter **"O"** visually
- Icon spins continuously at `8s linear infinite`
- The icon uses `filter: invert(1)` on dark backgrounds
- On hover, the icon transitions to `#e94560` via CSS filter (`0.3s ease`)
- The text **NAVR** and **BOTEC** do **not** change color on hover
- The whole logo scales up `1.08x` on hover with a `0.3s ease` transition

---

## Navbar

- Fixed, full-width, `height: 80px`, `z-index: 1000`
- **Over hero:** `background: rgba(26, 26, 46, 0.5)` with `backdrop-filter: blur(10px)`
- **After scroll:** Solid `#1a1a2e` (no transparency)
- Nav links: color `#f8cba6`, hover → `#e94560`
- Contact button: `[ Contact ]` bracket notation, brackets use `#f8cba6`, hover → `#e94560`
- Font: `0.8rem`, `font-weight: 600`, `letter-spacing: 1.5px`, uppercase

---

## Footer

- Background: `#1a1a2e`
- Text: `#f8cba6`
- Logo lockup identical to navbar, with spin animation
- Link hover: `#e94560`
- 3-column grid: Brand description | Quick Links | Connect

---

## Sections & Layout

- Page padding: `0 8rem` horizontal
- Section min-height: `100vh`
- Content max-width: `600px` (for readability in text-heavy sections)
- **Card borders:** `1px solid rgba(0,0,0,0.1)` on white backgrounds
- **Highlight card borders:** `1px solid rgba(0,0,0,0.1)` bottom border

### Layout Variants

| Class         | Alignment                                 |
| ------------- | ----------------------------------------- |
| `.highlights` | Left-aligned (default)                    |
| `.problem`    | Image left + content right, space-between |
| `.traction`   | Right-aligned                             |

---

## Animations

- Hero text: staggered `framer-motion` fade-up on scroll (`once: true`)
- Subtext cycling: `AnimatePresence` + `setInterval(2000ms)`, slide + fade
- Scroll-triggered sections: `fadeInUp` — `opacity 0→1`, `y 20→0`, `duration: 0.8s`
- Logo spin: `8s linear infinite`
- Logo hover scale: `transform: scale(1.08)`, `transition: 0.3s ease`
- Icon hover color: `transition: filter 0.3s ease`

---

## Buttons

```css
.primaryBtn   — Dark fill, white text, [ bracket ] notation
.secondaryBtn — Transparent, uppercase, spaced letters
```

- CTA hover: color shifts to `#e94560`

---

## Images

- Section images use `border-radius: 12px` and `box-shadow: 0 10px 30px rgba(0,0,0,0.1)`
- Mission section image: `max-width: 55%`, left column
