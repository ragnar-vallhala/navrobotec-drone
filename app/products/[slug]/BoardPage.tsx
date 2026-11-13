import Link from "next/link";
import {
  ArrowRight,
  Cable,
  Code,
  Box,
  Cpu,
  EyeOff,
  Layers,
  Radar,
  Ruler,
  Wrench,
  Zap,
} from "lucide-react";
import BoardPhoto from "@/components/BoardPhoto";
import {
  CarriersSketch,
  InterfacesSketch,
  LogsSketch,
  LuaSketch,
  MotorsSketch,
  TwoCoresSketch,
  VotingSketch,
} from "@/components/sketches/H747Sketches";
import LoopVideo from "@/components/LoopVideo";
import { PRODUCT_MEDIA } from "@/lib/product-media";
import InterestDialog from "@/components/InterestDialog";
import WaitlistButton from "@/components/WaitlistButton";
import type { BoardPage as Page } from "@/lib/board-page";
import { DEV_TOOLS, LAYERS, type Feature, type Row } from "@/lib/x427-details";
import styles from "./x427.module.css";

const ICONS: Record<Feature["icon"], typeof Cpu> = {
  cpu: Cpu,
  sensors: Radar,
  power: Zap,
  ports: Cable,
  size: Ruler,
  stack: Layers,
  code: Code,
  box: Box,
  wrench: Wrench,
  hidden: EyeOff,
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

/* The long product page, for the X427 and the X427 Mini. The layout is shared;
   `page` carries the words, the numbers and the pictures. */
export default function BoardPage({
  name,
  interest,
  options,
  page,
}: {
  name: string;
  interest: string;
  options: string[];
  page: Page;
}) {
  const media = page.mediaKey ? PRODUCT_MEDIA[page.mediaKey] : undefined;
  const gallery = page.gallery;
  const join = page.waitlist ? (
    <WaitlistButton
      label="Join waitlist"
      className="btn btn-primary"
      product={page.waitlist}
    />
  ) : null;
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
              <p className="label label-signal">{page.badge}</p>
              <h1 className={styles.heroName}>{name}</h1>
              <p className={styles.headline}>
                {page.headline}
              </p>
              <p className={`lede ${styles.sub}`}>{page.sub}</p>
              <div className={styles.ctas}>
                {join}
                {enquire}
                {page.docsLink === false ? null : (
                  <Link href="/docs" className="btn btn-ghost">
                    Read the docs
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- intro and numbers --- */}
      <section className="section-tight" id="at-a-glance">
        <div className="shell">
          <div className={styles.intro}>
            <h2 className="h2">{page.introTitle}</h2>
            <p className="lede">{page.introBody}</p>
          </div>
          {page.principles ? (
            <ul className={styles.principles} aria-label="Design principles">
              {page.principles.map((line) => (
                <li key={line} className={styles.principle}>{line}</li>
              ))}
            </ul>
          ) : null}
          <dl className={styles.stats}>
            {page.stats.map((stat) => (
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
      {gallery ? (
      <section className="section-tight rule" id="gallery">
        <div className="shell">
          <div className={styles.bento}>
            <div className={styles.galleryCopy}>
              <p className="label">Overview</p>
              <h2 className="h2">{gallery.title}</h2>
              <p className="lede">{gallery.body}</p>
              <p className={`small ${styles.note}`}>{gallery.note}</p>
            </div>
            <div className={`${styles.shot} ${styles.shotTop}`}>
              <BoardPhoto shot={gallery.top} sizes="(max-width: 60rem) 100vw, 44rem" />
            </div>
            <div className={`${styles.shot} ${styles.shotBottom}`} style={{ ["--ar" as string]: `${gallery.bottom.width} / ${gallery.bottom.height}` }}>
              <BoardPhoto shot={gallery.bottom} sizes="(max-width: 60rem) 100vw, 40rem" />
            </div>
            <div className={`${styles.shot} ${styles.shotVideo}`} style={gallery.third.kind === "shot" ? { ["--ar" as string]: `${gallery.third.shot.width} / ${gallery.third.shot.height}` } : undefined}>
              {gallery.third.kind === "video" ? (
                <LoopVideo
                  src={gallery.third.src}
                  poster={gallery.third.poster}
                  label={gallery.third.label}
                  className={styles.video}
                  from={gallery.third.from}
                  controls
                />
              ) : (
                <BoardPhoto
                  shot={gallery.third.shot}
                  sizes="(max-width: 60rem) 100vw, 36rem"
                />
              )}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {/* --- more pictures --- */}
      {page.details ? (
      <section className="section-tight rule" id="details">
        <div className="shell">
          <header className={styles.sectionHead}>
            <h2 className="h2">{page.details.title}</h2>
            <p className="lede">{page.details.body}</p>
          </header>
          <ul className={styles.figures}>
            {page.details.shots.map(({ shot, caption }) => (
              <li key={shot.src}>
                <figure className={styles.figure}>
                  <div className={styles.figureShot} style={{ aspectRatio: `${shot.width} / ${shot.height}` }}>
                    <BoardPhoto shot={shot} sizes="(max-width: 60rem) 100vw, 36rem" />
                  </div>
                  <figcaption className={`small ${styles.caption}`}>{caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>
      ) : null}

      {/* --- six features --- */}
      <section className="section rule" id="features">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label">What it does</p>
            <h2 className="h1">{page.featuresTitle}</h2>
          </header>
          <ul className={styles.features}>
            {page.features.map((feature) => {
              const Icon = ICONS[feature.icon];
              return (
                <li key={feature.title} className={styles.feature}>
                  <span className={styles.featureIcon} aria-hidden>
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <h3 className={`h3 ${styles.featureTitle}`}>{feature.title}</h3>
                  <p className={styles.featureBody}>{feature.body}</p>
                  {feature.more ? <p className={styles.featureBody}>{feature.more}</p> : null}
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
            {join}
            <a href="#specs" className="btn btn-ghost">
              Full specifications
            </a>
          </div>
        </div>
      </section>

      {/* --- how it fits together (concept sketches) --- */}
      {page.sketches?.diagrams ? (
      <section className="section rule" id="how-it-fits">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label">Concept sketches</p>
            <h2 className="h1">How it fits together.</h2>
            <p className="lede">Rough drawings of the design intent. They show what the module is meant to do, not a final layout.</p>
          </header>
          <div className={styles.sketches}>
            <figure className={styles.sketchCard}><TwoCoresSketch /></figure>
            <figure className={styles.sketchCard}><VotingSketch /></figure>
            <figure className={styles.sketchCard}><InterfacesSketch /></figure>
            {page.sketches?.more ? (
              <>
                <figure className={styles.sketchCard}><CarriersSketch /></figure>
                <figure className={styles.sketchCard}><LuaSketch /></figure>
                <figure className={styles.sketchCard}><MotorsSketch /></figure>
                <figure className={styles.sketchCard}><LogsSketch /></figure>
              </>
            ) : null}
          </div>
        </div>
      </section>
      ) : null}

      {/* --- notes: who it is for, redundancy, carriers --- */}
      {page.notes ? (
      <section className="section-tight rule" id="design-notes">
        <div className="shell">
          {page.notes.map((note) => (
            <div key={note.title} className={`${styles.statusGrid} ${styles.noteBlock}`}>
              <div>
                <p className="label">{note.label}</p>
                <h2 className="h2">{note.title}</h2>
              </div>
              <div className={styles.statusBody}>
                {note.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      ) : null}

      {/* --- the stack --- */}
      {page.platform ? (
      <section className={`band ${styles.stackBand}`} id="software">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label label-signal">The platform</p>
            <h2 className="h1">From silicon to flight code, one stack.</h2>
            <p className="lede">{page.platform.body}</p>
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
                {media ? <BoardPhoto shot={media.hero} sizes="10rem" /> : null}
              </span>
              <span className={styles.baseText}>
                <span className={`label ${styles.baseLabel}`}>Hardware</span>
                <span className={`h3 ${styles.baseName}`}>{page.platform.hardwareName}</span>
                <span className={styles.baseBody}>{page.platform.hardwareBody}</span>
              </span>
            </li>
          </ol>
        </div>
      </section>
      ) : null}

      {/* --- developers --- */}
      {page.devTools === false ? null : (
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
      )}

      {/* --- where it stands --- */}
      <section className="section-tight rule" id="status">
        <div className="shell">
          <div className={styles.statusGrid}>
            <div>
              <p className="label">Status</p>
              <h2 className="h2">Where it stands.</h2>
            </div>
            <div className={styles.statusBody}>
              {page.status.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {page.waitlist ? (
                <div className={styles.ctaRow}>
                  {join}
                  {page.studentOffer ? (
                    <Link href="/waitlist" className="btn btn-ghost">
                      Free board offer for students
                    </Link>
                  ) : (
                    enquire
                  )}
                </div>
              ) : (
                <div className={styles.ctaRow}>{enquire}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {page.open ? (
      <section className="section-tight rule" id="open">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label">Honest list</p>
            <h2 className="h1">{page.open.title}</h2>
          </header>
          <div className={styles.openCard}>
            <Table rows={page.open.rows} />
          </div>
        </div>
      </section>
      ) : null}

      {/* --- full specifications --- */}
      <section className="section-tight rule" id="specs">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label">Reference</p>
            <h2 className="h1">Full specifications.</h2>
          </header>
          <div className={styles.specs}>
            {page.specs.onBoard.map((group, i) => (
              <Spec key={group.title} title={group.title} rows={group.rows} open={i === 0} />
            ))}
            {page.specs.ports.length > 0 ? (
              <Spec title={page.specs.portsTitle ?? "Ports and interfaces"} rows={page.specs.ports} />
            ) : null}
            {page.specs.power.length > 0 ? (
              <Spec title="Power design" rows={page.specs.power} />
            ) : null}
            <Spec title={page.specs.lastTitle ?? "Mechanical"} rows={page.specs.mechanical} />
          </div>
          {page.reportLinks ? (
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
          ) : null}
        </div>
      </section>

      {/* --- drawings --- */}
      {page.drawings ? (
      <section className="section-tight rule" id="drawings">
        <div className="shell">
          <header className={styles.sectionHead}>
            <p className="label">Drawings</p>
            <h2 className="h1">{page.drawings.title}</h2>
            <p className="lede">{page.drawings.body}</p>
          </header>
          {page.drawings.renders ? (
            <div className={styles.renderRow}>
              {page.drawings.renders.map((r) => (
                <figure
                  key={r.shot.src}
                  className={styles.figure}
                  style={{ flex: `${r.shot.width / r.shot.height} 1 0` }}
                >
                  <div
                    className={styles.figureShot}
                    style={{ aspectRatio: `${r.shot.width} / ${r.shot.height}` }}
                  >
                    <BoardPhoto shot={r.shot} sizes="(max-width: 52rem) 100vw, 40rem" />
                  </div>
                  <figcaption className={`small ${styles.caption}`}>{r.caption}</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
          <div className={styles.drawings}>
            {page.drawings.items.map((item) => (
              <figure key={item.src} className={styles.drawing}>
                <div
                  className={styles.drawingScroll}
                  role="region"
                  aria-label={item.caption}
                  tabIndex={0}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- line art, served as it is: the image loader would re-encode it lossy */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                    className={styles.drawingImage}
                  />
                </div>
                <figcaption className={`small ${styles.caption}`}>
                  {item.caption}
                  <span className={styles.drawingHint}> Scroll sideways to see all of it.</span>{" "}
                  <a href={item.src} className={styles.link} target="_blank" rel="noopener">
                    Open full size
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {/* --- related product --- */}
      {page.related ? (
      <section className="section-tight rule" id="related">
        <div className="shell">
          <Link href={page.related.href} className={styles.related}>
            <span className="label">{page.related.label}</span>
            <span className={`h3 ${styles.relatedTitle}`}>{page.related.title}</span>
            <span className={styles.relatedBody}>{page.related.body}</span>
            <span className={`data ${styles.relatedGo}`}>
              {page.related.link} <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        </div>
      </section>
      ) : null}

      {/* --- faq --- */}
      <section className="section-tight rule" id="faq">
        <div className="shell">
          <header className={styles.sectionHead}>
            <h2 className="h2">Questions.</h2>
          </header>
          <div className={styles.faq}>
            {page.faq.map((item) => (
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
          <h2 className="h1">{page.closing.title}</h2>
          <p className="lede">{page.closing.body}</p>
          <div className={styles.ctas}>
            {join}
            {enquire}
          </div>
        </div>
      </section>
    </>
  );
}
