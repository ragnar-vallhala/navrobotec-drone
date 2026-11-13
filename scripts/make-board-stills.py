#!/usr/bin/env python3
"""Build the X427 and X427 Mini images from the Blender stills in
/home/ashu/space/Drone/Navix/stills (hero/, mini/ and enclosure_final/groups, dark ground).
Each job crops a box of the source to the frame's aspect ratio, resizes it and
writes a WebP whose name carries the file's content hash, so new artwork lands
on a new URL. Run from the repo root: python3 scripts/make-board-stills.py
Needs Pillow."""
import hashlib
from PIL import Image

S = "/home/ashu/space/Drone/Navix/stills/"
# name, source, left, top, crop w, crop h, output size
JOBS = [
    ("x427-top", "hero/high_34.png", 197, 29, 1500, 1000, (1600, 1067)),
    ("x427-bottom", "hero/bot_high.png", 180, 40, 1500, 1000, (1200, 800)),
    ("products-hero-wide", "enclosure_final/groups/group_five.png", 0, 560, 3840, 1646, (2000, 857)),
    ("products-hero-narrow", "enclosure_final/groups/group_five.png", 592, 30, 2800, 2100, (1200, 900)),
    ("x427-card", "hero/high_34.png", 247, 4, 1400, 1050, (1200, 900)),
    ("x427-popup-top", "hero/high_34.png", 272, 0, 1350, 1080, (1200, 960)),
    ("x427-popup-bottom", "hero/bot_high.png", 278, 0, 1350, 1080, (1200, 960)),
    ("product-x427-mini", "mini/mini_high.png", 259, 0, 1440, 1080, (1400, 1050)),
    ("product-x427-mini-top", "mini/mini_high.png", 229, 61, 1500, 1000, (1600, 1066)),
    ("product-x427-mini-bottom", "mini/mini_bot_high.png", 210, 40, 1500, 1000, (1200, 800)),
    ("product-x427-mini-detail", "mini/mini_tilt.png", 203, 101, 1500, 919, (1600, 980)),
]
for name, src, l, t, w, h, out_size in JOBS:
    im = Image.open(S + src).convert("RGB").crop((l, t, l + w, t + h))
    im = im.resize(out_size, Image.LANCZOS)
    tmp = f"/tmp/{name}.webp"
    im.save(tmp, "WEBP", quality=82, method=6)
    data = open(tmp, "rb").read()
    out = f"public/images/{name}.{hashlib.sha256(data).hexdigest()[:8]}.webp"
    open(out, "wb").write(data)
    print(name, im.size, len(data) // 1024, "KB", "/" + out.removeprefix("public/"))
