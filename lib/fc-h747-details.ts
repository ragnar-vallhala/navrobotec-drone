/* The page for the NAVIX-SMH747 flight controller module (slug fc-h747).
 *
 * The board is in design. Everything here is design intent from the product
 * brief, not a measured or built result. There is no render yet, so the page
 * has no pictures. Deliberately not stated: sensor part numbers, size, price,
 * dates, benchmarks, connector or module form factors, how many carrier boards
 * there will be, how the voting works, any certification, and any claim about
 * the VaiOS or NavHAL stack.
 */
import type { BoardPage } from "./board-page";
import type { Feature, Group, Row } from "./x427-details";

const ON_BOARD: Group[] = [
  {
    title: "Processor",
    rows: [
      { label: "MCU", value: "STM32H747, dual core" },
      { label: "Cortex-M4", value: "Manages flight and the internal sensors" },
      { label: "Cortex-M7", value: "Manages autonomy and external modules and hardware" },
      { label: "Scripting", value: "A Lua-based app environment, in design" },
    ],
  },
  {
    title: "Sensors and storage",
    rows: [
      { label: "IMUs", value: "3, with a voting-based system" },
      { label: "Barometers", value: "3, with a voting-based system" },
      { label: "Magnetometers", value: "3, with a voting-based system" },
      { label: "Logs", value: "Internal QSPI" },
    ],
  },
];

const PORTS: Row[] = [
  { label: "Motor outputs", value: "8 DShot" },
  { label: "UART", value: "External" },
  { label: "CAN", value: "External" },
  { label: "SPI", value: "External" },
  { label: "USB", value: "External" },
  { label: "SD", value: "External" },
  { label: "Ethernet", value: "External" },
  { label: "CSI", value: "External, for a camera" },
];

const ARCHITECTURE: Row[] = [
  { label: "Form", value: "A small compute module that plugs into a carrier board" },
  { label: "Carrier boards", value: "Small to large, with different capabilities, external peripherals and compute of their own" },
  { label: "Aim", value: "Safety-critical use. This is a design intent, not a certification" },
  { label: "Status", value: "In design" },
];

const FEATURES: Feature[] = [
  {
    icon: "cpu",
    title: "Two cores, two jobs.",
    body: "An STM32H747 has two cores. The Cortex-M4 manages flight and the internal sensors. The Cortex-M7 manages autonomy and the external modules and hardware.",
    chips: ["STM32H747", "Cortex-M4: flight", "Cortex-M7: autonomy"],
  },
  {
    icon: "sensors",
    title: "Triple redundancy, with voting.",
    body: "The module is designed with three IMUs, three barometers and three magnetometers. A voting-based system works across them.",
    chips: ["3 IMUs", "3 barometers", "3 magnetometers", "Voting"],
  },
  {
    icon: "code",
    title: "Your own apps, in Lua.",
    body: "The module is designed to have a Lua-based scripting environment, so users can develop apps and put them on it.",
    chips: ["Lua", "User apps"],
  },
  {
    icon: "power",
    title: "Eight DShot motor outputs.",
    body: "The module will have 8 DShot outputs for motors.",
    chips: ["8 DShot"],
  },
  {
    icon: "stack",
    title: "A module for carrier boards.",
    body: "It is a small compute module that plugs into a carrier board. Carrier boards range from small to large, with different capabilities, external peripherals and compute of their own.",
    chips: ["Compute module", "Carrier boards"],
  },
  {
    icon: "ports",
    title: "External interfaces, internal logging.",
    body: "UART, CAN, SPI, USB, SD, Ethernet and a CSI camera interface are available externally. Logs go to internal QSPI.",
    chips: ["UART", "CAN", "SPI", "USB", "SD", "Ethernet", "CSI", "QSPI logs"],
  },
];

export const H747_PAGE: BoardPage = {
  badge: "Flight controller · In design",
  headline: "A dual-core flight controller module.",
  sub: "An STM32H747 with triple-redundant sensors and eight DShot outputs, designed to plug into a carrier board and aimed at safety-critical use.",
  waitlist: false,
  introTitle: "One module, many carrier boards.",
  introBody:
    "The NAVIX-SMH747 is a small compute module built around the dual-core STM32H747. It plugs into a carrier board, and carrier boards can be small or large. It is in design: this page describes what the module is meant to be, not a built board, and there are no renders yet.",
  stats: [
    { value: "2", unit: "cores", label: "Cortex-M4 and Cortex-M7" },
    { value: "3", unit: "of each", label: "IMU, barometer, magnetometer" },
    { value: "8", unit: "DShot", label: "motor outputs" },
    { value: "Lua", unit: "apps", label: "scripting, in design" },
  ],
  featuresTitle: "Six things worth knowing.",
  features: FEATURES,
  devTools: false,
  status: [
    "The NAVIX-SMH747 is in design. No board has been built or tested, and nothing here is a measured result.",
    "Enquire to talk to an engineer about it.",
  ],
  specs: { onBoard: ON_BOARD, ports: PORTS, power: [], mechanical: ARCHITECTURE, lastTitle: "Architecture" },
  reportLinks: false,
  faq: [
    {
      q: "Is it available?",
      a: "Not yet. The NAVIX-SMH747 is in design. Enquire and an engineer will reply.",
    },
    {
      q: "What does triple redundancy cover?",
      a: "Three IMUs, three barometers and three magnetometers, with a voting-based system.",
    },
    {
      q: "What is a carrier board?",
      a: "The NAVIX-SMH747 is a small compute module. It plugs into a carrier board, which carries the external peripherals and can have compute of its own. Carrier boards range from small to large, with different capabilities.",
    },
    {
      q: "Can I write my own apps?",
      a: "That is the plan. The module is designed to have a Lua-based scripting environment where users can develop apps and put them on it. It is in design and not available yet.",
    },
    {
      q: "Is it certified?",
      a: "No. It is in design and has no certification. It is aimed at safety-critical use, which is a design intent only.",
    },
  ],
  closing: {
    title: "Talk to an engineer.",
    body: "It is in design. Write with your questions about the module or the carrier boards and an engineer will reply.",
  },
};
