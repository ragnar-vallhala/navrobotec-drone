/* The long-form detail for the NAVIX X427 page.
 *
 * Page content, not catalogue data: the API row carries the five headline
 * specifications and is edited through the admin console; this is the
 * engineering detail behind them, taken from the Rev A design files
 * (pin assignment, layout notes, datasheet validation, RFQ pack). Nothing here
 * is a measured result. Where a figure is a design target or an estimate the
 * wording says so.
 */

import type { BoardPage } from "./board-page";
import { PRODUCT_MEDIA } from "./product-media";

export type Row = { label: string; value: string };
export type Group = { title: string; rows: Row[] };

export const ON_BOARD: Group[] = [
  {
    title: "Processor",
    rows: [
      { label: "MCU", value: "STM32F427VGT6 in LQFP100, 14 x 14 mm, 0.5 mm pitch" },
      { label: "Core", value: "Cortex-M4F at 180 MHz" },
      { label: "Memory", value: "1 MB flash, 192 KB SRAM plus 64 KB CCM SRAM" },
      { label: "I/O", value: "82 bonded I/O pins, 79 assigned, 3 spare" },
      { label: "Upgrade path", value: "Pin-for-pin compatible with the 2 MB STM32F427VIT6" },
      { label: "Clock", value: "8 MHz crystal; no RTC crystal fitted" },
    ],
  },
  {
    title: "Sensors",
    rows: [
      { label: "IMU 1", value: "LSM6DSOX on SPI1" },
      { label: "IMU 2", value: "ICM-42688-P on its own SPI4 bus. Footprint on every board, fitted on dual-IMU builds only" },
      { label: "IMU 3", value: "BMI270 footprint on the shared SPI1 bus, not fitted on the standard build" },
      { label: "Barometer", value: "BMP585 on I2C1" },
      { label: "Compass", value: "Not on the board. Use the compass in the GPS module, over I2C2" },
    ],
  },
  {
    title: "Indicators and controls",
    rows: [
      { label: "Status", value: "Blue status LED and an RGB LED" },
      { label: "Sound", value: "Buzzer driver and a buzzer header" },
      { label: "Safety", value: "Safety switch input and LED" },
      { label: "Buttons", value: "BOOT and RESET" },
    ],
  },
];

export const PORTS: Row[] = [
  { label: "PWM MAIN", value: "10-pin JST GH. Channels 1 to 8, motors" },
  { label: "PWM AUX", value: "10-pin JST GH. Channels 9 to 14. Each AUX pin can be GPIO, relay, camera trigger or input capture" },
  { label: "GPS1", value: "10-pin, USART1, with safety switch, LED and buzzer lines" },
  { label: "POWER1", value: "6-pin, power module input with battery voltage and current sense" },
  { label: "TELEM1", value: "6-pin, USART2 with flow control (CTS and RTS)" },
  { label: "RC1", value: "6-pin, USART6. One port takes SBUS (inverted) and iBUS, CRSF or DSM, with the CRSF telemetry back-channel" },
  { label: "SERIAL4", value: "6-pin, UART4. Second GPS, a UART rangefinder or a companion computer" },
  { label: "CAN1", value: "4-pin, DroneCAN through a TJA1051T/3 transceiver" },
  { label: "EXT_I2C1 to 3", value: "4-pin, on I2C2" },
  { label: "EXT_SPI1", value: "7-pin, SPI2 with two chip selects" },
  { label: "ADC", value: "3-pin, 6.6 V analogue input" },
  { label: "USB-C", value: "Device mode only" },
  { label: "microSD", value: "4-bit SDIO with card detect" },
  { label: "Debug", value: "JST SH 6-pin Debug Mini: SWD and a UART7 console" },
];

export const POWER: Row[] = [
  { label: "Inputs", value: "POWER1 (the power module's 5 V) and USB-C VBUS" },
  { label: "Priority", value: "A TPS2121 power mux gives POWER1 priority over USB. The inputs cannot back-feed each other, and the firmware can read which source is powering the board" },
  { label: "Over-voltage", value: "Each input is cut off at about 5.36 to 5.86 V (nominal 5.64 V) to protect the regulators behind it" },
  { label: "Logic supply", value: "Two 3.3 V LDOs (TLV75733P), one dedicated to the sensors" },
  { label: "Servo rail", value: "Does not power the board. Feed POWER1 from a flight-controller BEC" },
  { label: "Peripheral 5 V", value: "Two switched 5 V ports, 5V_PERIPH and 5V_TELEM, each with a fault flag and firmware control. Both are on at reset" },
  { label: "Budget", value: "POWER1 carries up to 2 A (two 1 A contacts); the two switched ports together are budgeted at 1.5 A or less" },
  { label: "USB only", value: "Keep the switched 5 V ports off. USB alone cannot carry more than about 0.9 A (simulation)" },
];

