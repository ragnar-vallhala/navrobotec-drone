#!/usr/bin/env python3
"""Build the three /images/focus-*.webp used by the focus section.

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
into lib/focus-images.ts for the page to import. That is not tidiness: Next
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

OUT_W, OUT_H = 1600, 1200          # 4:3, the frame the section draws
ASPECT = OUT_W / OUT_H


def cover(im: Image.Image, focus_y: float = 0.5) -> Image.Image:
    """Crop to the output aspect, keeping the widest possible frame.

    `focus_y` is where the subject sits vertically, 0-1, so a tall photo is
    cropped around its subject rather than around its middle.
    """
    w, h = im.size
    if w / h > ASPECT:                      # too wide: trim the sides
        new_w = round(h * ASPECT)
        x = (w - new_w) // 2
        im = im.crop((x, 0, x + new_w, h))
    else:                                   # too tall: trim top and bottom
        new_h = round(w / ASPECT)
        y = round((h - new_h) * focus_y)
        y = max(0, min(y, h - new_h))
        im = im.crop((0, y, w, y + new_h))
    return im.resize((OUT_W, OUT_H), Image.LANCZOS)


def pad(im: Image.Image, margin: float = 0.06) -> Image.Image:
    """Fit the whole image into the frame on its own background colour.

    For the layout figure: it is a screenshot with labels running to every
    edge, so cropping it to 4:3 would cut the pin names off. The ground is
    taken from its own corner pixel, which makes the padding invisible.
    """
    im = im.convert("RGB")
    bg = im.getpixel((0, 0))
    canvas = Image.new("RGB", (OUT_W, OUT_H), bg)
    inner_w, inner_h = round(OUT_W * (1 - 2 * margin)), round(OUT_H * (1 - 2 * margin))
    fitted = im.copy()
    fitted.thumbnail((inner_w, inner_h), Image.LANCZOS)
    canvas.paste(fitted, ((OUT_W - fitted.width) // 2, (OUT_H - fitted.height) // 2))
    return canvas


JOBS = [
    # (source, output, how, pre-crop as fractions of the source or None)
    ("assets/focus-source/pcb-macro.jpg", "focus-layout", "cover:0.5", None),
    # The middle row keeps NAVROBOTEC's own board: it is the hardware the
    # benchmark in that row's link was run on, and nothing stock beats a
    # photograph of the thing itself with the company's name on it. The board
    # sits low in the frame — the photo has a lot of desk above it.
    ("public/data/report/img/real_pcb.jpeg", "focus-board", "cover:0.52", None),
    # In on the aircraft, below the wordmark. Taken whole this is the hero
    # again, letters and all, a screen and a half further down the same page.
    ("public/images/vayu-hero.webp", "focus-vayu", "cover:0.5", (0.16, 0.34, 0.84, 1.0)),
]


def main() -> int:
    written: dict[str, str] = {}
    for src, name, how, box in JOBS:
        if not os.path.exists(src):
            sys.exit(f"missing source: {src}")
        im = Image.open(src)
        if box:
            w, h = im.size
            l, t, r, b = box
            im = im.crop((round(l * w), round(t * h), round(r * w), round(b * h)))
        if how.startswith("cover"):
            out = cover(im.convert("RGB"), float(how.split(":")[1]))
        else:
            out = pad(im)
        tmp = os.path.join("public/images", f".{name}.tmp.webp")
        out.save(tmp, "WEBP", quality=88, method=6)
        digest = hashlib.sha1(open(tmp, "rb").read()).hexdigest()[:8]
        path = os.path.join("public/images", f"{name}.{digest}.webp")
        os.replace(tmp, path)
        written[name] = "/" + os.path.relpath(path, "public")
        print(f"{src:42} -> {path}  {im.size[0]}x{im.size[1]} -> "
              f"{out.size[0]}x{out.size[1]}  {os.path.getsize(path) // 1024}KB")

    for stale in glob.glob("public/images/focus-*.webp"):
        if "/" + os.path.relpath(stale, "public") not in written.values():
            os.remove(stale)
            print(f"removed stale {stale}")

    module = pathlib.Path("lib/focus-images.ts")
    module.write_text(
        "// Generated by scripts/make-focus-images.py — do not edit.\n"
        "// The hash is the file's own content, so new artwork always lands on\n"
        "// a new URL. Next serves optimised images `immutable`.\n"
        "export const FOCUS_IMAGES = {\n"
        + "".join(f'  "{k}": "{v}",\n' for k, v in written.items())
        + "} as const;\n"
    )
    print(f"wrote {module}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
