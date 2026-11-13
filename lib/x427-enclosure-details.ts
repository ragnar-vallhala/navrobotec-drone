/* The long-form detail for the NAVIX X427 Enclosure page.
 *
 * Every fact comes from the enclosure's CAD model and its design notes
 * (README and LOCKED in Navix/enclosure). The part is in design: nothing has
 * been machined, assembled or tested, so nothing here is a measured result and
 * nothing claims a price, a date, a rating or a test. That is said once, in
 * STATUS. Mass figures are estimates from the CAD model. Values that are not
 * available read N/A. The drawings are the enclosure drawings in
 * Navix/diagrams, trimmed by scripts/make-drawings.py; the exploded and I/O
 * detail sheets are not used (they carry notes that differ from the design).
 */
import type { BoardPage } from "./board-page";
import type { Shot } from "./product-media";
import type { Feature, Group, Row } from "./x427-details";

const ALT = "NAVIX X427 Enclosure";
const TOP: Shot = {
  src: "/images/enclosure-top.45521f9a.webp",
  alt: `${ALT} from above: the connector openings, the LED and button holes, the engraved labels and the ribbed sides`,
  width: 1600,
  height: 1067,
};
const BOTTOM: Shot = {
  src: "/images/enclosure-bottom.195161e1.webp",
  alt: `${ALT} one case top side up and one upside down, showing the connector face and the flat bottom plate`,
  width: 1600,
  height: 900,
};
const IO: Shot = {
  src: "/images/enclosure-io.54801f1c.webp",
  alt: `${ALT}, close-up of the end with the USB-C and microSD openings`,
  width: 1600,
  height: 960,
};
const EXPLODED: Shot = {
  src: "/images/enclosure-exploded.1d161a53.webp",
  alt: `${ALT} pulled apart: the shell above, a flight controller board in the middle and the bottom plate below`,
  width: 1400,
  height: 1050,
};
const BRACKET: Shot = {
  src: "/images/enclosure-bracket-io.f6650540.webp",
  alt: `${ALT}, the USB-C end with a bolt-on bracket and its two mounting slots`,
  width: 1400,
  height: 1050,
};

const ON_BOARD: Group[] = [
  {
    title: "Construction",
    rows: [
      { label: "Material", value: "CNC-machined 6061-T6 aluminium" },
      { label: "Finish", value: "Bead blast, Type II black anodise" },
      { label: "Design", value: "Cap and plate: one machined shell and a bottom plate" },
      { label: "Parts", value: "Shell, bottom plate, two end brackets" },
      { label: "Fasteners", value: "M2 throughout. The screws enter from underneath, so no screw head shows on the top face" },
      { label: "Board retention", value: "Silicone washers and 3.0 mm location pins. No screw goes through the board" },
      { label: "Sealing", value: "None. No gasket and no IP rating" },
    ],
  },
  {
    title: "Mounting",
    rows: [
      { label: "Flight controller", value: "Generic: not tied to one vehicle's mounting pattern" },
      { label: "End brackets", value: "Two removable bolt-on brackets, one on each short end" },
      { label: "Stack pattern", value: "30.5 x 30.5 mm, as tapped M2 holes in the bottom plate" },
    ],
  },
  {
    title: "Availability",
    rows: [
      { label: "Price", value: "N/A" },
      { label: "Lead time", value: "N/A" },
      { label: "Availability", value: "N/A" },
    ],
  },
];

const OPENINGS: Row[] = [
  { label: "I/O end", value: "USB-C and microSD openings at one end, sized so the circuit board is not visible through them" },
  { label: "Connectors", value: "16 openings on the top face that hug the connector bodies" },
  { label: "Indicators and buttons", value: "LED and button holes on the top face" },
  { label: "Labels", value: "Engraved on the top face" },
];

const DIMENSIONS: Row[] = [
  { label: "Upper body", value: "93.95 x 52.00 mm" },
  { label: "Flange", value: "95.95 x 54.00 mm" },
  { label: "With both brackets", value: "113.95 x 54.00 mm" },
  { label: "Height", value: "16.60 mm, or 17.80 mm over the raised end badge at the USB-C end" },
  { label: "Mass (estimate)", value: "Shell about 59.8 g, bottom plate about 53.8 g, each bracket about 2.8 g. Estimates from the CAD model" },
];

