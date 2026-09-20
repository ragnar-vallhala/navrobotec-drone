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
  /* Path to the render, hashed by scripts/make-product-images.py. */
  image: string;
  imageIsRender: boolean;
  specs: Spec[];
  published: boolean;
  /* True while the row still holds the seeded stand-in copy. The page says so
     rather than presenting invented specifications as settled. */
  placeholder: boolean;
  updatedAt: string;
};

/* The chips the API validates against, keyed by slug.
 *
 * Fixed labels rather than the product names from the database: the API
 * checks them against kInterests and drops what it does not know, so renaming
 * a product must not silently stop recording who asked for it. Keyed by slug
 * so a card can link to the form already saying which one it is about. */
export const INTEREST_BY_SLUG: Record<string, string> = {
  "fc-f446": "NAVIX-SMF446",
  "fc-h747": "NAVIX-SMH747",
  "airframe-sub250": "Vidyut",
};

export const INTEREST_OPTIONS = Object.values(INTEREST_BY_SLUG);

/* The catalogue, and why this is two outcomes rather than a Product[].
 *
 * An empty catalogue and a catalogue that cannot be reached are the same []
 * and want opposite pages: one says there is nothing to show yet, the other
 * is our fault and must not imply the products were never real. The same
 * distinction is what lets a product page tell a slug nobody has used — a
 * genuine 404 — from an outage, which must not 404.
 *
 * One call, not one per product. The API rate-limits by caller at five
 * requests a minute and this fetch is server-side, so every visitor shares a
 * single bucket: a product page that asked for its own row and then for the
 * rest of the catalogue would spend two of those five on one page view. */
export type Catalogue =
  | { status: "ok"; products: Product[] }
  | { status: "unavailable" };

export async function getCatalogue(): Promise<Catalogue> {
  try {
    const response = await fetch(`${INTERNAL}/api/v1/products?site=drone`, {
      /* Never cached: the point of moving this out of the source is that
         correcting a row is not a deploy, and a cached page would make it one
         again. */
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return { status: "unavailable" };
    const body = await response.json();
    const products = body?.data?.products;
    return Array.isArray(products)
      ? { status: "ok", products: products as Product[] }
      : { status: "unavailable" };
  } catch {
    /* The API is down, or this is a build machine with no API to reach. The
       caller renders an honest state and says what happened; it does not fail
       the build or throw a 500 at a visitor. */
    return { status: "unavailable" };
  }
}

/* The flat form, for callers with nothing useful to say about an outage —
   the sitemap loses its product entries for one request and is still valid. */
export async function getProducts(): Promise<Product[]> {
  const catalogue = await getCatalogue();
  return catalogue.status === "ok" ? catalogue.products : [];
}
