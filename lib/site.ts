/**
 * Canonical site origin, used for sitemap, robots.txt and metadata.
 *
 * navrobotec.in is the canonical host. navrobotec.com serves the same site, so
 * metadata, the sitemap and robots.txt always name .in: search engines then
 * treat the two names as one.
 *
 * Override per-environment with NEXT_PUBLIC_SITE_URL (a preview URL, a local
 * host). Empty counts as unset: `??` alone falls back only on undefined, and
 * a build system that declares the variable without a value hands this an
 * empty string, which then reaches `new URL("")` and fails the build with
 * "Invalid URL" — a long way from the line that caused it.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://navrobotec.in"
).replace(/\/+$/, "");
