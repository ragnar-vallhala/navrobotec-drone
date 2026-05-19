/**
 * Canonical site origin, used for sitemap, robots.txt and metadata.
 *
 * Defaults to the production domain; override per-environment by setting
 * NEXT_PUBLIC_SITE_URL (e.g. to a Vercel preview URL or a www. host).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://navrobotec.com"
).replace(/\/+$/, "");
