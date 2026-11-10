#!/usr/bin/env node
/* Pre-generate the sizes of every picture the site shows.

   Next's own optimiser makes a size the first time somebody asks for it. On a
   small server that first request takes a second or two, and in Next 16.2.3 a
   visitor who leaves while it is running can leave that URL hanging for
   everyone until the process restarts: the picture then never opens. Doing the
   work here, once, at build time removes both: the browser asks for a plain
   file that already exists, and nothing is computed while a visitor waits.

   Writes public/_v/<path>-<width>.webp for each source in public/images,
   public/media and public/blogs, plus lib/image-variants.json, which the
   loader (lib/imageLoader.ts) reads to pick the smallest variant at least as
   wide as the one the browser wants. Both outputs are build products and are
   not committed. Runs before `next dev` and `next build`. */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "_v");
const DIRS = ["images", "media", "blogs"];
const EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const WIDTHS = [256, 640, 1080, 1920];
const manifest = {};

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXT.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
let count = 0;
for (const d of DIRS) {
  for (const file of walk(path.join(PUBLIC, d))) {
    const rel = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
    let meta;
    try {
      meta = await sharp(file).metadata();
    } catch {
      continue;
    }
    if (!meta.width) continue;
    const widths = [...new Set([...WIDTHS.filter((w) => w < meta.width), meta.width])];
    const stem = rel.slice(0, rel.length - path.extname(rel).length);
    for (const w of widths) {
      const dest = path.join(OUT, `${stem}-${w}.webp`);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      await sharp(file)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(dest);
      count++;
    }
    manifest[rel] = widths;
  }
}
fs.writeFileSync(
  path.join(ROOT, "lib", "image-variants.json"),
  JSON.stringify(manifest, null, 1) + "\n",
);
console.log(`image variants: ${count} files for ${Object.keys(manifest).length} pictures`);
