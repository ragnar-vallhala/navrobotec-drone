import type { Shot } from "./product-media";
import type { Feature, Group, Row } from "./x427-details";

/* Everything that differs between the long product pages (the X427 and the X427
   Mini). The layout is one component, components in app/products/[slug]/
   BoardPage.tsx; the words, numbers and pictures come from here. */
export type BoardPage = {
  /* The key in PRODUCT_MEDIA for this board's pictures. */
  mediaKey?: string;
  badge: string;
  headline: string;
  sub: string;
  /* Which product's waitlist the page offers, if any. The student offer is
     for the X427 only (`studentOffer`). */
  waitlist: false | "x427" | "x427-mini";
  studentOffer?: boolean;
  introTitle: string;
  introBody: string;
  stats: { value: string; unit: string; label: string }[];
  gallery?: {
    title: string;
    body: string;
    note: string;
    top: Shot;
    bottom: Shot;
    third:
      | { kind: "video"; src: string; poster: string; label: string; from: number }
      | { kind: "shot"; shot: Shot };
  };
  /* Sketch pictures, for a board with no renders yet. `hero` replaces the
     coming-soon tile; `diagrams` adds the "How it fits together" section. */
  sketches?: { hero?: boolean; diagrams?: boolean; more?: boolean };
  /* A short strip of design principles under the numbers. */
  principles?: string[];
  /* Text blocks (label, title, paragraphs) shown between the sketches and the status. */
  notes?: { label: string; title: string; body: string[] }[];
  /* Things that are not decided yet, as label and one honest line. */
  open?: { title: string; rows: Row[] };
  featuresTitle: string;
  features: Feature[];
  /* Left out for a board that has no software-stack claims to make yet. */
  platform?: { body: string; hardwareName: string; hardwareBody: string };
  /* False hides the developer tools section (the X427 pages show it). */
  devTools?: boolean;
  status: string[];
  specs: { onBoard: Group[]; ports: Row[]; power: Row[]; mechanical: Row[]; lastTitle?: string };
  /* The X427's specification section links into the report chapters. */
  reportLinks: boolean;
  faq: { q: string; a: string }[];
  closing: { title: string; body: string };
};
