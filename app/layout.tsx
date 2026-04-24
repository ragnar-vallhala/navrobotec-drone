import type { Metadata } from "next";
import { Inter, Poppins, Outfit, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

export const metadata: Metadata = {
  title: "NAVROBOTEC",
  description: "Man Meets Machine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${outfit.variable} ${caveat.variable}`} suppressHydrationWarning>
      <body>
        <Navbar />
        <main className="content-wrapper">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
