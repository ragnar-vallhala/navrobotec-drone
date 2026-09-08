"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Mark from "./Mark";
import styles from "./Navbar.module.css";

/* The bar.
 *
 * Every link is one text node. The old one split each label into per-letter
 * spans and rendered the word twice for a hover roll, so the accessibility
 * tree — and anything reading the page without CSS, which includes a search
 * crawler — saw "H O M E H O M E". A hover effect is not worth the word.
 *
 * Over the homepage hero it is transparent and becomes solid on scroll. It
 * carries a scrim even when transparent, because "the hero image is dark
 * enough" is a promise about an image, and this has to be legible over
 * whatever the image turns out to be.
 */

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/vision", label: "Vision" },
  { href: "/technology", label: "Technology" },
  { href: "/blogs", label: "Blogs" },
  { href: "/docs", label: "Docs" },
  { href: "/team", label: "Team" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  /* The drawer is closed by the link that navigates, not by an effect
     watching for the pathname to change afterwards: the click is the event,
     and reacting to its consequence is a render later and one more thing to
     keep in step. */
  const [open, setOpen] = useState(false);

  /* Only the homepage opens on a dark band. Everywhere else the bar is solid
     from the first frame, rather than starting transparent over a light page
     that begins with text — which would make the links unreadable. */
  const overHero = pathname === "/";

  /* Only the hero page needs the listener; everywhere else `solid` is derived
     below, with no state and no effect at all. */
  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    /* Scheduled rather than called straight away: a setState in the body of an
       effect runs before paint and cascades a second render. A frame later is
       soon enough, and it still catches a page restored mid-scroll. */
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, [overHero]);

  /* An open drawer covers the page, so the page behind it must not scroll —
     otherwise closing the menu leaves you somewhere you never chose to be. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* Derived, not stored: off the hero the bar is solid from the first frame,
     which is one fewer thing that can be wrong on load. */
  const solid = !overHero || scrolled || open;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`${styles.bar} ${solid ? styles.solid : ""}`}
      data-open={open ? "" : undefined}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="NAVRobotec, home">
          <span className={styles.word}>NAVR</span>
          {/* The mark stands in for the O. Hidden from assistive technology:
              the label above already says the name, and an <img alt="O"> makes
              a screen reader spell the word out. */}
          <Mark className={styles.mark} />
          <span className={styles.word}>BOTEC</span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.link}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className={styles.contact}>
            Contact
          </Link>
        </nav>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
        >
          <span className={styles.bars} aria-hidden />
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Rendered always and hidden with `hidden`, so the markup is one thing
          in both states and nothing has to be re-created to open it. */}
      <div id="site-menu" className={styles.drawer} hidden={!open}>
        <nav aria-label="Primary, mobile">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.drawerLink}
              aria-current={isActive(link.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={styles.drawerLink}
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
