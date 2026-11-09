/* Board renders for the product pages, keyed to the X427's KiCad model.
 * Cut-outs with transparency, built by scripts/make-x427-hero.py. The hash in
 * each name is the file's content, so new artwork lands on a new URL. */
export type Shot = { src: string; alt: string; width: number; height: number };

export const X427_MEDIA: Record<"top" | "bottom", Shot> = {
  top: {
    src: "/images/x427-top.3f7e3433.webp",
    alt: "NAVIX X427 flight controller, top view",
    width: 979,
    height: 503,
  },
  bottom: {
    src: "/images/x427-bottom.1ba0b240.webp",
    alt: "NAVIX X427 flight controller, bottom view",
    width: 980,
    height: 503,
  },
};

/* Pages with their own board renders, by product slug. Every other product
   keeps the image from the catalogue, or the Coming soon frame. */
export const PRODUCT_MEDIA: Record<
  string,
  { hero: Shot; gallery: Shot[] }
> = {
  x427: { hero: X427_MEDIA.top, gallery: [X427_MEDIA.bottom] },
};
