import styles from "./H747Sketches.module.css";

/* Concept sketches for the NAVIX-SMH747 page.
 *
 * Hand-drawn in look only: line art run through an SVG displacement filter so
 * the strokes wobble a little, round caps, a faint grid. All inline SVG, no
 * images and no requests. Labels are real <text>. They show only what the
 * product brief states; none of it is a final design. */

const NOTE = "Concept sketch, not a final design";

/* The wobble. Applied to lines only; text is drawn outside the filtered groups. */
function Pencil({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
      </filter>
    </defs>
  );
}

/* 1. Hero: a module plugging down into a carrier board. */
export function ModuleCarrierSketch({ tone = "dark", fill = false }: { tone?: "dark" | "light"; fill?: boolean }) {
  return (
    <svg
      className={`${styles.sketch} ${tone === "dark" ? styles.dark : ""} ${fill ? styles.fill : ""}`}
      viewBox="0 0 600 400"
      role="img"
      aria-labelledby="sk-hero-t sk-hero-d"
    >
      <title id="sk-hero-t">Compute module on a carrier board (concept sketch)</title>
      <desc id="sk-hero-d">
        A sketch of a small square module above a larger flat carrier board, with dashed lines and an arrow showing the module plugging down into the carrier.
      </desc>
      <defs>
        <pattern id="sk-hero-g" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" className={styles.grid} />
        </pattern>
      </defs>
      <Pencil id="sk-hero-f" />
      <rect width="600" height="400" fill="url(#sk-hero-g)" />
      <g filter="url(#sk-hero-f)">
        <path className={styles.wash} d="M80 285L310 205L540 285L310 365Z" />
        <path className={styles.ink} d="M80 285L310 205L540 285L310 365Z" />
        <path className={styles.ink} d="M80 285V299L310 379L540 299V285M310 365V379" />
        <path className={styles.thin} d="M135 300L170 312M150 292L185 304M440 300L405 312M455 292L420 304" />
        <path className={styles.thin} d="M205 262L238 250M180 272L213 260M415 262L382 250" />
        <path className={`${styles.acc} ${styles.dash}`} d="M230 285L310 257L390 285L310 313Z" />
        <path className={`${styles.thin} ${styles.dash}`} d="M230 178V282M310 206V310M390 178V282" />
        <path className={styles.wash} d="M230 175L310 147L390 175L310 203Z" />
        <path className={styles.ink} d="M230 175L310 147L390 175L310 203Z" />
        <path className={styles.ink} d="M230 175V185L310 213L390 185V175M310 203V213" />
        <path className={styles.thin} d="M262 175L310 158L358 175L310 192Z" />
        <path className={styles.acc} d="M310 226V262M300 252L310 264L320 252" />
        <path className={styles.thin} d="M392 160L440 130L500 130" />
        <path className={styles.thin} d="M200 340L150 350L98 350" />
      </g>
      <text className={styles.txt} x="448" y="124">module</text>
      <text className={styles.txt} x="26" y="340">carrier board</text>
      <text className={styles.accTxt} x="300" y="44" textAnchor="middle">Compute module on a carrier board (concept sketch)</text>
      <text className={styles.note} x="300" y="68" textAnchor="middle">{NOTE}</text>
    </svg>
  );
}

/* 2. Two cores, two jobs. */
export function TwoCoresSketch() {
  return (
    <svg className={styles.sketch} viewBox="52 0 540 452" role="img" aria-labelledby="sk-cores-t sk-cores-d">
      <title id="sk-cores-t">Two cores, two jobs</title>
      <desc id="sk-cores-d">
        One STM32H747 box split in two. The Cortex-M4 side points to flight and internal sensors. The Cortex-M7 side points to autonomy and external modules and hardware. A separate dashed note says Lua apps, in design.
      </desc>
      <Pencil id="sk-cores-f" />
      <g filter="url(#sk-cores-f)">
        <rect className={styles.wash} x="70" y="50" width="500" height="130" rx="10" />
        <rect className={styles.ink} x="70" y="50" width="500" height="130" rx="10" />
        <path className={styles.ink} d="M320 50V180" />
        <path className={styles.thin} d="M110 50V38M150 50V38M190 50V38M450 50V38M490 50V38M530 50V38M110 180V192M150 180V192M190 180V192M450 180V192M490 180V192M530 180V192" />
        <path className={styles.acc} d="M195 198V258M185 246L195 260L205 246" />
        <path className={styles.acc} d="M445 198V258M435 246L445 260L455 246" />
        <rect className={styles.ink} x="70" y="266" width="250" height="62" rx="8" />
        <rect className={styles.ink} x="330" y="266" width="240" height="62" rx="8" />
        <rect className={`${styles.thin} ${styles.dash}`} x="200" y="368" width="240" height="52" rx="8" />
      </g>
      <text className={styles.accTxt} x="320" y="28" textAnchor="middle">STM32H747</text>
      <text className={styles.txt} x="195" y="122" textAnchor="middle">Cortex-M4</text>
      <text className={styles.txt} x="445" y="122" textAnchor="middle">Cortex-M7</text>
      <text className={styles.txt} x="195" y="293" textAnchor="middle">Flight</text>
      <text className={styles.small} x="195" y="316" textAnchor="middle">+ internal sensors</text>
      <text className={styles.txt} x="450" y="293" textAnchor="middle">Autonomy</text>
      <text className={styles.small} x="450" y="316" textAnchor="middle">+ external modules, hardware</text>
      <text className={styles.txt} x="320" y="392" textAnchor="middle">Lua apps</text>
      <text className={styles.small} x="320" y="410" textAnchor="middle">in design</text>
      <text className={styles.note} x="590" y="448" textAnchor="end">{NOTE}</text>
    </svg>
  );
}

