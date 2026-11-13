/* The long-form detail for the NAVIX X427 Mini page.
 *
 * Taken from the Mini's own KiCad project (schematic, netlist and board
 * layout), checked line by line, not from the X427's files: the Mini's
 * pin-plan script is a copy of the X427's and several schematic notes are stale
 * copies too, so none of them are used here. The board is in design and has not
 * been built, so nothing on this page is a measured result and nothing claims
 * availability. The 1 MB / 256 KB memory figures are ST's for the
 * STM32F427VG, and "16 MB" is the W25Q128JV's 128 Mbit.
 */
import type { BoardPage } from "./board-page";
import type { Shot } from "./product-media";
import type { Feature, Group, Row } from "./x427-details";


const ALT = "NAVIX X427 Mini flight controller";
const TOP: Shot = {
  src: "/images/product-x427-mini-top.3d8ffae0.webp",
  alt: `${ALT}, top view`,
  width: 1600,
  height: 1066,
};
const BOTTOM: Shot = {
  src: "/images/product-x427-mini-bottom.9e5fb37d.webp",
  alt: `${ALT}, bottom view with the STM32F427`,
  width: 1600,
  height: 700,
};
const DETAIL: Shot = {
  src: "/images/product-x427-mini-detail.37246fc0.webp",
  alt: `${ALT}, close-up of the top side`,
  width: 1600,
  height: 980,
};

const ON_BOARD: Group[] = [
  {
    title: "Processor",
    rows: [
      { label: "MCU", value: "STM32F427VGT6 in LQFP100, 14 x 14 mm, 0.5 mm pitch" },
      { label: "Core", value: "Cortex-M4F at 180 MHz" },
      { label: "Memory", value: "1 MB flash, 192 KB SRAM plus 64 KB CCM SRAM" },
      { label: "I/O", value: "82 on the package, 58 used" },
      { label: "Clock", value: "8 MHz crystal; no RTC crystal fitted" },
      { label: "Debug", value: "SWD, plus a UART7 console" },
    ],
  },
  {
    title: "Sensors and storage",
    rows: [
      { label: "IMU", value: "LSM6DSOX on SPI1" },
      { label: "Barometer", value: "BMP585 on I2C1" },
      { label: "Compass", value: "Not on the board. Use the compass in the GPS module, over I2C2" },
      { label: "Flash", value: "W25Q128JV, 16 MB serial NOR flash on its own SPI bus (SPI2). There is no microSD slot" },
    ],
  },
  {
    title: "Indicators and controls",
    rows: [
      { label: "Status", value: "A blue status LED and an addressable RGB LED" },
      { label: "Buttons", value: "BOOT and RESET" },
      { label: "Buzzer and safety switch", value: "Their driver and input lines are on the GPS1 port; the board carries neither a buzzer nor a switch" },
    ],
  },
];

const PORTS: Row[] = [
  { label: "PWM MAIN", value: "10 pads: a servo-rail pin, channels 1 to 8 (motor outputs on timers 1 and 4), ground" },
  { label: "GPS1", value: "10 pads: USART1, I2C2, safety switch and LED lines, buzzer driver, 3.3 V and switched 5 V" },
  { label: "POWER1", value: "6 pads: power module input with battery voltage and current sense" },
  { label: "TELEM1", value: "6 pads: USART2 with flow control (CTS and RTS), on its own switched 5 V" },
  { label: "RC", value: "4 pads: USART6, with an inverter for SBUS and a pass-through for iBUS, CRSF and DSM" },
  { label: "SERIAL4", value: "6 pads: UART4 and I2C2. Second GPS, a UART rangefinder or a companion computer" },
  { label: "I2C", value: "4 pads, on I2C2" },
  { label: "CAN", value: "4 pads through a TJA1051T/3 transceiver. The bus termination parts are not fitted" },
  { label: "ADC", value: "3 pads, 6.6 V analogue input" },
  { label: "USB-C", value: "Device mode, full speed" },
  { label: "Debug", value: "6 pads: SWD and a UART7 console" },
];

