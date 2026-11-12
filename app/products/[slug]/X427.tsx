import Link from "next/link";
import {
  ArrowRight,
  Cable,
  Cpu,
  Layers,
  Radar,
  Ruler,
  Zap,
} from "lucide-react";
import BoardPhoto from "@/components/BoardPhoto";
import LoopVideo from "@/components/LoopVideo";
import InterestDialog from "@/components/InterestDialog";
import WaitlistButton from "@/components/WaitlistButton";
import { PRODUCT_MEDIA } from "@/lib/product-media";
import {
  DEV_TOOLS,
  FAQ,
  FEATURES,
  LAYERS,
  MECHANICAL,
  ON_BOARD,
  PORTS,
  POWER,
  STATS,
  STATUS,
  type Feature,
  type Row,
} from "@/lib/x427-details";
import styles from "./x427.module.css";

const ICONS: Record<Feature["icon"], typeof Cpu> = {
  cpu: Cpu,
  sensors: Radar,
  power: Zap,
  ports: Cable,
  size: Ruler,
  stack: Layers,
};

function Table({ rows }: { rows: Row[] }) {
  return (
    <dl className={styles.table}>
      {rows.map((row) => (
        <div key={row.label} className={styles.row}>
          <dt className={`label ${styles.rowLabel}`}>{row.label}</dt>
          <dd className={styles.rowValue}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Spec({
  title,
  rows,
  open = false,
}: {
  title: string;
  rows: Row[];
  open?: boolean;
}) {
  return (
    <details className={styles.spec} open={open}>
      <summary className={styles.specSummary}>
        <span className="h3">{title}</span>
        <span className={`data ${styles.specCount}`}>{rows.length} items</span>
      </summary>
      <Table rows={rows} />
    </details>
  );
}

export default function X427({
  name,
  interest,
  options,
}: {
  name: string;
  interest: string;
  options: string[];
}) {
  const media = PRODUCT_MEDIA.x427;
  const enquire = (
    <InterestDialog
      label="Enquire"
      title={`Enquire about ${name}`}
      lede="Your message goes to an engineer, and the reply comes from one."
      interest={interest}
      options={options}
      buttonClassName="btn btn-ghost"
    />
  );

  return (
    <>
      {/* --- hero --- */}
      <section className={`band ${styles.hero}`} id="top">
        <div className="reticle" aria-hidden />
        <div className="shell">
          <div className={styles.heroGrid}>
            <div className={`rise ${styles.heroText}`}>
              <p className={styles.crumb}>
                <Link href="/products">Products</Link>
              </p>
              <p className="label label-signal">Flight controller · Rev A</p>
              <h1 className={styles.heroName}>{name}</h1>
              <p className={styles.headline}>
                The F4 flight controller built for the NavHAL / VaiOS / VAYU stack.
              </p>
              <p className={`lede ${styles.sub}`}>
                An STM32F427 at 180 MHz, up to three IMUs, DroneCAN, 14 PWM
                outputs and microSD logging, on a board of 84.9 x 44.1 mm.
              </p>
              <div className={styles.ctas}>
                <WaitlistButton label="Join waitlist" className="btn btn-primary" />
                {enquire}
                <Link href="/docs" className="btn btn-ghost">
                  Read the docs
                </Link>
              </div>
            </div>
            <div
              className={`rise ${styles.banner}`}
              style={{ animationDelay: "0.15s" }}
            >
              <BoardPhoto
                shot={media.hero}
                sizes="(max-width: 60rem) 100vw, 40rem"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- intro and numbers --- */}
      <section className="section-tight" id="at-a-glance">
        <div className="shell">
          <div className={styles.intro}>
            <h2 className="h2">A flight controller made for a flight stack.</h2>
            <p className="lede">
              The X427 is a small, four-layer board with the sensors, power
              path and ports a multirotor needs, built for a flight software
              stack written in-house. The hardware is at Rev A.
            </p>
          </div>
          <dl className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statValue}>
                  <span className={styles.statNum}>{stat.value}</span>
                  <span className={styles.statUnit}>{stat.unit}</span>
                </dt>
                <dd className={`label ${styles.statLabel}`}>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* --- gallery --- */}
      <section className="section-tight rule" id="gallery">
        <div className="shell">
          <div className={styles.bento}>
            <div className={styles.galleryCopy}>
              <p className="label">Overview</p>
              <h2 className="h2">Both sides, in detail.</h2>
              <p className="lede">
                Connectors, buttons and indicators sit on the top. The
                processor, sensors and power parts are all on the bottom, with
                the fast signals kept to that side of the board.
              </p>
              <p className={`small ${styles.note}`}>
                The still images are renders. The video is the Rev A board.
              </p>
            </div>
            <div className={`${styles.shot} ${styles.shotTop}`}>
              <BoardPhoto shot={media.hero} sizes="(max-width: 60rem) 100vw, 44rem" />
            </div>
            <div className={`${styles.shot} ${styles.shotBottom}`}>
              <BoardPhoto shot={media.gallery[0]} sizes="(max-width: 60rem) 100vw, 40rem" />
            </div>
            <div className={`${styles.shot} ${styles.shotVideo}`}>
              <LoopVideo
                src="/media/navix-x427.mp4"
                poster="/media/x427-clip-poster.jpg"
                label="NAVIX X427 Rev A flight controller board, video"
                className={styles.video}
                from={8}
                controls
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- six features --- */}
      <section className="section rule" id="features">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label">What it does</p>
            <h2 className="h1">Six things worth knowing.</h2>
          </header>
          <ul className={styles.features}>
            {FEATURES.map((feature) => {
              const Icon = ICONS[feature.icon];
              return (
                <li key={feature.title} className={styles.feature}>
                  <span className={styles.featureIcon} aria-hidden>
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <h3 className={`h3 ${styles.featureTitle}`}>{feature.title}</h3>
                  <p className={styles.featureBody}>{feature.body}</p>
                  <ul className={styles.chips}>
                    {feature.chips.map((chip) => (
                      <li key={chip} className={`data ${styles.chip}`}>
                        {chip}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
          <div className={styles.ctaRow}>
            <WaitlistButton label="Join waitlist" className="btn btn-primary" />
            <a href="#specs" className="btn btn-ghost">
              Full specifications
            </a>
          </div>
        </div>
      </section>

      {/* --- the stack --- */}
      <section className={`band ${styles.stackBand}`} id="software">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label label-signal">The platform</p>
            <h2 className="h1">From silicon to flight code, one stack.</h2>
            <p className="lede">
              The X427 is an STM32F4-family, Cortex-M4 board: the same
              architecture as the NAVIXSM-F401RE our stack already runs on.
              Here is the software family it is built for, each layer with its
              own documentation.
            </p>
          </header>
          <ol className={styles.layers} aria-label="The software family, top to bottom">
            {LAYERS.map((layer) => (
              <li key={layer.name}>
                <Link href={layer.href} className={styles.layer}>
                  <span className={`h3 ${styles.layerName}`}>{layer.name}</span>
                  <span className={`label ${styles.layerRole}`}>{layer.role}</span>
                  <span className={styles.layerBody}>{layer.body}</span>
                  <ArrowRight size={16} className={styles.layerGo} aria-hidden />
                </Link>
              </li>
            ))}
            <li className={styles.layerBase}>
              <span className={styles.baseThumb}>
                <BoardPhoto shot={media.hero} sizes="10rem" />
              </span>
              <span className={styles.baseText}>
                <span className={`label ${styles.baseLabel}`}>Hardware</span>
                <span className={`h3 ${styles.baseName}`}>NAVIX X427</span>
                <span className={styles.baseBody}>
                  STM32F427 flight controller, STM32F4 family, Cortex-M4F
                </span>
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* --- developers --- */}
      <section className="section rule" id="developers">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label">For developers</p>
            <h2 className="h1">Tools that go with the board.</h2>
          </header>
          <ul className={styles.dev}>
            {DEV_TOOLS.map((tool) => (
              <li key={tool.name}>
                <Link href={tool.href} className={styles.devCard}>
                  <span className={`data ${styles.devStatus}`}>{tool.status}</span>
                  <span className={`h3 ${styles.devName}`}>{tool.name}</span>
                  <span className={`label ${styles.devRole}`}>{tool.role}</span>
                  <span className={styles.devBody}>{tool.body}</span>
                  <span className={`data ${styles.devGo}`}>
                    Read the docs <ArrowRight size={14} aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- where it stands --- */}
      <section className="section-tight rule" id="status">
        <div className="shell">
          <div className={styles.statusGrid}>
            <div>
              <p className="label">Status</p>
              <h2 className="h2">Where it stands.</h2>
            </div>
            <div className={styles.statusBody}>
              {STATUS.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <div className={styles.ctaRow}>
                <WaitlistButton label="Join waitlist" className="btn btn-primary" />
                <Link href="/waitlist" className="btn btn-ghost">
                  Free board offer for students
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- full specifications --- */}
      <section className="section-tight rule" id="specs">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label">Reference</p>
            <h2 className="h1">Full specifications.</h2>
          </header>
          <div className={styles.specs}>
            {ON_BOARD.map((group, i) => (
              <Spec key={group.title} title={group.title} rows={group.rows} open={i === 0} />
            ))}
            <Spec title="Ports and interfaces" rows={PORTS} />
            <Spec title="Power design" rows={POWER} />
            <Spec title="Mechanical" rows={MECHANICAL} />
          </div>
          <p className={`small ${styles.note}`}>
            More in the{" "}
            <Link href="/docs/report/hardware/hw-overview" className={styles.link}>
              hardware chapter
            </Link>{" "}
            and the{" "}
            <Link href="/docs/report/hardware/hw-power" className={styles.link}>
              power section
            </Link>{" "}
            of the report. Measured results are in{" "}
            <Link href="/docs/report/vaios/vaios-performance" className={styles.link}>
              the benchmark
            </Link>
            .
          </p>
        </div>
      </section>

      {/* --- faq --- */}
      <section className="section-tight rule" id="faq">
        <div className="shell">
          <header className={styles.sectionHead}>
            <h2 className="h2">Questions.</h2>
          </header>
          <div className={styles.faq}>
            {FAQ.map((item) => (
              <details key={item.q} className={styles.faqItem}>
                <summary className={styles.faqQ}>{item.q}</summary>
                <p className={styles.faqA}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- closing --- */}
      <section className={`band ${styles.closing}`} id="join">
        <div className="reticle" aria-hidden />
        <div className="shell">
          <h2 className="h1">Be first to build with it.</h2>
          <p className="lede">
            Join the waitlist to hear when the X427 is available, or write to
            an engineer with your questions.
          </p>
          <div className={styles.ctas}>
            <WaitlistButton label="Join waitlist" className="btn btn-primary" />
            {enquire}
          </div>
        </div>
      </section>
    </>
  );
}
