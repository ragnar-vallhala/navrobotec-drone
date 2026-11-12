/* The long-form detail for the NAVIX X427 page.
 *
 * Page content, not catalogue data: the API row carries the five headline
 * specifications and is edited through the admin console; this is the
 * engineering detail behind them, taken from the Rev A design files
 * (pin assignment, layout notes, datasheet validation, RFQ pack). Nothing here
 * is a measured result. Where a figure is a design target or an estimate the
 * wording says so.
 */

export type Row = { label: string; value: string };
export type Group = { title: string; rows: Row[] };

export const GLANCE: Row[] = [
  { label: "Processor", value: "STM32F427VGT6, Cortex-M4F, 180 MHz" },
  { label: "Memory", value: "1 MB flash, 192 + 64 KB (CCM) SRAM" },
  { label: "Inertial sensors", value: "LSM6DSOX, optional ICM-42688-P and BMI270" },
  { label: "Barometer", value: "BMP585" },
  { label: "Motor and servo outputs", value: "14 PWM channels on two JST GH ports" },
  { label: "Bus", value: "DroneCAN on CAN1" },
  { label: "Logging", value: "microSD, 4-bit SDIO" },
  { label: "Board", value: "84.9 x 44.1 mm, 4 layers, 30.5 x 30.5 mm mount" },
];

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

export const AUDIENCE: string[] = [
  "Students and clubs who want a flight controller built for the NavHAL, VaiOS and VAYU stack. College students can claim a free board in the waitlist offer.",
  "Engineers who want the board and the flight stack designed together.",
  "Teams who need CAN, spare serial ports and 14 PWM outputs on one small board.",
];

export const STATUS: string[] = [
  "The X427 is at Rev A. The design has been checked part by part against the manufacturers' datasheets, and the pin assignment has been checked by script against the chip vendor's pin data.",
  "Some items are still bring-up checks on real boards, for example the 3.3 V load (about 190 mA average is a design estimate, to be measured) and the supply start-up timing of the sensors.",
  "The board is not on general sale yet. Join the waitlist to be told when it is, or enquire to talk to an engineer.",
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Which firmware runs on it?",
    a: "The in-house NavHAL, VaiOS and VAYU stack. It does not have to fit inside the PX4 or ArduPilot flash budget. The board is pin-for-pin compatible with the 2 MB STM32F427VIT6 if more flash is ever needed.",
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
