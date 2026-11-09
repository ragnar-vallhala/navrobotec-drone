#!/usr/bin/env python3
"""Build the X427 board images for the product page and the /products opening.

Same keying as make-x427-image.py (the KiCad render's blue-violet ground is
flood-filled away from the border and out of the mounting holes), but the
result is cropped to the board itself, with no canvas around it, so the page
can size and place it. One file per view.

Run:  python3 scripts/make-x427-hero.py <render_top.png> <render_bottom.png>
Then update lib/product-media.ts with the printed paths.
Needs Pillow and numpy.
"""
import hashlib
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

NB = ((1, 0), (-1, 0), (0, 1), (0, -1))


def key_board(path):
    im = Image.open(path).convert("RGB")
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
        for dy, dx in NB:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and bg[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    rest = bg & ~seen
    for y0, x0 in zip(*np.nonzero(rest)):
        if seen[y0, x0]:
            continue
        comp, q = [(y0, x0)], deque([(y0, x0)])
        seen[y0, x0] = True
        while q:
            y, x = q.popleft()
            for dy, dx in NB:
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
    return rgba.crop(rgba.getbbox())


for name, path in (("top", sys.argv[1]), ("bottom", sys.argv[2])):
    board = key_board(path)
    tmp = f"/tmp/x427-{name}.webp"
    board.save(tmp, "WEBP", quality=82, method=6)
    digest = hashlib.sha256(open(tmp, "rb").read()).hexdigest()[:8]
    out = f"public/images/x427-{name}.{digest}.webp"
    board.save(out, "WEBP", quality=82, method=6)
    print(name, board.size, "/" + out.removeprefix("public/"))