const FEATURES: Feature[] = [
  {
    icon: "stack",
    title: "Machined from aluminium.",
    body: "The shell and the bottom plate are CNC-machined 6061-T6 aluminium, bead blasted and finished in Type II black anodise.",
    chips: ["6061-T6", "Bead blast", "Type II black anodise"],
  },
  {
    icon: "box",
    title: "A cap and a plate.",
    body: "One machined shell forms the walls and the roof, and a bottom plate closes it from underneath. The only other parts are two end brackets and M2 screws.",
    chips: ["One shell", "Bottom plate", "2 end brackets", "M2 screws"],
  },
  {
    icon: "ports",
    title: "A clean top face.",
    body: "No screw heads show on the top: the screws enter from underneath. Sixteen connector openings hug the connector bodies, with LED and button holes and engraved labels beside them.",
    chips: ["No screws on top", "16 connector openings", "Engraved labels"],
  },
  {
    icon: "hidden",
    title: "An I/O end that hides the board.",
    body: "The USB-C and microSD openings are at one end and sized so the circuit board is not visible through them.",
    chips: ["USB-C", "microSD", "LED and button holes"],
  },
  {
    icon: "wrench",
    title: "Two ways to mount it.",
    body: "Two removable bolt-on brackets fit the short ends, and a 30.5 x 30.5 mm stack pattern of tapped M2 holes is in the bottom plate. It is not tied to one vehicle's pattern.",
    chips: ["2 removable brackets", "30.5 x 30.5 mm", "Tapped M2 holes"],
  },
  {
    icon: "cpu",
    title: "A board held without a screw.",
    body: "Silicone washers and 3.0 mm location pins hold the board in place. No screw goes through it.",
    chips: ["Silicone washers", "3.0 mm pins", "No screw through the board"],
  },
];

const STATUS = [
  "The X427 Enclosure is in design. Nothing has been machined, assembled or tested yet.",
  "It is sold separately from the board. Price, lead time and availability are N/A for now: enquire to talk to an engineer about it.",
];

