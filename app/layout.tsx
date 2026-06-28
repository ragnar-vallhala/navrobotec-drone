import type { Metadata } from "next";
import { Inter, Poppins, Outfit, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SITE_URL } from "../lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins"
});
const outfit = Outfit({
  weight: ["900"],
  subsets: ["latin"],
  variable: "--font-outfit"
});
const caveat = Caveat({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-caveat"
});
// Real monospace for code (the site's --font-mono is Poppins, used for labels).
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NAVROBOTEC",
  description: "Man Meets Machine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${outfit.variable} ${caveat.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        <Navbar />
        <main className="content-wrapper">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