export const MECHANICAL: Row[] = [
  { label: "Outline", value: "84.9 x 44.1 mm, 3 mm corner radius" },
  { label: "Stack-up", value: "4-layer FR4, 1.6 mm, with a solid inner ground plane" },
  { label: "Flight-controller mount", value: "Standard 30.5 x 30.5 mm M3 pattern, centred. Use rubber grommets or soft standoffs: the IMUs need vibration isolation, so do not hard-mount" },
  { label: "Case mount", value: "Four corner M3 holes, each with a 4.0 mm keep-out" },
  { label: "Layout", value: "USB-C and microSD at the front end, PWM ports at the back. Every port is named in silkscreen" },
  { label: "Bring-up", value: "36 test pads (TP1 to TP36) on a 2.54 mm grid for a pogo-pin fixture" },
];

export const STACK = [
  {
    name: "NavHAL",
    body: "The hardware abstraction layer between the stack and the chip's peripherals.",
    href: "/docs/report/navhal/navhal-motivation",
  },
  {
    name: "VaiOS",
    body: "The real-time runtime: tasks, scheduler, timing and inter-task messaging.",
    href: "/docs/report/vaios/vaios-overview",
  },
  {
    name: "VAYU",
    body: "The flight software: sensing, estimation, control and actuation.",
    href: "/docs/report/vayu/vayu-overview",
  },
];

export const STATUS: string[] = [
  "The X427 is at Rev A. The design has been checked part by part against the manufacturers' datasheets, and the pin assignment has been checked by script against the chip vendor's pin data.",
  "Bring-up on real boards is next: measuring the 3.3 V load (about 190 mA average is a design estimate) and the sensor supply start-up timing.",
  "Join the waitlist to hear when boards are available, or enquire to talk to an engineer.",
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Which software is it built for?",
    a: "The in-house NavHAL, VaiOS and VAYU stack. The X427 uses the same STM32F4 family and Cortex-M4 architecture as the NAVIXSM-F401RE that stack runs on today, and it is pin-for-pin compatible with the 2 MB STM32F427VIT6 if more flash is needed.",
  },
  {
    q: "Does it have a compass?",
    a: "Not on the board. Use the compass in your GPS module, which connects over the I2C2 bus on the GPS1 port.",
  },
  {
    q: "How many motors can it drive?",
    a: "Eight on PWM MAIN and six more channels on PWM AUX. DShot on the motor timers is interrupt driven, because the timers have no DMA channel left.",
  },
  {
    q: "Can I use SBUS and CRSF receivers?",
    a: "Yes. The RC port passes the signal through an XOR gate so inverted SBUS and non-inverted protocols share one port.",
  },
  {
    q: "Does it support dual or triple IMUs?",
    a: "The footprints are on the board: the LSM6DSOX is standard, and the ICM-42688-P and BMI270 can be fitted. All three can run together.",
  },
  {
    q: "Where does it log?",
    a: "To a microSD card on a 4-bit SDIO interface. There is no onboard log flash.",
  },
  {
    q: "Can I power it from USB alone?",
    a: "Yes, for bench work. Keep the switched 5 V ports off in that mode, since USB cannot supply more than about 0.9 A.",
  },
];

/* --- the marketing layer -------------------------------------------------------
   Every figure below repeats one in the tables above. */

export const STATS: { value: string; unit: string; label: string }[] = [
  { value: "180", unit: "MHz", label: "Cortex-M4F" },
  { value: "14", unit: "PWM", label: "outputs on two ports" },
  { value: "3", unit: "IMUs", label: "can run together" },
  { value: "84.9 x 44.1", unit: "mm", label: "4-layer board" },
];

