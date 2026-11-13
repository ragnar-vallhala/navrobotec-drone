#!/usr/bin/env python3
"""Renders shown beside the dimension drawings (X427, X427 Mini, X427 Enclosure).
Source: Blender stills in /home/ashu/space/Drone/Navix/stills, 1920x1080.
Crops a box to the tile's aspect ratio, resizes, writes WebP with a content-hash
name in public/images/. Run from the repo root. Needs Pillow."""
import hashlib
from PIL import Image

S = "/home/ashu/space/Drone/Navix/stills/"
# name, source, left, top, crop w, crop h, output size
JOBS = [
    ("render-x427-flat", "hero/top_down.png", 560, 20, 800, 1000, (960, 1200)),
    ("render-x427-tilt", "hero/tilt_rev.png", 247, 108, 1500, 1000, (1200, 800)),
    ("render-mini-flat", "mini/mini_top_down.png", 210, 40, 1500, 1000, (1200, 800)),
    ("render-mini-side", "mini/mini_orbit_r.png", 241, 60, 1500, 1000, (1200, 800)),
    ("render-enclosure-flat", "enclosure_final/views/top_view.png", 210, 40, 1500, 1000, (1200, 800)),
    ("render-enclosure-side", "enclosure_final/views/side_front_34.png", 241, 80, 1500, 1000, (1200, 800)),
]
for name, src, l, t, w, h, size in JOBS:
    im = Image.open(S + src).convert("RGB").crop((l, t, l + w, t + h)).resize(size, Image.LANCZOS)
    tmp = f"/tmp/{name}.webp"
    im.save(tmp, "WEBP", quality=82, method=6)
    data = open(tmp, "rb").read()
    out = f"public/images/{name}.{hashlib.sha256(data).hexdigest()[:8]}.webp"
    open(out, "wb").write(data)
    print(name, im.size, len(data) // 1024, "KB", "/" + out.removeprefix("public/"))
