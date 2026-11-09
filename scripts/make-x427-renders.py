#!/usr/bin/env python3
"""Build the X427 board images for /products and /products/x427.

Source: the Blender stills in /home/ashu/Videos/Navix/stills/
(navix_x427_top_4k.png, navix_x427_bottom_4k.png), 3840x2160, dark ground.
Each view is cropped to the aspect ratio of the frame that shows it, so the
board is never cut by object-fit, then resized and written as WebP. The hash
in each name is the file's content, so new artwork lands on a new URL.

Run:  python3 scripts/make-x427-renders.py <top_4k.png> <bottom_4k.png>
Then update lib/product-media.ts with the printed paths.
Needs Pillow.
"""
import hashlib
import sys

from PIL import Image

# name, source, board centre in the 4k frame, crop width (4k px), aspect w/h,
# output width, share of the crop height above the board centre
JOBS = [
    ("products-hero-wide", "top", (1940, 1090), 3840, 7 / 3, 2000, 0.53),
    ("products-hero-narrow", "top", (1940, 1090), 2500, 4 / 3, 1200, 0.56),
    ("x427-top", "top", (1940, 1090), 2445, 3 / 2, 1600, 0.50),
    ("x427-bottom", "bottom", (1936, 1096), 3000, 7 / 3, 1200, 0.50),
]
src = {"top": Image.open(sys.argv[1]).convert("RGB"),
       "bottom": Image.open(sys.argv[2]).convert("RGB")}

for name, view, (cx, cy), cw, aspect, out_w, above in JOBS:
    im = src[view]
    ch = round(cw / aspect)
    left = min(max(cx - cw // 2, 0), im.width - cw)
    top = min(max(round(cy - above * ch), 0), im.height - ch)
    crop = im.crop((left, top, left + cw, top + ch))
    crop = crop.resize((out_w, round(out_w / aspect)), Image.LANCZOS)
    tmp = f"/tmp/{name}.webp"
    crop.save(tmp, "WEBP", quality=80, method=6)
    data = open(tmp, "rb").read()
    out = f"public/images/{name}.{hashlib.sha256(data).hexdigest()[:8]}.webp"
    open(out, "wb").write(data)
    print(name, crop.size, len(data) // 1024, "KB", "/" + out.removeprefix("public/"))
