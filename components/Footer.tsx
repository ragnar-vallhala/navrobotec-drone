import Link from "next/link";
import Mark from "./Mark";
import styles from "./Footer.module.css";

/* The footer.
 *
 * The old one set an oversized "NAVROBOTEC" watermark behind the columns,
 * clipped by the footer edge — at most viewport widths it showed "NAV" and
 * read as a rendering fault rather than a flourish. Gone. What is left is the
 * three things a footer is for: what this is, where to go, how to reach us.
 */

const SECTIONS = [
  {
    title: "The stack",
    links: [
      { href: "/technology", label: "Technology" },
      { href: "/products", label: "Products" },
      { href: "/vision", label: "Vision" },
      { href: "/docs", label: "Documentation" },
      { href: "/blogs", label: "Engineering journal" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/team", label: "Team" },
      { href: "/investors", label: "Investors" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const SOCIAL = [
  { href: "https://www.linkedin.com/company/navrobotec/", label: "LinkedIn" },
  { href: "https://x.com/NAVRobotec", label: "X" },
  { href: "https://www.instagram.com/navrobotec", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand} aria-label="NAVRobotec, home">
            <span>NAVR</span>
            <Mark className={styles.mark} />
            <span>BOTEC</span>
          </Link>
          <p className={`small ${styles.blurb}`}>
            Sovereign software for autonomous flight — built from the silicon
            up.
          </p>
          <p className={`label ${styles.legal}`}>
            Navrobotec Private Limited
            <br />
            CIN U74909UP2025PTC226167
          </p>
        </div>

        {SECTIONS.map((section) => (
          <nav key={section.title} className={styles.col} aria-label={section.title}>
            <h2 className={`label ${styles.colTitle}`}>{section.title}</h2>
            <ul className={styles.list}>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={styles.col}>
          <h2 className={`label ${styles.colTitle}`}>Contact</h2>
          <ul className={styles.list}>
            <li>
              <a href="mailto:support@navrobotec.com" className={styles.link}>
                support@navrobotec.com
              </a>
            </li>
            <li>
              <a href="tel:+919596917316" className={`data ${styles.link}`}>
                +91 95969 17316
              </a>
            </li>
            <li className={styles.muted}>Ghaziabad, India</li>
          </ul>
          <ul className={`${styles.list} ${styles.social}`}>
            {SOCIAL.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.link}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`shell ${styles.bottom}`}>
        <p className="label">© {new Date().getFullYear()} NAVRobotec</p>
        <p className="label">All rights reserved</p>
      </div>
    </footer>
  );
}
