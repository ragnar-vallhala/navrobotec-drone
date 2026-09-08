#!/usr/bin/env python3
"""Rebuild public/logos/*-colour.png from assets/logos-source/*.png.

The partner logos arrived with their white plates baked in: three fully
opaque, and dpiit.png as a semi-transparent white haze — 83% of its pixels
carried partial alpha. Each supplier also baked in a different amount of
padding, so a row of them aligned on their canvases rather than on their
marks.

This keeps the brand colour and takes only the plate away:

  * the background is flood-filled from the border, so only white that is
    connected to the outside is removed. White enclosed by the mark — the gaps
    in the Ashoka pillar's line art, the ground behind the sprig inside the
    i3c mark — is part of the artwork and stays. Thresholding every light
    pixel instead punched those out and left both as blobs.
  * the alpha edge is softened by a fraction of a pixel, because the flood
    stops at the antialias ring and a hard boundary shows as jaggies once the
    mark is scaled down to strip size.
  * each mark is then trimmed to its own ink.

The page puts them on a white chip in both themes: these are drawn for white,
and on the near-black ground the navy in the i3c mark and the black in DPIIT
would otherwise disappear.

Run after replacing anything in assets/logos-source:

    python3 scripts/make-logo-marks.py

Needs Pillow and numpy. Not wired into the build — the inputs change about
once a year, and the outputs are committed.
"""

import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFilter
    import numpy as np
except ImportError:
    sys.exit("needs Pillow and numpy: pip install pillow numpy")

SRC = "assets/logos-source"
OUT = "public/logos"
PLATE = 235      # min-channel at or above this may be plate
SENTINEL = (255, 0, 255)
EDGE = 0.6       # px of softening on the cut
MAX_EDGE = 900   # drawn at ~40px; generous even at 3x
SUFFIX = "colour"


def strip_plate(flat: Image.Image) -> Image.Image:
    """Alpha mask: everything except the border-connected near-white."""
    work = flat.copy()
    px = work.load()
    w, h = work.size

    border = (
        [(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)]
        + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]
    )
    for x, y in border:
        r, g, b = px[x, y]
        if (r, g, b) == SENTINEL:
            continue                    # already flooded from an earlier seed
        if min(r, g, b) >= PLATE:
            ImageDraw.floodfill(work, (x, y), SENTINEL, thresh=24)

    bg = np.all(np.array(work) == SENTINEL, axis=2)
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    return Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(EDGE))


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
        rgb = flat.convert("RGB")

        img = rgb.convert("RGBA")
        img.putalpha(strip_plate(rgb))

        box = img.getbbox()
        if box:
            img = img.crop(box)
        w, h = img.size
        if max(w, h) > MAX_EDGE:
            s = MAX_EDGE / max(w, h)
            img = img.resize((round(w * s), round(h * s)), Image.LANCZOS)

        # New artwork needs a new filename. Next hands out optimised images
        # `immutable`, so replacing the bytes under a name that has already
        # been fetched strands returning visitors on the old logo for a year —
        # it happened twice while these were being worked out. Change SUFFIX,
        # not just the pixels.
        path = os.path.join(OUT, name.replace(".png", f"-{SUFFIX}.png"))
        img.save(path, optimize=True)
        cut = 100 * (np.array(img)[..., 3] < 16).mean()
        print(f"{os.path.basename(path):22} {im.size[0]}x{im.size[1]} -> "
              f"{img.size[0]}x{img.size[1]}  plate-removed={cut:.0f}%  "
              f"{os.path.getsize(path) // 1024}KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
