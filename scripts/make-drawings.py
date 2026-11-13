#!/usr/bin/env python3
"""Build the dimension drawings shown on the board and enclosure pages from the
PNGs in /home/ashu/space/Drone/Navix/diagrams (1920x1080, a light and a _dark
variant of each). The dark variant sits on the dark tiles of the product pages.
Each drawing is trimmed to its content plus a margin, so the text is as large
as the tile allows, and written as lossless WebP (line art: lossy compression
smears thin lines and small type) with the content hash in the name. Run from
the repo root: python3 scripts/make-drawings.py
Needs Pillow and numpy."""
import hashlib
import numpy as np
from PIL import Image

S = "/home/ashu/space/Drone/Navix/diagrams/"
MARGIN = 28
NAMES = [
    "x427_top_dims",
    "x427_bottom_dims",
    "x427_mini_top_dims",
    "x427_enc_top_dims",
    "x427_enc_bottom_dims",
    "x427_enc_side_end_dims",
    "x427_enc_sections",
]
for name in NAMES:
    im = Image.open(f"{S}{name}_dark.png").convert("RGB")
    a = np.asarray(im).astype(int)
    diff = np.abs(a - a[0, 0]).sum(axis=2) > 24
    ys, xs = np.where(diff)
    box = (max(xs.min() - MARGIN, 0), max(ys.min() - MARGIN, 0),
           min(xs.max() + MARGIN, im.width), min(ys.max() + MARGIN, im.height))
    im = im.crop(box)
    tmp = f"/tmp/{name}.webp"
    im.save(tmp, "WEBP", lossless=True, method=6)
    data = open(tmp, "rb").read()
    slug = name.replace("_", "-")
    out = f"public/images/drawing-{slug}.{hashlib.sha256(data).hexdigest()[:8]}.webp"
    open(out, "wb").write(data)
    print(name, im.size, len(data) // 1024, "KB", "/" + out.removeprefix("public/"))