/* 3. Three lanes into a voter. */
const LANES = [
  { y: 80, name: "3 IMUs" },
  { y: 190, name: "3 barometers" },
  { y: 300, name: "3 magnetometers" },
];

export function VotingSketch() {
  return (
    <svg className={styles.sketch} viewBox="14 0 612 420" role="img" aria-labelledby="sk-vote-t sk-vote-d">
      <title id="sk-vote-t">Triple redundancy with voting</title>
      <desc id="sk-vote-d">
        Three IMUs, three barometers and three magnetometers each feed a box labelled voting, whose output goes to flight control.
      </desc>
      <Pencil id="sk-vote-f" />
      <g filter="url(#sk-vote-f)">
        {LANES.map(({ y }) => (
          <g key={y}>
            {[30, 100, 170].map((x) => (
              <rect key={x} className={styles.ink} x={x} y={y} width="52" height="40" rx="5" />
            ))}
            <path className={styles.acc} d={`M82 ${y + 20}H100M152 ${y + 20}H170M222 ${y + 20}H246`} />
          </g>
        ))}
        <path className={styles.acc} d="M246 100V320M246 210H290M246 100H262M246 320H262" />
        <rect className={styles.wash} x="290" y="90" width="120" height="240" rx="10" />
        <rect className={styles.ink} x="290" y="90" width="120" height="240" rx="10" />
        <path className={styles.acc} d="M410 210H470M460 200L472 210L460 220" />
        <rect className={styles.ink} x="480" y="170" width="130" height="80" rx="10" />
      </g>
      {LANES.map(({ y, name }) => (
        <g key={name}>
          <text className={styles.small} x="30" y={y - 10}>{name}</text>
          {[1, 2, 3].map((n) => (
            <text key={n} className={styles.txt} x={30 + (n - 1) * 70 + 26} y={y + 27} textAnchor="middle">{n}</text>
          ))}
        </g>
      ))}
      <text className={styles.txt} x="350" y="216" textAnchor="middle">voting</text>
      <text className={styles.txt} x="545" y="206" textAnchor="middle">Flight</text>
      <text className={styles.txt} x="545" y="230" textAnchor="middle">control</text>
      <text className={styles.note} x="610" y="408" textAnchor="end">{NOTE}</text>
    </svg>
  );
}

/* 4. Interfaces as labelled stubs. */
const LEFT: { y: number; a: string; b?: string }[] = [
  { y: 130, a: "8 DShot", b: "motor outputs" },
  { y: 200, a: "UART" },
  { y: 270, a: "CAN" },
  { y: 340, a: "SPI" },
];
const RIGHT: { y: number; a: string }[] = [
  { y: 130, a: "USB" },
  { y: 200, a: "SD" },
  { y: 270, a: "Ethernet" },
  { y: 340, a: "CSI (camera)" },
];

