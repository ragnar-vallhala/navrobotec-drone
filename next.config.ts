import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* A self-contained server bundle in .next/standalone, so the runtime image
     carries a node process and its actual dependencies rather than the whole
     node_modules tree — which here means three.js, GSAP, mermaid and KaTeX.
     Only read by `next build`. */
  output: "standalone",

  /* /wishlist was this page's first name, briefly. A rename is not a reason
     for a link to stop working. */
  async redirects() {
    return [{ source: "/wishlist", destination: "/products", permanent: true }];
  },
};

export default nextConfig;
