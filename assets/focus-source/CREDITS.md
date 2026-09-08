# Page imagery

Sources for the images `scripts/make-page-images.py` builds into
`public/images/`. All are from Unsplash under the
[Unsplash License](https://unsplash.com/license): free for commercial use,
no permission or attribution required. The credits are recorded anyway,
because knowing where an asset came from is worth more than the licence asks.

| Row | Output | Source | Photographer |
|---|---|---|---|
| 01 Sovereign foundation | `focus-layout` | [unsplash.com/photos/pfR18JNEMv8](https://unsplash.com/photos/pfR18JNEMv8) → `pcb-macro.jpg` | Vishnu Mohanan |
| 02 Real-time reliability | `focus-timing` | [unsplash.com/photos/Os_ISjoU4Lg](https://unsplash.com/photos/Os_ISjoU4Lg) → `damped-oscillation.jpg` | Bozhin Karaivanov |
| 03 Built to grow | `focus-scale` | [unsplash.com/photos/FQa5xUZlAUo](https://unsplash.com/photos/FQa5xUZlAUo) → `two-aircraft.jpg` | Valentin Zickner |
| /technology hero | `hero-technology` | [unsplash.com/photos/qOx9KsvpqcM](https://unsplash.com/photos/qOx9KsvpqcM) → `silicon-wafer.jpg` | Laura Ockel |

Copper, a settling response, two aircraft — the layer, the loop, the fleet.

## Rejected, and why

Worth recording so nobody spends the search again.

* **An Arduino Uno** was the best-lit development board in the results. It is
  the exact thing this company positions against; putting it under
  "Real-time reliability" would argue the opposite case.
* **`public/images/drone_cta.png`**, already in the repo, is AI-generated.
  The airframe carries another company's name and the lettering on it is
  garbled. Do not use it anywhere.
* **`public/images/far_away.jpg`**, also in the repo, is a photograph of
  somebody's FPV racing build.
* **A vintage analogue oscilloscope** with a blank screen: reads as old lab
  equipment, not as a hard real-time flight stack.
* **`public/images/frame-technology.jpg`** was the /technology hero: the same
  stock hand-holding-a-flight-controller shot the homepage had already
  dropped, and 894x670 for a 21:9 band that asks for 3200. Still referenced
  by nothing; safe to delete.

## The strongest image is not in here

`public/data/report/img/real_pcb.jpeg` is NAVROBOTEC's own flight controller,
powered, LEDs lit, the company's name silkscreened across it — and it is the
hardware the benchmark that row 02 links to was run on. Under a heading that
reads "Own every layer, and prove it", a photograph of the actual board beats
any stock photograph of anything. It was in row 02 and was swapped out for
the Unsplash image on request. To put it back, one line in
`scripts/make-focus-images.py`:

    ("public/data/report/img/real_pcb.jpeg", "focus-timing", "cover:0.52", None),

then re-run the script.
