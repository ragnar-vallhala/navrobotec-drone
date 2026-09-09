#!/usr/bin/env python3
"""Build public/images/product-*.webp from assets/product-source/*.png.

Three things happen here, and only the first is obvious.

1. The C2PA box goes. The sources carry a ~22 KB `caBX` chunk — the content
   credentials the generator writes. Re-encoding drops it along with every
   other ancillary chunk. Worth knowing what that means: `caBX` is the
   standard AI-provenance signal, so removing it removes the machine-readable
   disclosure that these are generated renders. The page says they are renders
   in words instead; see app/products/page.tsx.

2. Two of the three have a *painted* checkerboard. They look transparent and
   are not: the file is RGB with 0% alpha and the grey squares are pixels —
   a picture of transparency. Dropped onto a dark card they would have shown
   as a grey chequered rectangle. The pattern is two desaturated tones, about
   134 and 197, on a ~9px period, so it is keyed by tone and then flood-filled
   from the border: flooding is what protects the silver top of the airframe,
   which sits at almost exactly the light tone and would otherwise be punched
   straight through.

3. Everything is trimmed to its own subject and padded to one frame, so three
   renders shot at different scales sit at the same size on the page.

Run:  python3 scripts/make-product-images.py
Needs Pillow and numpy.
"""

import glob
import hashlib
import os
import pathlib
import sys

try:
    from PIL import Image, ImageFilter
    import numpy as np
except ImportError:
    sys.exit("needs Pillow and numpy: pip install pillow numpy")

SRC = "assets/product-source"
OUT = "public/images"
OUT_W, OUT_H = 1400, 1050          # 4:3, the frame the card draws
MARGIN = 0.06

# The checker is two desaturated tones, about 134 and 197. The candidate band
# spans both *and the transition between them*: taken as two narrow bands
# around each tone, the ~165 pixels along every square's edge fall in the gap,
# every square is disconnected from its neighbours, and the flood cannot leave
# the one it started in. That is exactly what happened first time — a thin
# border came away and the rest of the board stayed.
CHECKER_LO, CHECKER_HI = 112, 218
SAT_TOL = 20                       # the checker is grey; the products are not
LOCAL_WINDOW = 9                   # about twice the checker period
LOCAL_SPREAD_MIN = 16              # checker ~30, a smooth painted panel ~2
CLOSE = 9                          # closing kernel, in px, for the seams above
SPECK_FLOOR = 0.0004               # a component smaller than this is noise


def _local_spread(grey: np.ndarray, radius: int) -> np.ndarray:
    """Standard deviation in a box around each pixel.

    Box blur gives the local mean; blurring the squares gives the local mean
    of squares, and the difference of those is the variance. Cheap, and it is
    the one measurement that tells a chequered ground from a smooth one.
    """
    def box_mean(a: np.ndarray) -> np.ndarray:
        # Integral image. PIL's BoxBlur refuses mode "F", and the exact answer
        # is four array reads per pixel anyway.
        h, w = a.shape
        k = 2 * radius + 1
        pad = np.pad(a.astype(np.float64), radius, mode="edge")
        cs = np.pad(pad.cumsum(0).cumsum(1), ((1, 0), (1, 0)))
        total = (cs[k:k + h, k:k + w] - cs[0:h, k:k + w]
                 - cs[k:k + h, 0:w] + cs[0:h, 0:w])
        return total / (k * k)

    mean = box_mean(grey)
    mean_sq = box_mean(grey.astype(np.float64) ** 2)
    return np.sqrt(np.maximum(mean_sq - mean ** 2, 0))


def _flood_from_border(candidate: np.ndarray) -> np.ndarray:
    """Candidate pixels reachable from the edge, 4-connected."""
    from collections import deque

    h, w = candidate.shape
    seen = np.zeros((h, w), dtype=bool)
    queue = deque()

    def push(y: int, x: int) -> None:
        if candidate[y, x] and not seen[y, x]:
            seen[y, x] = True
            queue.append((y, x))

    for x in range(w):
        push(0, x)
        push(h - 1, x)
    for y in range(h):
        push(y, 0)
        push(y, w - 1)

    while queue:
        y, x = queue.popleft()
        if y > 0:
            push(y - 1, x)
        if y + 1 < h:
            push(y + 1, x)
        if x > 0:
            push(y, x - 1)
        if x + 1 < w:
            push(y, x + 1)
    return seen


def _drop_specks(mask: np.ndarray, min_fraction: float) -> np.ndarray:
    """Keep only connected components larger than `min_fraction` of the frame.

    Compression noise in the chequered ground lands outside the tolerance
    band, so the flood never claims it and it survives as subject — then the
    closing grows it. The result is a scatter of white flecks across the
    background. A product is one large object; a fleck is not.
    """
    from collections import deque

    h, w = mask.shape
    seen = np.zeros((h, w), dtype=bool)
    keep = np.zeros((h, w), dtype=bool)
    floor = int(min_fraction * h * w)

    for y0 in range(h):
        row = mask[y0]
        for x0 in np.flatnonzero(row & ~seen[y0]):
            queue = deque([(y0, int(x0))])
            seen[y0, x0] = True
            cells = []
            while queue:
                y, x = queue.popleft()
                cells.append((y, x))
                for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        queue.append((ny, nx))
            if len(cells) >= floor:
                ys, xs = zip(*cells)
                keep[np.array(ys), np.array(xs)] = True
    return keep


