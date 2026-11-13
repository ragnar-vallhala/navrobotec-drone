/* Board renders for the product pages: Blender stills of the X427 on a dark
 * ground, cropped to the frames that show them by scripts/make-x427-renders.py.
 * The hash in each name is the file's content, so new artwork lands on a new
 * URL. */
export type Shot = { src: string; alt: string; width: number; height: number };

const TOP_ALT = "NAVIX X427 flight controller, top view";
const BOTTOM_ALT = "NAVIX X427 flight controller, bottom view";

/* The /products opening: a wide crop for the page frame and a squarer one for
   phones, where the frame is 4:3. */
export const PRODUCTS_OPENING: { wide: Shot; narrow: Shot } = {
  wide: {
    src: "/images/products-hero-wide.237fbb67.webp",
    alt: TOP_ALT,
    width: 2000,
    height: 857,
  },
  narrow: {
    src: "/images/products-hero-narrow.95f7b5d5.webp",
    alt: TOP_ALT,
    width: 1200,
    height: 900,
  },
};

/* Pages with their own board renders, by product slug. Every other product
   keeps the image from the catalogue, or the Coming soon frame. `card` is the
   tile on the /products grid. */
export const PRODUCT_MEDIA: Record<
  string,
  { hero: Shot; gallery: Shot[]; card: Shot }
> = {
  x427: {
    hero: {
      src: "/images/x427-top.9bcebc80.webp",
      alt: TOP_ALT,
      width: 1600,
      height: 1067,
    },
    gallery: [
      {
        src: "/images/x427-bottom.ff144dd4.webp",
        alt: BOTTOM_ALT,
        width: 1200,
        height: 514,
      },
    ],
    card: PRODUCTS_OPENING.narrow,
  },
  /* The X427 Mini: one Blender still from Navix/stills/mini, cut to 4:3 by
     hand (the board on black), used for the card and the page. */
  "x427-mini": {
    hero: {
      src: "/images/product-x427-mini.05aebc0d.webp",
      alt: "NAVIX X427 Mini flight controller, top view at an angle",
      width: 1400,
      height: 1050,
    },
    gallery: [],
    card: {
      src: "/images/product-x427-mini.05aebc0d.webp",
      alt: "NAVIX X427 Mini flight controller, top view at an angle",
      width: 1400,
      height: 1050,
    },
  },
};

/* The waitlist popup's image panel is a fixed 5:4 box. These two renders are
   cropped to exactly 5:4 by scripts/make-x427-renders.py with the whole board
   in frame, so nothing is cut at any size. There are only two source stills
   (top and bottom), so there are two slides. */
export const POPUP_SHOTS: Shot[] = [
  {
    src: "/images/x427-popup-top.dbd9ff15.webp",
    alt: TOP_ALT,
    width: 1200,
    height: 960,
  },
  {
    src: "/images/x427-popup-bottom.02163c04.webp",
    alt: BOTTOM_ALT,
    width: 1200,
    height: 960,
  },
];

/* A product has published details when it has its own renders. Every other
   product is listed by name only, with a Coming soon frame, until its details
   are published. */
export function hasDetails(slug: string): boolean {
  return slug in PRODUCT_MEDIA;
}

/* Pages that have published text but no render: the card and the page show
   the words on the dark Coming soon tile. */
const TEXT_ONLY = ["fc-h747"];

export function hasPage(slug: string): boolean {
  return hasDetails(slug) || TEXT_ONLY.includes(slug);
}

export function kindOf(slug: string): "board" | "airframe" {
  return slug.startsWith("airframe") ? "airframe" : "board";
}

export function kindLabel(slug: string): string {
  return kindOf(slug) === "airframe" ? "Airframe" : "Flight controller";
}