const POWER: Row[] = [
  { label: "Inputs", value: "POWER1 (the power module's 5 V) and USB-C VBUS" },
  { label: "Priority", value: "A TPS2121 power mux gives POWER1 priority over USB. The inputs cannot back-feed each other, and the firmware can read which source is powering the board" },
  { label: "Over-voltage", value: "Each input is cut off at about 5.36 to 5.86 V (nominal 5.64 V) to protect the regulators behind it" },
  { label: "Logic supply", value: "Two 3.3 V LDOs (TLV757P), one dedicated to the sensors" },
  { label: "Servo rail", value: "Does not power the board. Feed POWER1 from a flight-controller BEC" },
  { label: "Peripheral 5 V", value: "Two switched 5 V ports, one for peripherals and one for telemetry, each with a fault flag and firmware control. Both are on at reset" },
  { label: "Budget", value: "The two switched ports together are budgeted at 1.5 A or less, so that POWER1 (two 1 A contacts) stays at 2 A or less" },
];

const MECHANICAL: Row[] = [
  { label: "Outline", value: "36.0 x 36.0 mm, 3 mm corner radius" },
  { label: "Stack-up", value: "4-layer, 1.6 mm, with an inner ground plane" },
  { label: "Mount", value: "Four M3 holes (3.2 mm) on the standard 30.5 x 30.5 mm pattern. Use rubber grommets or soft standoffs: the IMU needs vibration isolation, so do not hard-mount" },
  { label: "Ports", value: "2.00 mm solder-pad groups along the edges, each named in silkscreen" },
  { label: "Bring-up", value: "6 test pads: VBUS, 5 V, 3.3 V, battery voltage, battery current and ground" },
];

const FEATURES: Feature[] = [
  {
    icon: "cpu",
    title: "The same core as the X427.",
    body: "An STM32F427VGT6 runs a Cortex-M4F at 180 MHz with 1 MB of flash and 256 KB of SRAM, from an 8 MHz crystal. 58 of its 82 I/O pins are in use.",
    chips: ["180 MHz", "1 MB flash", "192 + 64 KB SRAM", "58 of 82 I/O used"],
  },
  {
    icon: "sensors",
    title: "An IMU, a barometer and flash for logs.",
    body: "An LSM6DSOX IMU on SPI1 and a BMP585 barometer on I2C. A 16 MB flash chip on its own SPI bus takes the place of the X427's microSD slot. There is no compass on the board: use the one in your GPS module.",
    chips: ["LSM6DSOX", "BMP585", "16 MB flash", "No onboard compass"],
  },
  {
    icon: "power",
    title: "Two power inputs, one clear order.",
    body: "A power mux gives the power module on POWER1 priority over USB, with no back-feed between them. Each input is cut off above about 5.6 V to protect the regulators behind it. Two switched 5 V ports report faults and can be turned off from firmware.",
    chips: ["POWER1 over USB", "Over-voltage cut-off", "2 switched 5 V ports"],
  },
  {
    icon: "ports",
    title: "The ports a small flight stack asks for.",
    body: "Eight motor outputs, GPS with safety-switch and buzzer lines, telemetry with flow control, one RC port for SBUS, iBUS, CRSF and DSM, a spare serial port, I2C, CAN, an analogue input, USB-C and a debug port.",
    chips: ["8 PWM", "CAN", "SBUS / CRSF / DSM", "USB-C"],
  },
  {
    icon: "size",
    title: "Small, on the standard mounting pattern.",
    body: "The board is 36 x 36 mm with four M3 holes on the standard 30.5 x 30.5 mm pattern. Soft-mount it: the IMU wants vibration isolation. Ports are 2 mm solder pads, so wires go straight to the board.",
    chips: ["36 x 36 mm", "30.5 mm mount", "4 layers", "6 test pads"],
  },
  {
    icon: "stack",
    title: "Built for the NavHAL / VaiOS / VAYU family.",
    body: "The Mini uses the same STM32F4-family, Cortex-M4 architecture as the X427 and as the NAVIXSM-F401RE our stack already runs on.",
    chips: ["STM32F4", "Cortex-M4F", "NavHAL", "VaiOS", "VAYU"],
  },
];