def key_checkerboard(im: Image.Image) -> Image.Image:
    """Alpha from a painted checkerboard background."""
    rgb = np.array(im.convert("RGB")).astype(int)
    grey = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)

    # Tone alone cannot separate these: the airframe's silver top sits at
    # almost exactly the light checker tone, and keying on tone punched the
    # whole fuselage out — the flood reached it along the anti-aliased edges
    # of the arms and the white blade tips.
    #
    # What actually distinguishes them is texture. The checker alternates
    # between its two tones every ~9px, so the local spread over an 18px
    # window is around 30; the fuselage is a smooth gradient, so its spread is
    # near zero. Gating on that breaks every path into the subject.
    local = _local_spread(grey, LOCAL_WINDOW)
    candidate = ((grey >= CHECKER_LO) & (grey <= CHECKER_HI)
                 & (sat <= SAT_TOL) & (local >= LOCAL_SPREAD_MIN))

    # Only the part of that reachable from the edge is background. Without
    # this, every grey panel on the product goes with it — the airframe's
    # silver top sits at almost exactly the light checker tone.
    #
    # The flood is written out rather than handed to ImageDraw.floodfill,
    # which filled nothing here: 5120 border seeds, 0% found. A BFS over the
    # candidate mask is a dozen lines and can be checked.
    background = _flood_from_border(candidate)

    # Where two materials meet on the product the local spread is high too, so
    # the flood creeps along those seams and bites into the subject: the
    # airframe came back with chunks missing along the edge of its shell and
    # the tips of its blades. The incursions are thin and the holes are small,
    # which is exactly what a closing removes — grow the subject, then shrink
    # it by the same amount, and only the thin things fail to come back.
    subject = Image.fromarray(np.where(background, 0, 255).astype(np.uint8), "L")
    subject = subject.filter(ImageFilter.MaxFilter(CLOSE))
    subject = subject.filter(ImageFilter.MinFilter(CLOSE))
    alpha = np.array(subject)

    # Whatever specks the closing did not reach are holes by definition: a
    # transparent region the border cannot reach is enclosed by the product,
    # and no render of a solid object has windows in the middle of its shell.
    # Filling them by that test is exact, where a bigger kernel would only
    # have been a bigger guess.
    alpha = np.where(_flood_from_border(alpha == 0), 0, 255).astype(np.uint8)
    alpha = np.where(_drop_specks(alpha > 0, SPECK_FLOOR), 255, 0).astype(np.uint8)

    # The edge pixels are blends of subject and checker, so they keep a grey
    # fringe. Pulling the alpha in by a pixel drops them; at the size these
    # are drawn, a pixel of subject is not missed and a grey halo is.
    a = Image.fromarray(alpha, "L").filter(ImageFilter.MinFilter(3))
    a = a.filter(ImageFilter.GaussianBlur(0.6))

    out = im.convert("RGBA")
    out.putalpha(a)
    return out


def frame(im: Image.Image) -> Image.Image:
    """Trim to the subject, then centre it in one common frame."""
    box = im.getbbox()
    if box:
        im = im.crop(box)
    canvas = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    inner = (round(OUT_W * (1 - 2 * MARGIN)), round(OUT_H * (1 - 2 * MARGIN)))
    fitted = im.copy()
    fitted.thumbnail(inner, Image.LANCZOS)
    canvas.paste(fitted,
                 ((OUT_W - fitted.width) // 2, (OUT_H - fitted.height) // 2),
                 fitted)
    return canvas


def main() -> int:
    written: dict[str, str] = {}
    for path in sorted(glob.glob(os.path.join(SRC, "*.png"))):
        name = pathlib.Path(path).stem
        im = Image.open(path)
        had_alpha = im.mode == "RGBA" and np.array(im)[..., 3].min() < 250

        im = key_checkerboard(im) if not had_alpha else im.convert("RGBA")
        out = frame(im)

        tmp = os.path.join(OUT, f".product-{name}.tmp.webp")
        out.save(tmp, "WEBP", quality=90, method=6, exact=True)
        digest = hashlib.sha1(open(tmp, "rb").read()).hexdigest()[:8]
        final = os.path.join(OUT, f"product-{name}.{digest}.webp")
        os.replace(tmp, final)
        written[name] = "/" + os.path.relpath(final, "public")

        clear = 100 * (np.array(out)[..., 3] < 16).mean()
        print(f"{name:16} {'had alpha' if had_alpha else 'checker keyed':14} "
              f"-> {os.path.basename(final)}  transparent={clear:.0f}%  "
              f"{os.path.getsize(final) // 1024}KB")

    for stale in glob.glob(os.path.join(OUT, "product-*.webp")):
        if "/" + os.path.relpath(stale, "public") not in written.values():
            os.remove(stale)
            print(f"removed stale {stale}")

    module = pathlib.Path("lib/product-images.ts")
    module.write_text(
        "// Generated by scripts/make-product-images.py — do not edit.\n"
        "// Keyed by product slug. The hash is the file's own content, so new\n"
        "// artwork always lands on a new URL.\n"
        "export const PRODUCT_IMAGES: Record<string, string> = {\n"
        + "".join(f'  "{k}": "{v}",\n' for k, v in written.items())
        + "};\n"
    )
    print(f"wrote {module}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