export type Feature = {
  icon:
    | "cpu"
    | "sensors"
    | "power"
    | "ports"
    | "size"
    | "stack"
    | "code"
    | "box"
    | "wrench"
    | "hidden";
  title: string;
  body: string;
  /* Optional longer text, shown under the body on pages that set it. */
  more?: string;
  chips: string[];
};

export const FEATURES: Feature[] = [
  {
    icon: "cpu",
    title: "180 MHz Cortex-M4F, 1 MB of flash.",
    body: "The STM32F427VGT6 runs a Cortex-M4F at 180 MHz with 1 MB of flash and 256 KB of SRAM in total. If a build outgrows the flash, the 2 MB STM32F427VIT6 drops into the same footprint, pin for pin.",
    chips: ["180 MHz", "1 MB flash", "192 + 64 KB SRAM", "79 of 82 I/O assigned"],
  },
  {
    icon: "sensors",
    title: "Up to three IMUs on one board.",
    body: "An LSM6DSOX is standard. An ICM-42688-P on its own SPI bus and a BMI270 on the shared one have footprints on every board, and all three can run together. A BMP585 barometer sits on I2C. The compass lives in your GPS module.",
    chips: ["LSM6DSOX", "ICM-42688-P", "BMI270", "BMP585"],
  },
  {
    icon: "power",
    title: "Power module first, USB second.",
    body: "A power mux gives the power module on POWER1 priority over USB, with no back-feed between them. Each input is cut off above about 5.6 V to protect the regulators behind it. Two switched 5 V ports report faults and can be turned off by firmware.",
    chips: ["POWER1 over USB", "Over-voltage cut-off", "2 switched 5 V ports", "Up to 2 A on POWER1"],
  },
  {
    icon: "ports",
    title: "14 PWM, DroneCAN, GPS, RC and microSD.",
    body: "Fourteen PWM outputs, DroneCAN, GPS, telemetry with flow control, and one RC port that takes SBUS, iBUS, CRSF and DSM. Add a spare serial port, three I2C and an SPI port, USB-C, a 4-bit microSD slot and a debug header.",
    chips: ["14 PWM", "DroneCAN", "SBUS / CRSF / DSM", "microSD logging"],
  },
  {
    icon: "size",
    title: "84.9 x 44.1 mm, soft-mounted.",
    body: "The board is 84.9 x 44.1 mm with the standard 30.5 x 30.5 mm M3 pattern at its centre. Soft-mount it: the IMUs want vibration isolation. Four corner holes take a case, and 36 test pads serve a pogo-pin fixture.",
    chips: ["84.9 x 44.1 mm", "30.5 x 30.5 mm mount", "4 layers", "36 test pads"],
  },
  {
    icon: "stack",
    title: "Built for the NavHAL / VaiOS / VAYU family.",
    body: "The X427 is an STM32F4-family, Cortex-M4 board: the same architecture as the NAVIXSM-F401RE our stack already runs on. Its pin assignment, DMA streams included, was settled as a whole and checked by script against the chip vendor's own pin data.",
    chips: ["STM32F4", "Cortex-M4F", "NavHAL", "VaiOS", "VAYU"],
  },
];

export const LAYERS = [
  {
    name: "VAYU",
    role: "Flight software",
    body: "Estimation, control, mixing and failsafes, with a simulator built from the same code.",
    href: "/docs/vayu",
  },
  {
    name: "VaiOS",
    role: "Real-time kernel",
    body: "A preemptive RTOS for Cortex-M, aimed at hard-real-time work such as a 1 kHz flight controller.",
    href: "/docs/vaios",
  },
  {
    name: "NavHAL",
    role: "Hardware abstraction",
    body: "One frozen hal_* C API over layered arch, vendor, family and board sources.",
    href: "/docs/navhal",
  },
];

export const DEV_TOOLS = [
  {
    name: "nav",
    role: "Build tool",
    body: "Scaffold a NavHAL project, build it, flash the board and open a serial monitor from one command line. Version 1.3.1; the README documents the Linux .deb install.",
    status: "v1.3.1",
    href: "/docs/nav",
  },
  {
    name: "Navigator",
    role: "Ground control station",
    body: "A Qt6 desktop application with attitude, IMU, RC, motor and log views, calibration, and an in-app simulator. There is no packaged release yet; it is built from source.",
    status: "Build from source",
    href: "/docs/navigator",
  },
  {
    name: "NavLink",
    role: "Link protocol",
    body: "One dialect file defines every message, and a generator emits matching codecs for firmware, ground stations and tools.",
    status: "v2.4.0",
    href: "/docs/navlink",
  },
];