export const X427_MINI_PAGE: BoardPage = {
  mediaKey: "x427-mini",
  badge: "Flight controller · In design",
  headline: "The X427, made small.",
  sub: "An STM32F427 at 180 MHz, an IMU, a barometer, CAN and eight PWM outputs, on a 36 x 36 mm board with the standard 30.5 mm mounting pattern.",
  waitlist: "x427-mini",
  introTitle: "The same processor, on a board a quarter the size.",
  introBody:
    "The X427 Mini is a four-layer flight controller built around the same STM32F427 as the X427. Compared with the X427 it has one IMU instead of up to three, eight PWM outputs instead of fourteen, and onboard flash instead of a microSD slot. It is in design: this page describes the schematic and board layout, not a built board.",
  stats: [
    { value: "180", unit: "MHz", label: "Cortex-M4F" },
    { value: "8", unit: "PWM", label: "motor outputs" },
    { value: "16", unit: "MB", label: "onboard flash" },
    { value: "36 x 36", unit: "mm", label: "4-layer board" },
  ],
  gallery: {
    title: "The board, from above and below.",
    body: "The ports are solder pads along the edges. USB-C, the BOOT and RESET buttons and most of the small parts are on the top; the STM32F427 is on the bottom.",
    note: "These are renders of the design, not photographs of a built board.",
    top: TOP,
    bottom: BOTTOM,
    third: { kind: "shot", shot: DETAIL },
  },
  drawings: {
    title: "Board dimensions.",
    body: "A drawing of the board from its layout file. All dimensions are in millimetres.",
    renders: [
      {
        shot: { src: "/images/render-mini-flat.656dad2b.webp", alt: "NAVIX X427 Mini flight controller seen from directly above, USB-C on the left and solder pads along the edges", width: 1200, height: 800 },
        caption: "Top, straight on.",
      },
      {
        shot: { src: "/images/render-mini-side.77b8db67.webp", alt: "NAVIX X427 Mini flight controller seen at a low angle from the side", width: 1200, height: 800 },
        caption: "From the side.",
      },
    ],
    items: [
      {
        src: "/images/drawing-x427-mini-top-dims.af39248f.webp",
        alt: "Top side drawing of the NAVIX X427 Mini board with dimensions: 36.0 mm by 36.0 mm, mounting holes 30.5 mm apart in both directions. The PWM, RC, TELEM1, SERIAL4 and POWER pad groups are labelled.",
        width: 1835,
        height: 1044,
        caption: "Top side.",
      },
    ],
  },
  featuresTitle: "Six things worth knowing.",
  features: FEATURES,
  platform: {
    body: "The X427 Mini uses the same STM32F4-family, Cortex-M4 architecture as the X427 and the NAVIXSM-F401RE our stack already runs on. Here is the software family it is meant for, each layer with its own documentation.",
    hardwareName: "NAVIX X427 Mini",
    hardwareBody: "STM32F427 flight controller, STM32F4 family, Cortex-M4F",
  },
  status: [
    "The X427 Mini is in design. The schematic is at Rev A and the board layout is still being finished, so no board has been built or tested and nothing here is a measured result.",
    "Join the X427 Mini waitlist to be added to the list, or enquire to talk to an engineer about it.",
  ],
  specs: { onBoard: ON_BOARD, ports: PORTS, power: POWER, mechanical: MECHANICAL },
  reportLinks: false,
  faq: [
    {
      q: "Is it available?",
      a: "Not yet. The X427 Mini is in design and no board has been built. You can join the X427 Mini waitlist, or enquire and an engineer will reply.",
    },
    {
      q: "How is it different from the X427?",
      a: "The same STM32F427 and the same stack, on a 36 x 36 mm board. It has one IMU instead of up to three, eight PWM outputs instead of fourteen, one I2C port instead of three, no SPI port, no microSD slot (16 MB onboard flash instead) and 6 test pads instead of 36.",
    },
    {
      q: "Which software is it built for?",
      a: "The in-house NavHAL, VaiOS and VAYU stack, on the same STM32F4 family and Cortex-M4 architecture as the X427 and the NAVIXSM-F401RE.",
    },
    {
      q: "Does it have a compass?",
      a: "Not on the board. Use the compass in your GPS module, which connects over the I2C2 bus on the GPS1 port.",
    },
    {
      q: "How many motors can it drive?",
      a: "Eight, on the PWM MAIN pads.",
    },
    {
      q: "Does it log to a microSD card?",
      a: "No. Logs go to a 16 MB flash chip on the board.",
    },
    {
      q: "Can I use SBUS and CRSF receivers?",
      a: "Yes. The RC port passes the signal through an XOR gate so inverted SBUS and non-inverted protocols share one port.",
    },
  ],
  closing: {
    title: "Join the Mini waitlist.",
    body: "It is in design. Join the waitlist to be on the list, or write with your questions and an engineer will reply.",
  },
};

