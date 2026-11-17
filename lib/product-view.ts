import type { BoardPage } from "./board-page";
import { H747_PAGE } from "./fc-h747-details";
import {
  hasPage,
  kindLabel,
  PRODUCT_MEDIA,
  type Shot,
} from "./product-media";
import type { Product } from "./products";
import type { WaitlistProduct } from "./waitlist";
import { X427_ENCLOSURE_PAGE } from "./x427-enclosure-details";
import { X427_MINI_PAGE } from "./x427-mini-details";
import { X427_PAGE } from "./x427-details";
import type { Row } from "./x427-details";

/* The shape the catalogue pages draw from.
 *
 * Nothing is added here: every field is read from the product row, the
 * product's details file (lib/*-details.ts) or its renders. A product with no
 * details file simply has fewer sections, and a section with nothing behind it
 * is not drawn. There is no price, rating, stock figure or delivery date in the
 * data, so none is shown. */

const PAGES: Record<string, BoardPage> = {
  x427: X427_PAGE,
  "x427-mini": X427_MINI_PAGE,
  "fc-h747": H747_PAGE,
  "x427-enclosure": X427_ENCLOSURE_PAGE,
};

export type GalleryItem =
  | { kind: "image"; shot: Shot; label: string }
  /* Line art is served as it is, so it is not put through the image loader. */
  | { kind: "drawing"; shot: Shot; label: string }
  | { kind: "video"; src: string; poster: string; alt: string; from: number; label: string };

export type SpecGroup = { title: string; rows: Row[] };
export type DocLink = { label: string; href: string; note?: string; external?: boolean };

export type ProductView = {
  gallery: GalleryItem[];
  bullets: string[];
  description: { paragraphs: string[]; points: { title: string; body: string }[]; status: string[] };
  specs: SpecGroup[];
  docs: DocLink[];
  addon: { label: string; title: string; body: string; href: string; link: string } | null;
  drawings: { src: string; alt: string; width: number; height: number; caption: string }[];
  faq: { q: string; a: string }[];
  waitlist: WaitlistProduct | false;
};

/* The one word for where a product stands. Products with no published page
   are listed by name only. */
export function availabilityOf(product: Product): string {
  return hasPage(product.slug) && product.status ? product.status : "Coming soon";
}

export function categoryOf(product: Product): string {
  return hasPage(product.slug) && product.kicker
    ? product.kicker
    : kindLabel(product.slug);
}

/* The card's picture, if the product has one. */
export function cardShot(slug: string): Shot | undefined {
  return PRODUCT_MEDIA[slug]?.card;
}

export function waitlistFor(slug: string): WaitlistProduct | false {
  const page = PAGES[slug];
  return page ? page.waitlist : false;
}

export function oneLine(product: Product): string {
  return hasPage(product.slug) ? product.summary : "";
}

export function buildView(product: Product): ProductView {
  const page = PAGES[product.slug];
  const media = PRODUCT_MEDIA[product.slug];

  const seen = new Set<string>();
  const gallery: GalleryItem[] = [];
  const addImage = (shot: Shot | undefined, label: string, kind: "image" | "drawing" = "image") => {
    if (!shot || seen.has(shot.src)) return;
    seen.add(shot.src);
    gallery.push({ kind, shot, label });
  };

  if (media) addImage(media.hero, "Render");
  for (const shot of media?.gallery ?? []) addImage(shot, "Render");
  if (page?.gallery) {
    addImage(page.gallery.top, "Render");
    addImage(page.gallery.bottom, "Render");
    const third = page.gallery.third;
    if (third.kind === "video") {
      gallery.push({
        kind: "video",
        src: third.src,
        poster: third.poster,
        alt: third.label,
        from: third.from,
        label: "Video",
      });
    } else {
      addImage(third.shot, "Render");
    }
  }
  for (const { shot, caption } of page?.details?.shots ?? []) addImage(shot, caption);
  for (const { shot, caption } of page?.drawings?.renders ?? []) addImage(shot, caption);

  const bullets = page
    ? page.stats.map((s) => [s.value, s.unit, s.label].filter(Boolean).join(" ").replace(/\s+/g, " "))
    : [];

  const description = page
    ? {
        paragraphs: [page.sub, page.introBody],
        points: page.features.map((f) => ({ title: f.title, body: f.body })),
        status: page.status,
      }
    : {
        paragraphs: hasPage(product.slug) && product.summary ? [product.summary] : [],
        points: [],
        status: [],
      };

  const specs: SpecGroup[] = page
    ? [
        ...page.specs.onBoard,
        ...(page.specs.ports.length
          ? [{ title: page.specs.portsTitle ?? "Ports and interfaces", rows: page.specs.ports }]
          : []),
        ...(page.specs.power.length ? [{ title: "Power design", rows: page.specs.power }] : []),
        ...(page.specs.mechanical.length
          ? [{ title: page.specs.lastTitle ?? "Mechanical", rows: page.specs.mechanical }]
          : []),
      ]
    : hasPage(product.slug) && product.specs.length
      ? [{ title: "Specifications", rows: product.specs }]
      : [];

  const docs: DocLink[] = [];
  const drawings = (page?.drawings?.items ?? []).map((item) => ({
    src: item.src,
    alt: item.alt,
    width: item.width,
    height: item.height,
    caption: item.caption.replace(/\.$/, ""),
  }));
  if (page?.reportLinks) {
    docs.push(
      { label: "VaiOS performance and benchmarks", href: "/docs/vaios/performance", note: "Docs" },
    );
  }
  if (page && page.docsLink !== false) {
    docs.push({ label: "Documentation", href: "/docs", note: "Docs" });
  }

  return {
    gallery,
    bullets,
    description,
    specs,
    docs,
    addon: page?.related
      ? { label: "Add-on", title: page.related.title, body: page.related.body, href: page.related.href, link: page.related.link }
      : null,
    drawings,
    faq: page?.faq ?? [],
    waitlist: page ? page.waitlist : false,
  };
}
