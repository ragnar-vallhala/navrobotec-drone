import type { Metadata } from "next";
import { Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SITE_URL } from "../lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* Three faces, each with a job.
 *
 * The site loaded Inter, Poppins, Outfit, Caveat and JetBrains Mono — five
 * downloads before the first paragraph was legible, with body copy set in a
 * geometric display face, which is most of why the old pages read badly at
 * paragraph sizes.
 *
 * Space Grotesk has character at display sizes and suits a company that
 * builds instruments. Geist gets out of the way at paragraph sizes, which
 * matters because the docs are long. Geist Mono is the instrument voice, and
 * its tabular figures keep a column of numbers aligned. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NAVRobotec — Sovereign software for autonomous flight",
    template: "%s — NAVRobotec",
  },
  description:
    "VaiOS is a sovereign robotics runtime built from the silicon up: a hard real-time core, a hardware layer that speaks to the register, and VAYU flying on top. No black boxes, no foreign dependencies in the flight path.",
  openGraph: {
    type: "website",
    siteName: "NAVRobotec",
    title: "NAVRobotec — Sovereign software for autonomous flight",
    description:
      "A hard real-time flight stack owned end to end: NavHAL at the hardware, VaiOS as the operating system, VAYU in the air.",
  },
};

/* Applied before the first paint, or the page renders light and then flips —
 * which is worse than not offering the choice. Deliberately not reading
 * prefers-color-scheme: this is a light site with dark bands by design, and
 * dark is something the reader asks for rather than something inferred. */
const THEME_SCRIPT = `try{var t=localStorage.getItem("navrobotec.theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${spaceGrotesk.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* The homepage frame is a CSS background, which the browser cannot
            discover until it has parsed the stylesheet. These tell it now,
            with the same conditions the stylesheet uses, so exactly one of
            them is fetched and the first paint is not waiting on CSS. */}
        <link
          rel="preload"
          as="image"
          href="/images/vayu-hero.webp"
          media="(orientation: landscape), (min-width: 60rem)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/vayu-hero-portrait.webp"
          media="(orientation: portrait) and (max-width: 60rem)"
        />
      </head>
      <body>
        {/* First in the tab order: past the nav, into the page. */}
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