export function InterfacesSketch() {
  return (
    <svg className={styles.sketch} viewBox="44 0 540 450" role="img" aria-labelledby="sk-if-t sk-if-d">
      <title id="sk-if-t">Interfaces</title>
      <desc id="sk-if-d">
        A central module and carrier box with labelled stubs for eight DShot motor outputs, UART, CAN, SPI, USB, SD, Ethernet and CSI, and an internal QSPI block for logs.
      </desc>
      <Pencil id="sk-if-f" />
      <g filter="url(#sk-if-f)">
        <rect className={styles.wash} x="235" y="70" width="170" height="320" rx="12" />
        <rect className={styles.ink} x="235" y="70" width="170" height="320" rx="12" />
        {LEFT.map(({ y }) => (
          <g key={y}>
            <path className={styles.acc} d={`M200 ${y}H235`} />
            <circle className={styles.acc} cx="195" cy={y} r="4" />
          </g>
        ))}
        {RIGHT.map(({ y }) => (
          <g key={y}>
            <path className={styles.acc} d={`M405 ${y}H440`} />
            <circle className={styles.acc} cx="445" cy={y} r="4" />
          </g>
        ))}
        <rect className={`${styles.thin} ${styles.dash}`} x="262" y="304" width="116" height="62" rx="6" />
      </g>
      <text className={styles.accTxt} x="320" y="52" textAnchor="middle">MODULE AND CARRIER</text>
      {LEFT.map(({ y, a, b }) => (
        <g key={a}>
          <text className={styles.txt} x="182" y={b ? y - 2 : y + 7} textAnchor="end">{a}</text>
          {b ? <text className={styles.small} x="182" y={y + 18} textAnchor="end">{b}</text> : null}
        </g>
      ))}
      {RIGHT.map(({ y, a }) => (
        <text key={a} className={styles.txt} x="458" y={y + 7}>{a}</text>
      ))}
      <text className={styles.txt} x="320" y="331" textAnchor="middle">QSPI</text>
      <text className={styles.small} x="320" y="353" textAnchor="middle">logs, internal</text>
      <text className={styles.note} x="578" y="440" textAnchor="end">{NOTE}</text>
    </svg>
  );
}

/* 5. One module, three carriers of increasing size. */
const CARRIERS = [
  { y: 80, name: "small", w: 130 },
  { y: 180, name: "medium", w: 270 },
  { y: 280, name: "large", w: 420 },
];

export function CarriersSketch() {
  return (
    <svg className={styles.sketch} viewBox="14 0 590 400" role="img" aria-labelledby="sk-car-t sk-car-d">
      <title id="sk-car-t">One module, many carriers</title>
      <desc id="sk-car-d">
        The same small module drawn on three carrier boards: a small one, a medium one with a block for external peripherals, and a large one with blocks for external peripherals and extra compute.
      </desc>
      <Pencil id="sk-car-f" />
      <g filter="url(#sk-car-f)">
        {CARRIERS.map(({ y, w }) => (
          <g key={y}>
            <rect className={styles.wash} x="170" y={y} width={w} height="80" rx="8" />
            <rect className={styles.ink} x="170" y={y} width={w} height="80" rx="8" />
            <rect className={styles.acc} x="184" y={y + 22} width="36" height="36" rx="4" />
            <path className={styles.thin} d={`M192 ${y + 22}V${y + 14}M202 ${y + 22}V${y + 14}M212 ${y + 22}V${y + 14}`} />
          </g>
        ))}
        <rect className={`${styles.thin} ${styles.dash}`} x="236" y="192" width="190" height="56" rx="6" />
        <rect className={`${styles.thin} ${styles.dash}`} x="236" y="292" width="170" height="56" rx="6" />
        <rect className={`${styles.thin} ${styles.dash}`} x="418" y="292" width="158" height="56" rx="6" />
      </g>
      <text className={styles.accTxt} x="309" y="32" textAnchor="middle">One module, many carriers</text>
      <text className={styles.small} x="202" y="66" textAnchor="middle">same module</text>
      {CARRIERS.map(({ y, name }) => (
        <text key={name} className={styles.txt} x="30" y={y + 46}>{name}</text>
      ))}
      <text className={styles.small} x="331" y="226" textAnchor="middle">external peripherals</text>
      <text className={styles.small} x="321" y="326" textAnchor="middle">external peripherals</text>
      <text className={styles.small} x="497" y="326" textAnchor="middle">extra compute</text>
      <text className={styles.note} x="602" y="390" textAnchor="end">{NOTE}</text>
    </svg>
  );
}

