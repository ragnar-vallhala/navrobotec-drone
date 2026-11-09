#!/usr/bin/env python3
"""Build public/images/product-x427.<hash>.webp from the KiCad top render.

The render sits on a blue-violet gradient. That ground is keyed out by
flood-filling from the border over pixels that are bluer than the board ever
is, so the board lands transparent on the dark product band like the others.

Run:  python3 scripts/make-x427-image.py <render_top.png>
Then add the printed path to lib/product-images.ts under "x427".
Needs Pillow and numpy.
"""
import hashlib
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

src = sys.argv[1]
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(int)
h, w, _ = a.shape
r, g, b = a[..., 0], a[..., 1], a[..., 2]
bg = (b > r + 12) & (b > g + 12)

seen = np.zeros((h, w), bool)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if bg[y, x] and not seen[y, x]:
            seen[y, x] = True
            q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if bg[y, x] and not seen[y, x]:
            seen[y, x] = True
            q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and bg[ny, nx] and not seen[ny, nx]:
            seen[ny, nx] = True
            q.append((ny, nx))

# The four mounting holes show the ground through the board; they are not
# reachable from the border, so take the bluish pixels that form a solid
# blob of their own (a hole is ~900 px, a stray antialiased pixel is not).
rest = bg & ~seen
for y0, x0 in zip(*np.nonzero(rest)):
    if seen[y0, x0]:
        continue
    comp, q = [(y0, x0)], deque([(y0, x0)])
    seen[y0, x0] = True
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and rest[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                comp.append((ny, nx))
                q.append((ny, nx))
    if len(comp) < 300:
        for y, x in comp:
            seen[y, x] = False
alpha = Image.fromarray(((~seen) * 255).astype("uint8"))
alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
rgba = im.convert("RGBA")
rgba.putalpha(alpha)
rgba = rgba.crop(rgba.getbbox())

W, H = 1200, 900
scale = min(W * 0.92 / rgba.width, 1.0)
if scale < 1:
    rgba = rgba.resize((round(rgba.width * scale), round(rgba.height * scale)), Image.LANCZOS)
canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
canvas.paste(rgba, ((W - rgba.width) // 2, (H - rgba.height) // 2), rgba)
tmp = "/tmp/x427-tmp.webp"
canvas.save(tmp, "WEBP", quality=80, method=6)
digest = hashlib.sha256(open(tmp, "rb").read()).hexdigest()[:8]
out = f"public/images/product-x427.{digest}.webp"
canvas.save(out, "WEBP", quality=80, method=6)
print("/" + out.removeprefix("public/"))
