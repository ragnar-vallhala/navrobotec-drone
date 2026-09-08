#!/usr/bin/env python3
"""Rebuild public/logos/*.png from assets/logos-source/*.png.

The partner logos arrived with their white plates baked in: three fully
opaque, and dpiit.png as a semi-transparent white haze — 83% of its pixels
carried partial alpha — which is why it rendered as a milky rectangle on a
dark ground and why the strip could not be made to work in both themes with
CSS filters alone. Four brand palettes at 34px is also a mess on any ground.

So the marks are baked monochrome-on-transparent, and the page tones them with
opacity and inverts them in dark mode. Coverage is derived from the pixels:

  * alpha tracks distance from white on the *minimum* channel, so a saturated
    orange counts as ink at nearly full strength while a near-white antialias
    edge does not. Reading it off luminance instead would have made Start in
    UP, which is light orange and pink, half the weight of DPIIT.
  * a per-logo gamma then puts the bulk of each mark's ink at the same
    density, so the four carry one weight as a set.
  * interior white goes with the rest, which is what keeps the Ashoka pillar's
    line art and the sprig inside the i3c mark as line art rather than blobs.
    A plain threshold flattened both.
  * each mark is trimmed to its own ink, so the row aligns on the marks rather
    than on whatever padding each supplier baked into its canvas.

Run after replacing anything in assets/logos-source:

    python3 scripts/make-mono-logos.py

Needs Pillow and numpy. Not wired into the build — the inputs change about
once a year, and the outputs are committed.
"""

import os
import sys

try:
    from PIL import Image
    import numpy as np
except ImportError:
    sys.exit("needs Pillow and numpy: pip install pillow numpy")

SRC = "assets/logos-source"
OUT = "public/logos"
WHITE = 246      # min-channel at or above this is plate, not ink
TARGET = 205.0   # where the bulk of a mark's ink should land
MAX_EDGE = 800   # drawn at ~34-44px; generous even at 3x


def main() -> int:
    names = sorted(f for f in os.listdir(SRC) if f.endswith(".png"))
    if not names:
        sys.exit(f"no source logos in {SRC}")

    for name in names:
        im = Image.open(os.path.join(SRC, name)).convert("RGBA")
        # Flatten onto white first: dpiit's partial alpha *is* a white haze,
        # and compositing it is what turns that back into pixels to measure.
        flat = Image.new("RGBA", im.size, (255, 255, 255, 255))
        flat.alpha_composite(im)
        rgb = np.array(flat.convert("RGB")).astype(np.float32)

        a = np.clip((WHITE - rgb.min(axis=2)) * (255.0 / WHITE), 0, 255)

        ink = a[a > 24]
        p60 = float(np.percentile(ink, 60)) if ink.size else 255.0
        gamma = 1.0
        if p60 < 254:
            gamma = float(np.clip(
                np.log(TARGET / 255.0) / np.log(max(p60, 1.0) / 255.0), 0.25, 1.0))
            a = 255.0 * np.power(a / 255.0, gamma)

        out = np.zeros(rgb.shape[:2] + (4,), dtype=np.uint8)  # black ink
        out[..., 3] = np.clip(a, 0, 255).astype(np.uint8)
        img = Image.fromarray(out, "RGBA")

        box = img.getbbox()
        if box:
            img = img.crop(box)
        w, h = img.size
        if max(w, h) > MAX_EDGE:
            s = MAX_EDGE / max(w, h)
            img = img.resize((round(w * s), round(h * s)), Image.LANCZOS)

        # "-mark" so the derived file never sits at the URL its source
        # once had: Next serves optimised images `immutable`, so replacing
        # bytes under a name that has already been fetched leaves returning
        # visitors on the old logo for a year.
        path = os.path.join(OUT, name.replace(".png", "-mark.png"))
        img.save(path, optimize=True)
        print(f"{os.path.basename(path):22} {im.size[0]}x{im.size[1]} -> {img.size[0]}x{img.size[1]}"
              f"  gamma={gamma:.2f}  {os.path.getsize(path) // 1024}KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
