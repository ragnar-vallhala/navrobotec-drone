import type { Shot } from "./product-media";
import type { Feature, Group, Row } from "./x427-details";

/* Everything that differs between the long product pages (the X427 and the X427
   Mini). The layout is one component, components in app/products/[slug]/
   BoardPage.tsx; the words, numbers and pictures come from here. */
export type BoardPage = {
  /* The key in PRODUCT_MEDIA for this board's pictures. */
  mediaKey: string;
  badge: string;
  headline: string;
  sub: string;
  /* The X427 waitlist and the student offer are for the X427 only. */
  waitlist: boolean;
  introTitle: string;
  introBody: string;
  stats: { value: string; unit: string; label: string }[];
  gallery: {
    title: string;
    body: string;
    note: string;
    top: Shot;
    bottom: Shot;
    third:
      | { kind: "video"; src: string; poster: string; label: string; from: number }
      | { kind: "shot"; shot: Shot };
  };
  featuresTitle: string;
  features: Feature[];
  platform: { body: string; hardwareName: string; hardwareBody: string };
  status: string[];
  specs: { onBoard: Group[]; ports: Row[]; power: Row[]; mechanical: Row[] };
  /* The X427's specification section links into the report chapters. */
  reportLinks: boolean;
  faq: { q: string; a: string }[];
  closing: { title: string; body: string };
};
