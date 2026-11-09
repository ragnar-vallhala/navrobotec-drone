import type { NextConfig } from "next";

/* Security headers. They live here rather than in nginx so they travel with
   the image to every deployment (compose, cluster); the compose proxy
   sets none of these, so nothing is sent twice.

   The CSP keeps 'unsafe-inline' for scripts and styles: Next's own bootstrap
   and flight-data scripts, the theme script in the layout and next/font and
   React style attributes are all inline, and a nonce would force every page
   to be rendered per request. Everything else is locked to this origin, and
   the site loads no third-party scripts. 'unsafe-eval' is for the dev server
   only. */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${
    process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"
  }`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  /* Browsers ignore this over plain http, so it only bites in production. */
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

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
