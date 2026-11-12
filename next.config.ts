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

  /* Pictures are resized at build time, not on request: see
     scripts/make-image-variants.mjs for why. */
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      /* The pre-generated sizes. Not "immutable": the names carry the source's
         name and width, not a hash of its bytes, so replaced artwork has to be
         able to show up within a day. */
      {
        source: "/_v/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  /* A self-contained server bundle in .next/standalone, so the runtime image
     carries a node process and its actual dependencies rather than the whole
     node_modules tree — which here means three.js, GSAP, mermaid and KaTeX.
     Only read by `next build`. */
  output: "standalone",

  /* /wishlist was this page's first name, briefly. A rename is not a reason
     for a link to stop working. */
  async redirects() {
    return [
      { source: "/wishlist", destination: "/products", permanent: true },
      /* The technical report is gone as a single reference; its chapters live on
         as the NavHAL, VaiOS and Vayu books. Old links land on the right book
         page, and anything else under /docs/report on the hub. */
      { source: "/docs/report/:part(navhal|vaios|vayu)/:part2(navhal|vaios|vayu)-:section", destination: "/docs/:part/:section", permanent: false },
      { source: "/docs/report/:path*", destination: "/docs", permanent: false },
    ];
  },
};

export default nextConfig;
