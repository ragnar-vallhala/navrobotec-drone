#!/usr/bin/env python3
"""Build the X427 Enclosure images from the Blender stills in
/home/ashu/space/Drone/Navix/stills/enclosure_final (views/ and exploded/,
1920x1080 or 3840x2160, black ground).
Each job crops a box of the source to the frame's aspect ratio, resizes it and
writes a WebP whose name carries the file's content hash, so new artwork lands
on a new URL. A box may reach past the source: the ground is pure black, so the
missing strip is filled with black. Run from the repo root:
python3 scripts/make-enclosure-stills.py
Needs Pillow."""
import hashlib
from PIL import Image

S = "/home/ashu/space/Drone/Navix/stills/enclosure_final/"
# name, source, left, top, crop w, crop h, output size
JOBS = [
    # hero, 3:2
    ("enclosure-hero", "views/hero_34.png", 110, 48, 1700, 1133, (1600, 1067)),
    # /products card, 4:3
    ("enclosure-card", "views/hero_34.png", 110, -23, 1700, 1275, (1400, 1050)),
    # gallery: top 3:2, underside 7:3, I/O end 5:3
    ("enclosure-top", "views/top_34.png", 100, -30, 1700, 1133, (1600, 1067)),
    ("enclosure-bottom", "groups/group_pair.png", 307, 216, 3226, 1815, (1600, 900)),
    ("enclosure-io", "views/io_macro.png", 135, 90, 1650, 990, (1600, 960)),
    # details, 4:3
    ("enclosure-exploded", "exploded/exploded_34.png", 480, 0, 2880, 2160, (1400, 1050)),
    ("enclosure-bracket-io", "views/bracket_io.png", 480, 0, 1440, 1080, (1400, 1050)),
]
for name, src, l, t, w, h, out_size in JOBS:
    im = Image.open(S + src).convert("RGB")
    canvas = Image.new("RGB", (w, h), (0, 0, 0))
    canvas.paste(im.crop((max(l, 0), max(t, 0), min(l + w, im.width), min(t + h, im.height))),
                 (max(-l, 0), max(-t, 0)))
    im = canvas.resize(out_size, Image.LANCZOS)
    tmp = f"/tmp/{name}.webp"
    im.save(tmp, "WEBP", quality=82, method=6)
    data = open(tmp, "rb").read()
    out = f"public/images/{name}.{hashlib.sha256(data).hexdigest()[:8]}.webp"
    open(out, "wb").write(data)
    print(name, im.size, len(data) // 1024, "KB", "/" + out.removeprefix("public/"))