export const X427_ENCLOSURE_PAGE: BoardPage = {
  mediaKey: "x427-enclosure",
  badge: "Enclosure · Enquire",
  headline: "A machined aluminium case for the X427.",
  sub: "CNC 6061-T6, bead blasted and black anodised. One shell, one bottom plate, two removable end brackets, 16 connector openings and a clean top face.",
  waitlist: false,
  docsLink: false,
  introTitle: "A separate case, cut for the X427's connectors.",
  introBody:
    "The X427 Enclosure is sold on its own, apart from the board. It is a CNC-machined aluminium case in two main pieces, a shell and a bottom plate, with openings cut to the X427's connectors. It is not sealed: there is no gasket and no IP rating.",
  stats: [
    { value: "6061-T6", unit: "", label: "CNC aluminium" },
    { value: "16.60", unit: "mm", label: "height" },
    { value: "16", unit: "", label: "connector openings" },
    { value: "M2", unit: "", label: "every fastener" },
  ],
  gallery: {
    title: "The case, from above and below.",
    body: "The connector openings, the LED and button holes and the labels are all on the top face. The underside is a flat plate.",
    note: "These are renders of the CAD model, not photographs.",
    top: TOP,
    bottom: BOTTOM,
    third: { kind: "shot", shot: IO },
  },
  details: {
    title: "Pulled apart, and the brackets.",
    body: "The shell and the bottom plate come apart, and the board sits between them. Two bolt-on brackets fit the short ends and can be taken off.",
    shots: [
      { shot: EXPLODED, caption: "Shell, board and bottom plate, pulled apart." },
      { shot: BRACKET, caption: "A removable end bracket at the USB-C end, with its two mounting slots." },
    ],
  },
  drawings: {
    title: "Dimensions and sections.",
    body: "Drawings of the case. All dimensions are in millimetres.",
    renders: [
      {
        shot: { src: "/images/render-enclosure-flat.aedc91ba.webp", alt: "NAVIX X427 Enclosure seen from directly above, with the connector openings, the logo and the two end brackets", width: 1200, height: 800 },
        caption: "Top, straight on, with both brackets.",
      },
      {
        shot: { src: "/images/render-enclosure-side.4674b9ba.webp", alt: "NAVIX X427 Enclosure seen from the side at an angle, showing the ribbed top and the bracket feet", width: 1200, height: 800 },
        caption: "From the side.",
      },
    ],
    items: [
      {
        src: "/images/drawing-x427-enc-top-dims.7ed39ba4.webp",
        alt: "Top view drawing of the X427 Enclosure with its dimensions: 93.95 mm upper body, 95.95 mm flange and 113.95 mm with brackets along the length, 52.00 mm body and 54.00 mm flange across it, and a 9.0 mm bracket foot. Callouts mark the USB-C end pocket, the M2 corner screws, the raised end badge, the microSD slot, the 16 connector openings and the LED and button holes.",
        width: 1835,
        height: 1008,
        caption: "Top view.",
      },
      {
        src: "/images/drawing-x427-enc-bottom-dims.48c9d754.webp",
        alt: "Bottom view drawing of the X427 Enclosure, mirrored as seen from below, with 95.95 mm flange, 113.95 mm with brackets and 54.00 mm width. Callouts mark the flat marked underside, the M2 stack holes on a 30.5 x 30.5 mm pattern, the M2 by 10 corner screws, the bracket foot with access notches and the M2 vehicle slots.",
        width: 1834,
        height: 978,
        caption: "Bottom view, mirrored as seen from below.",
      },
      {
        src: "/images/drawing-x427-enc-side-end-dims.d73e7440.webp",
        alt: "Side view and end view drawings of the X427 Enclosure. The side view shows 113.95 mm with brackets, 95.95 mm flange, 16.60 mm height and 17.80 mm over the raised end badge. The end view of the I/O end shows 54.00 mm flange and 52.00 mm body width, the USB-C pocket, the microSD slot and the removable bracket with four countersunk screws.",
        width: 1834,
        height: 950,
        caption: "Side and end views.",
      },
      {
        src: "/images/drawing-x427-enc-sections.0d403859.webp",
        alt: "Two section drawings of the X427 Enclosure, along the long axis through the USB-C connector and across the connector row, showing the shell, bottom plate, brackets, board, silicone washers and screws, with 16.60 mm height and 54.00 mm flange and 52.00 mm body width.",
        width: 1835,
        height: 956,
        caption: "Sections through the case, along its length and across the connector row.",
      },
    ],
  },
  related: {
    label: "The board it is made for",
    title: "NAVIX X427",
    body: "The STM32F427 flight controller board that the openings in this case are cut for.",
    href: "/products/x427",
    link: "View the X427",
  },
  featuresTitle: "Six things worth knowing.",
  features: FEATURES,
  devTools: false,
  status: STATUS,
  specs: {
    onBoard: ON_BOARD,
    ports: OPENINGS,
    portsTitle: "Openings and markings",
    power: [],
    mechanical: DIMENSIONS,
    lastTitle: "Dimensions",
  },
  reportLinks: false,
  faq: [
    {
      q: "Is it sold separately from the board?",
      a: "Yes. The enclosure is its own product. Enquire and an engineer will reply.",
    },
    {
      q: "Is it available, and what does it cost?",
      a: "Price, lead time and availability are N/A for now. Enquire and an engineer will reply.",
    },
    {
      q: "What is it made of?",
      a: "CNC-machined 6061-T6 aluminium, bead blasted and finished in Type II black anodise.",
    },
    {
      q: "Is it waterproof?",
      a: "No. It is not sealed: there is no gasket and no IP rating.",
    },
    {
      q: "How do I mount it?",
      a: "Two removable bolt-on brackets on the short ends take M2 screws, and the bottom plate carries a 30.5 x 30.5 mm stack pattern as tapped M2 holes. The case is not tied to one vehicle's pattern.",
    },
    {
      q: "How is the board held?",
      a: "By silicone washers and 3.0 mm location pins. No screw goes through the board.",
    },
    {
      q: "Which fasteners does it use?",
      a: "M2 for every screw and tapped hole. The screws enter from underneath, so no screw head shows on the top face.",
    },
  ],
  closing: {
    title: "Ask about the enclosure.",
    body: "It is sold separately from the X427. Write with your questions and an engineer will reply.",
  },
};