/* 6. A Lua app, loaded onto the module. */
export function LuaSketch() {
  return (
    <svg className={styles.sketch} viewBox="14 0 590 300" role="img" aria-labelledby="sk-lua-t sk-lua-d">
      <title id="sk-lua-t">Write an app in Lua</title>
      <desc id="sk-lua-d">
        A box that looks like a code snippet with the text your app, an arrow labelled load, and the module. A dashed tag says in design.
      </desc>
      <Pencil id="sk-lua-f" />
      <g filter="url(#sk-lua-f)">
        <rect className={styles.wash} x="40" y="80" width="210" height="130" rx="8" />
        <rect className={styles.ink} x="40" y="80" width="210" height="130" rx="8" />
        <path className={styles.thin} d="M60 148H170M60 172H210M72 190H150" />
        <path className={styles.acc} d="M262 145H352M340 135L354 145L340 155" />
        <rect className={styles.wash} x="370" y="95" width="130" height="100" rx="10" />
        <rect className={styles.ink} x="370" y="95" width="130" height="100" rx="10" />
        <rect className={`${styles.thin} ${styles.dash}`} x="268" y="215" width="84" height="34" rx="17" />
      </g>
      <text className={styles.accTxt} x="309" y="32" textAnchor="middle">Write an app in Lua</text>
      <text className={styles.small} x="40" y="68">your Lua app</text>
      <text className={styles.code} x="60" y="118">-- your app</text>
      <text className={styles.small} x="307" y="132" textAnchor="middle">load</text>
      <text className={styles.txt} x="435" y="152" textAnchor="middle">module</text>
      <text className={styles.small} x="310" y="238" textAnchor="middle">in design</text>
      <text className={styles.note} x="602" y="290" textAnchor="end">{NOTE}</text>
    </svg>
  );
}

/* 7. Eight DShot stubs fanning out to eight motors. */
const MOTORS = [1, 2, 3, 4, 5, 6, 7, 8];

export function MotorsSketch() {
  return (
    <svg className={styles.sketch} viewBox="14 0 590 430" role="img" aria-labelledby="sk-mot-t sk-mot-d">
      <title id="sk-mot-t">Eight motor outputs</title>
      <desc id="sk-mot-d">
        The module with eight DShot output lines fanning out to eight small circles numbered one to eight, each standing for a motor.
      </desc>
      <Pencil id="sk-mot-f" />
      <g filter="url(#sk-mot-f)">
        <rect className={styles.wash} x="40" y="110" width="120" height="200" rx="10" />
        <rect className={styles.ink} x="40" y="110" width="120" height="200" rx="10" />
        {MOTORS.map((n) => (
          <g key={n}>
            <path className={styles.acc} d={`M160 ${135 + (n - 1) * 22.8}L490 ${66 + (n - 1) * 43}`} />
            <circle className={styles.ink} cx="520" cy={66 + (n - 1) * 43} r="18" />
          </g>
        ))}
      </g>
      <text className={styles.accTxt} x="309" y="32" textAnchor="middle">Eight motor outputs</text>
      <text className={styles.txt} x="100" y="206" textAnchor="middle">module</text>
      <text className={styles.small} x="100" y="228" textAnchor="middle">8 DShot</text>
      {MOTORS.map((n) => (
        <text key={n} className={styles.txt} x="520" y={73 + (n - 1) * 43} textAnchor="middle">{n}</text>
      ))}
      <text className={styles.small} x="520" y="402" textAnchor="middle">motors</text>
      <text className={styles.note} x="602" y="424" textAnchor="end">{NOTE}</text>
    </svg>
  );
}

/* 8. Logs stay on the module, in internal QSPI storage. */
export function LogsSketch() {
  return (
    <svg className={styles.sketch} viewBox="14 0 590 330" role="img" aria-labelledby="sk-log-t sk-log-d">
      <title id="sk-log-t">Logs stay on the module</title>
      <desc id="sk-log-d">
        The module with an internal QSPI block marked with a small log page icon, and an arrow from the processor into it.
      </desc>
      <Pencil id="sk-log-f" />
      <g filter="url(#sk-log-f)">
        <rect className={styles.wash} x="50" y="60" width="500" height="180" rx="12" />
        <rect className={styles.ink} x="50" y="60" width="500" height="180" rx="12" />
        <rect className={`${styles.ink}`} x="90" y="105" width="170" height="110" rx="8" />
        <path className={styles.ink} d="M108 118H132L142 128V158H108ZM132 118V128H142" />
        <path className={styles.thin} d="M115 137H133M115 146H133" />
        <rect className={styles.ink} x="390" y="105" width="120" height="110" rx="8" />
        <path className={styles.acc} d="M388 160H272M284 150L270 160L284 170" />
      </g>
      <text className={styles.accTxt} x="309" y="32" textAnchor="middle">Logs stay on the module</text>
      <text className={styles.small} x="66" y="86">module</text>
      <text className={styles.txt} x="160" y="143">QSPI</text>
      <text className={styles.small} x="160" y="196" textAnchor="middle">internal</text>
      <text className={styles.txt} x="450" y="166" textAnchor="middle">MCU</text>
      <text className={styles.txt} x="300" y="278" textAnchor="middle">Internal QSPI storage for logs</text>
      <text className={styles.note} x="602" y="318" textAnchor="end">{NOTE}</text>
    </svg>
  );
}
