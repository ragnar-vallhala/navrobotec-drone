import "server-only";
import { PRODUCT_IMAGES } from "./product-images";

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
 * so a card can link to the form already saying which one it is about.
 *
 * The map keeps every label the API knows, including products not currently
 * listed — unpublishing a row must not lose the label that files the
 * enquiries already recorded against it. Which of them to *offer* is a
 * different question, and interestsFor() answers it from the catalogue. */
export const INTEREST_BY_SLUG: Record<string, string> = {
  "fc-f446": "NAVIX-SMF446",
  "fc-h747": "NAVIX-SMH747",
  "airframe-sub250": "Vidyut",
  x427: "NAVIX X427",
};

/* The chips to offer, for the products actually on the site.
 *
 * Derived from the catalogue rather than from the map, so an unpublished
 * product stops being offered without anybody remembering to edit a constant —
 * and the labels still come from the map, so this never sends the API a
 * product name it would silently drop. */
export function interestsFor(products: Product[]): string[] {
  return products
    .map((product) => INTEREST_BY_SLUG[product.slug])
    .filter((label): label is string => Boolean(label));
}

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
/* NAVIX X427 ships with the site, so it is listed whether or not the API's
   products table has a row for it. When the table does (db/010 in the api
   repo), that row wins and this one is not used. */
const X427: Product = {
  id: "bundled-x427",
  slug: "x427",
  name: "NAVIX X427",
  part: "Rev A",
  kicker: "Flight controller",
  summary: "The flight controller board the VaiOS and NavHAL stack runs on.",
  status: "Available to enquire",
  image: "",
  imageIsRender: true,
  specs: [
    { label: "Board", value: "NAVIX X427 flight controller, Rev A" },
    { label: "Size", value: "84.9 x 44.1 mm" },
    { label: "Layers", value: "4" },
    {
      label: "Interfaces",
      value:
        "USB-C, microSD, CAN, 3x I2C, SPI, RC, GPS, TELEM1, SERIAL4, ADC, PWM main and aux, debug",
    },
    { label: "Stack", value: "NavHAL / VaiOS / VAYU" },
  ],
  published: true,
  placeholder: false,
  updatedAt: "2026-11-09T00:00:00Z",
};

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
      ? {
          status: "ok",
          /* A row with no image of its own takes the render bundled with the
             site for that slug. */
          products: [
            ...(products as Product[]),
            ...((products as Product[]).some((p) => p.slug === X427.slug)
              ? []
              : [X427]),
          ]
            .map((p) => ({
              ...p,
              image: p.image || PRODUCT_IMAGES[p.slug] || "",
            }))
            .sort((a, b) => (a.slug === X427.slug ? -1 : b.slug === X427.slug ? 1 : 0)),
        }
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
