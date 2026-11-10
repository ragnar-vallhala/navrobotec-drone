import Image from "@/components/Photo";
import LoopVideo from "./LoopVideo";
import styles from "./FlightLog.module.css";

/* Footage from our own test days. Captions say only what the frame shows. */

const CLIPS = [
  {
    src: "/media/flight-day.mp4",
    poster: "/media/flight-day-poster.jpg",
    caption: "Daylight flight test",
  },
  {
    src: "/media/flight-night.mp4",
    poster: "/media/flight-night-poster.jpg",
    caption: "Night flight, September 2026",
  },
  {
    src: "/media/flight-dusk.mp4",
    poster: "/media/flight-dusk-poster.jpg",
    caption: "Dusk flight test",
  },
];

const STILLS = [
  {
    src: "/media/ground-test.jpg",
    alt: "Quadcopter on a grass field in daylight, before a flight test.",
    caption: "Pre-flight, on the field",
    width: 1600,
    height: 1200,
  },
  {
    src: "/media/flight-sunset.jpg",
    alt: "Operator watching the quadcopter in flight at sunset.",
    caption: "Flight test, sunset",
    width: 1600,
    height: 900,
  },
];

export default function FlightLog() {
  return (
    <section className="section rule">
      <div className="shell">
        <header className={styles.head}>
          <p className="label">Flight tests</p>
          <h2 className="h1">Flight test footage</h2>
        </header>

        <ul className={styles.clips}>
          {CLIPS.map((clip) => (
            <li key={clip.src}>
              <figure className={styles.figure}>
                <LoopVideo
                  src={clip.src}
                  poster={clip.poster}
                  label={clip.caption}
                  className={styles.media}
                />
                <figcaption className={`data ${styles.caption}`}>
                  {clip.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <ul className={styles.stills}>
          {STILLS.map((still) => (
            <li key={still.src}>
              <figure className={styles.figure}>
                <Image
                  src={still.src}
                  alt={still.alt}
                  width={still.width}
                  height={still.height}
                  sizes="(max-width: 48rem) 100vw, 50vw"
                  className={styles.media}
                />
                <figcaption className={`data ${styles.caption}`}>
                  {still.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
