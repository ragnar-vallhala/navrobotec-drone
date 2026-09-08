#!/usr/bin/env python3
"""Build the page imagery: the focus rows, and the /technology hero.

The section's heading is "Own every layer, and prove it", and it was
illustrated with three photographs that proved nothing: a stock hand holding
someone's flight controller, a quadcopter against blank sky, and a rack of
other people's airframes. Two other candidates in the repo are worse —
drone_cta.png is AI-generated and carries a different company's name on the
airframe, and far_away.jpg is an FPV racing build that is not theirs.

These three are: the board layout, the board itself powered up with the
NAVROBOTEC silkscreen on it, and the VAYU render. Design, hardware, flight —
in that order, which is also the order the three claims are in.

Sources and licences are recorded in assets/focus-source/CREDITS.md. Read it
before swapping anything in: two images already in public/images look usable
and are not — drone_cta.png is AI-generated and carries another company's name
on the airframe, and far_away.jpg is somebody's FPV racing build.

Filenames carry a hash of their own bytes, and the script writes the paths
into lib/page-images.ts for the pages to import. That is not tidiness: Next
serves optimised images `immutable`, so re-generating different artwork under
a name that has already been fetched leaves the old picture on screen — which
happened three times while this section was being built, twice convincingly
enough to look like a bug in the CSS. New pixels, new URL, automatically.

Run:  python3 scripts/make-focus-images.py
Needs Pillow.
"""

import glob
import hashlib
import os
import pathlib
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("needs Pillow: pip install pillow")



def cover(im: Image.Image, size: tuple[int, int], focus_y: float = 0.5) -> Image.Image:
    """Crop to the output aspect, keeping the widest possible frame.

    `focus_y` is where the subject sits vertically, 0-1, so a tall photo is
    cropped around its subject rather than around its middle.
    """
    out_w, out_h = size
    aspect = out_w / out_h
    w, h = im.size
    if w / h > aspect:                      # too wide: trim the sides
        new_w = round(h * aspect)
        x = (w - new_w) // 2
        im = im.crop((x, 0, x + new_w, h))
    else:                                   # too tall: trim top and bottom
        new_h = round(w / aspect)
        y = round((h - new_h) * focus_y)
        y = max(0, min(y, h - new_h))
        im = im.crop((0, y, w, y + new_h))
    return im.resize(size, Image.LANCZOS)


def pad(im: Image.Image, size: tuple[int, int], margin: float = 0.06) -> Image.Image:
    """Fit the whole image into the frame on its own background colour.

    For the layout figure: it is a screenshot with labels running to every
    edge, so cropping it to 4:3 would cut the pin names off. The ground is
    taken from its own corner pixel, which makes the padding invisible.
    """
    im = im.convert("RGB")
    bg = im.getpixel((0, 0))
    out_w, out_h = size
    canvas = Image.new("RGB", size, bg)
    inner = (round(out_w * (1 - 2 * margin)), round(out_h * (1 - 2 * margin)))
    fitted = im.copy()
    fitted.thumbnail(inner, Image.LANCZOS)
    canvas.paste(fitted, ((out_w - fitted.width) // 2, (out_h - fitted.height) // 2))
    return canvas


FOCUS = (1600, 1200)     # 4:3, the frame the focus rows draw
HERO = (3200, 1371)      # 21:9 at 100vw, so it is not upscaled on a wide screen

JOBS = [
    # (source, output, size, how, pre-crop as fractions of the source or None)
    ("assets/focus-source/pcb-macro.jpg", "focus-layout", FOCUS, "cover:0.5", None),
    ("assets/focus-source/damped-oscillation.jpg", "focus-timing", FOCUS, "cover:0.5", None),
    # In tight on both aircraft. Taken whole this is mostly empty sky, which
    # is the fault the photograph it replaced had.
    ("assets/focus-source/two-aircraft.jpg", "focus-scale", FOCUS, "cover:0.5",
     (0.24, 0.22, 0.93, 0.95)),
    # /technology opens on "built from the silicon up", so it opens on silicon.
    # What was there was a 894x670 stock photograph of a hand holding somebody
    # else's flight controller, stretched across a 21:9 band — a 2x upscale of
    # the same picture the homepage had already dropped for proving nothing.
    ("assets/focus-source/silicon-wafer.jpg", "hero-technology", HERO, "cover:0.5", None),
]


def main() -> int:
    written: dict[str, str] = {}
    for src, name, size, how, box in JOBS:
        if not os.path.exists(src):
            sys.exit(f"missing source: {src}")
        im = Image.open(src)
        if box:
            w, h = im.size
            l, t, r, b = box
            im = im.crop((round(l * w), round(t * h), round(r * w), round(b * h)))
        if how.startswith("cover"):
            out = cover(im.convert("RGB"), size, float(how.split(":")[1]))
        else:
            out = pad(im, size)
        tmp = os.path.join("public/images", f".{name}.tmp.webp")
        out.save(tmp, "WEBP", quality=88, method=6)
        digest = hashlib.sha1(open(tmp, "rb").read()).hexdigest()[:8]
        path = os.path.join("public/images", f"{name}.{digest}.webp")
        os.replace(tmp, path)
        written[name] = "/" + os.path.relpath(path, "public")
        print(f"{src:42} -> {path}  {im.size[0]}x{im.size[1]} -> "
              f"{out.size[0]}x{out.size[1]}  {os.path.getsize(path) // 1024}KB")

    for stale in glob.glob("public/images/focus-*.webp") + glob.glob("public/images/hero-*.webp"):
        if "/" + os.path.relpath(stale, "public") not in written.values():
            os.remove(stale)
            print(f"removed stale {stale}")

    module = pathlib.Path("lib/page-images.ts")
    module.write_text(
        "// Generated by scripts/make-page-images.py — do not edit.\n"
        "// The hash is the file's own content, so new artwork always lands on\n"
        "// a new URL. Next serves optimised images `immutable`.\n"
        "export const PAGE_IMAGES = {\n"
        + "".join(f'  "{k}": "{v}",\n' for k, v in written.items())
        + "} as const;\n"
    )
    print(f"wrote {module}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
