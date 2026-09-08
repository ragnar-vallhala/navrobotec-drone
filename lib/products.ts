import "server-only";

/* The catalogue, read from the API at request time.
 *
 * Server-side, so the product data is in the HTML the crawler and the reader
 * both get, rather than appearing a moment later — and so the browser is
 * never told the API's internal address.
 *
 * Two different URLs, for two different callers. The browser reaches the API
 * through the proxy on the same origin, which is why NEXT_PUBLIC_API_URL is
 * empty everywhere; this code runs inside the container, where "same origin"
 * is this Next server and the API is a different one. API_INTERNAL_URL is
 * that hop, and it never reaches the client bundle because it has no
 * NEXT_PUBLIC_ prefix.
 */
const INTERNAL = process.env.API_INTERNAL_URL ?? "http://api:8848";

export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  part: string;
  kicker: string;
  summary: string;
  status: string;
  specs: Spec[];
  published: boolean;
  /* True while the row still holds the seeded stand-in copy. The page says so
     rather than presenting invented specifications as settled. */
  placeholder: boolean;
  updatedAt: string;
};

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${INTERNAL}/api/v1/products?site=drone`, {
      /* Never cached: the point of moving this out of the source is that
         correcting a row is not a deploy, and a cached page would make it one
         again. */
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const body = await response.json();
    const products = body?.data?.products;
    return Array.isArray(products) ? (products as Product[]) : [];
  } catch {
    /* The API is down, or this is a build machine with no API to reach. The
       page renders its empty state and says what happened; it does not fail
       the build or throw a 500 at a visitor. */
    return [];
  }
}