/* --- the X427 page, assembled ---------------------------------------------- */

export const X427_PAGE: BoardPage = {
  mediaKey: "x427",
  badge: "Flight controller · Rev A",
  headline: "The F4 flight controller built for the NavHAL / VaiOS / VAYU stack.",
  sub: "An STM32F427 at 180 MHz, up to three IMUs, DroneCAN, 14 PWM outputs and microSD logging, on a board of 84.9 x 44.1 mm.",
  waitlist: "x427",
  studentOffer: true,
  introTitle: "An STM32F427 board with up to three IMUs.",
  introBody:
    "The X427 is a small, four-layer board with the sensors, power path and ports a multirotor needs, built for a flight software stack written in-house. The hardware is at Rev A.",
  stats: STATS,
  gallery: {
    title: "Both sides, in detail.",
    body: "Connectors, buttons and indicators sit on the top. The processor, sensors and power parts are all on the bottom, with the fast signals kept to that side of the board.",
    note: "The still images are renders. The video is the Rev A board.",
    top: PRODUCT_MEDIA.x427.hero,
    bottom: PRODUCT_MEDIA.x427.gallery[0],
    third: {
      kind: "video",
      src: "/media/navix-x427.mp4",
      poster: "/media/x427-clip-poster.jpg",
      label: "NAVIX X427 Rev A flight controller board, video",
      from: 8,
    },
  },
  featuresTitle: "Six things worth knowing.",
  features: FEATURES,
  platform: {
    body: "The X427 is an STM32F4-family, Cortex-M4 board: the same architecture as the NAVIXSM-F401RE our stack already runs on. Here is the software family it is built for, each layer with its own documentation.",
    hardwareName: "NAVIX X427",
    hardwareBody: "STM32F427 flight controller, STM32F4 family, Cortex-M4F",
  },
  drawings: {
    title: "Board dimensions.",
    body: "Drawings of the board from its layout files. All dimensions are in millimetres.",
    renders: [
      {
        shot: { src: "/images/render-x427-flat.24955330.webp", alt: "NAVIX X427 flight controller seen from directly above, the connectors, USB-C and microSD labelled on the board", width: 960, height: 1200 },
        caption: "Top, straight on.",
      },
      {
        shot: { src: "/images/render-x427-tilt.7e3ffa15.webp", alt: "NAVIX X427 flight controller seen at an angle from the USB-C end, the connector row standing above the board", width: 1200, height: 800 },
        caption: "From the USB-C end.",
      },
    ],
    items: [
      {
        src: "/images/drawing-x427-top-dims.bf02ee38.webp",
        alt: "Top side drawing of the NAVIX X427 board with dimensions: 84.9 mm long, 44.0 mm wide, mounting holes 77.8 mm apart at the corners and 30.5 mm apart at the centre, 37.0 mm and 30.5 mm hole spacing across. The connectors, buttons and LEDs are labelled.",
        width: 1835,
        height: 1054,
        caption: "Top side.",
      },
      {
        src: "/images/drawing-x427-bottom-dims.3d02155b.webp",
        alt: "Bottom side drawing of the NAVIX X427 board, mirrored as seen from the back, with the same 84.9 mm length, 44.0 mm width and hole spacings, and the STM32F427, TJA1051T/3, TPS2121, 8 MHz crystal and sensors labelled.",
        width: 1834,
        height: 1054,
        caption: "Bottom side, mirrored as seen from the back.",
      },
    ],
  },
  related: {
    label: "Accessory",
    title: "Enclosure for the X427",
    body: "A machined aluminium case with openings cut for the X427's connectors, sold separately from the board.",
    href: "/products/x427-enclosure",
    link: "View the X427 Enclosure",
  },
  status: STATUS,
  specs: { onBoard: ON_BOARD, ports: PORTS, power: POWER, mechanical: MECHANICAL },
  reportLinks: true,
  faq: FAQ,
  closing: {
    title: "Be first to build with it.",
    body: "Join the waitlist to hear when the X427 is available, or write to an engineer with your questions.",
  },
};
