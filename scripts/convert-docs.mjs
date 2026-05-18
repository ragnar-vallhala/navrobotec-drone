#!/usr/bin/env node
/**
 * convert-docs.mjs — LaTeX report → HTML docs converter.
 *
 * Reads the LaTeX source under public/data/report/, compiles every TikZ
 * picture to a standalone SVG, runs pandoc per chapter to produce HTML
 * fragments in content/docs/, and writes an index.json that the /docs route
 * consumes.
 *
 * Safe to run anywhere. If pandoc / latex / dvisvgm are unavailable (e.g. a
 * Vercel build container), it logs a notice and exits 0 so the committed
 * content/docs output is used as-is. It also no-ops when the LaTeX source is
 * unchanged since the last run, unless invoked with --force.
 *
 * The intended workflow: edit LaTeX only. `npm run dev`/`build` regenerates
 * locally via the predev/prebuild hook; the docs GitHub Action regenerates and
 * commits on push.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public/data/report");
const MAIN = path.join(SRC, "main.tex");
const TMP = path.join(ROOT, ".docs-build");
const OUT_HTML = path.join(ROOT, "content/docs");
const OUT_DIAGRAMS = path.join(ROOT, "public/docs/diagrams");
const OUT_MEDIA = path.join(ROOT, "public/docs/media");
const FORCE = process.argv.includes("--force");

// TikZ libraries used by the report (from main.tex preamble), plus a few
// common ones so standalone compilation of each picture doesn't fail.
const TIKZ_LIBS =
  "positioning,arrows.meta,3d,calc,decorations.pathreplacing,shapes,fit,chains,scopes,backgrounds,patterns";

const log = (msg) => console.log(`[docs] ${msg}`);

/** True if `cmd --version` runs without spawn error. */
function have(cmd) {
  return !spawnSync(cmd, ["--version"], { stdio: "ignore" }).error;
}

/** Recursively collect every .tex file under `dir`. */
function walkTex(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkTex(p, acc);
    else if (e.name.endsWith(".tex")) acc.push(p);
  }
  return acc;
}

/** Hash of all LaTeX + images + this script — used to skip unchanged runs. */
function hashSource() {
  const h = crypto.createHash("sha256");
  for (const f of walkTex(SRC).sort()) {
    h.update(f.slice(SRC.length));
    h.update(fs.readFileSync(f));
  }
  const imgDir = path.join(SRC, "img");
  if (fs.existsSync(imgDir)) {
    for (const f of fs.readdirSync(imgDir).sort()) {
      h.update(f);
      h.update(fs.readFileSync(path.join(imgDir, f)));
    }
  }
  h.update(fs.readFileSync(new URL(import.meta.url)));
  return h.digest("hex");
}

/** \definecolor lines from main.tex — TikZ pictures reference these colors. */
function colorDefs() {
  const main = fs.readFileSync(MAIN, "utf8");
  return [...main.matchAll(/\\definecolor\{[^}]*\}\{[^}]*\}\{[^}]*\}/g)]
    .map((m) => m[0])
    .join("\n");
}

/** Compile one TikZ picture body to an SVG. Returns true on success. */
function compileTikz(inner, outSvg, colors) {
  const work = fs.mkdtempSync(path.join(TMP, "tikz-"));
  const tex = `\\documentclass[border=8pt]{standalone}
\\usepackage{tikz}
\\usepackage{amsmath}
\\usepackage{xcolor}
\\usepackage{pgfplots}
\\pgfplotsset{compat=1.18}
\\usetikzlibrary{${TIKZ_LIBS}}
${colors}
\\begin{document}
\\begin{tikzpicture}${inner}\\end{tikzpicture}
\\end{document}
`;
  fs.writeFileSync(path.join(work, "d.tex"), tex);
  const latex = spawnSync(
    "latex",
    ["-interaction=nonstopmode", "-halt-on-error", "d.tex"],
    { cwd: work, stdio: "ignore" },
  );
  if (latex.status !== 0 || !fs.existsSync(path.join(work, "d.dvi"))) {
    return false;
  }
  const svg = spawnSync(
    "dvisvgm",
    ["--no-fonts", "--exact", `--output=${outSvg}`, "d.dvi"],
    { cwd: work, stdio: "ignore" },
  );
  return svg.status === 0 && fs.existsSync(outSvg);
}

function convert() {
  const canTikz = have("latex") && have("dvisvgm");
  if (!canTikz) log("latex/dvisvgm missing — TikZ diagrams will be omitted");

  // Fresh output dirs.
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.cpSync(SRC, path.join(TMP, "report"), { recursive: true });
  for (const d of [OUT_HTML, OUT_DIAGRAMS, OUT_MEDIA]) {
    fs.rmSync(d, { recursive: true, force: true });
    fs.mkdirSync(d, { recursive: true });
  }
  const REPORT = path.join(TMP, "report");

  // 1. Compile every TikZ picture to SVG and patch the temp .tex tree so each
  //    picture becomes an \includegraphics pandoc can handle.
  const colors = colorDefs();
  let diagrams = 0;
  let diagramFails = 0;
  for (const file of walkTex(REPORT)) {
    let src = fs.readFileSync(file, "utf8");
    if (!src.includes("\\begin{tikzpicture}")) continue;
    src = src.replace(
      /\\begin\{tikzpicture\}([\s\S]*?)\\end\{tikzpicture\}/g,
      (_match, inner) => {
        if (!canTikz) return "\\textit{[Diagram]}";
        const hash = crypto
          .createHash("sha1")
          .update(inner)
          .digest("hex")
          .slice(0, 12);
        const name = `tikz-${hash}.svg`;
        const outSvg = path.join(OUT_DIAGRAMS, name);
        if (!fs.existsSync(outSvg) && !compileTikz(inner, outSvg, colors)) {
          diagramFails++;
          log(`! failed to compile a TikZ picture in ${path.basename(file)}`);
          return "\\textit{[Diagram unavailable]}";
        }
        diagrams++;
        return `\\includegraphics{__DIAG__${name}}`;
      },
    );
    fs.writeFileSync(file, src);
  }

  // 2. Chapter order comes from the \input list in main.tex.
  const mainSrc = fs.readFileSync(MAIN, "utf8");
  const chapters = [
    ...mainSrc.matchAll(/\\input\{sections\/([A-Za-z0-9_-]+)\}/g),
  ].map((m) => m[1]);
  if (chapters.length === 0) throw new Error("no \\input chapters in main.tex");

  // Map every \label{chap:*} to its chapter. Index 0 (abstract) is \chapter*
  // (unnumbered); introduction at index 1 is Chapter 1, so the chapter number
  // equals the array index.
  const chapLabels = {};
  chapters.forEach((slug, i) => {
    const f = path.join(REPORT, "sections", `${slug}.tex`);
    if (!fs.existsSync(f)) return;
    for (const m of fs
      .readFileSync(f, "utf8")
      .matchAll(/\\label\{(chap:[^}]+)\}/g)) {
      chapLabels[m[1]] = { slug, num: i };
    }
  });

  // 3. Convert each chapter to HTML, then split it at <h2> boundaries into an
  //    intro (content before the first \section) plus one entry per \section.
  const docs = [];
  chapters.forEach((slug, i) => {
    const chFile = path.join(REPORT, "sections", `${slug}.tex`);
    if (!fs.existsSync(chFile)) {
      log(`! skipping missing chapter: ${slug}`);
      return;
    }
    const r = spawnSync(
      "pandoc",
      [
        path.join("sections", `${slug}.tex`),
        "--from=latex",
        "--to=html5",
        "--mathml",
        "--wrap=none",
        `--resource-path=${REPORT}`,
      ],
      { cwd: REPORT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    if (r.status !== 0) {
      throw new Error(`pandoc failed for ${slug}:\n${r.stderr || r.error}`);
    }

    const titleMatch = fs
      .readFileSync(chFile, "utf8")
      .match(/\\chapter\*?\{([^}]+)\}/);
    const title = titleMatch ? titleMatch[1].trim() : slug;

    const html = r.stdout
      // Drop the leading <h1> — the route renders the chapter title itself.
      .replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>/, "")
      // Point compiled-diagram and figure images at their public paths.
      .replace(/src="__DIAG__/g, 'src="/docs/diagrams/')
      .replace(/src="(?:\.\/)?img\//g, 'src="/docs/media/');

    // Split before every <h2>: parts[0] is the intro, each rest is a section.
    let intro = "";
    const sections = [];
    const usedSlugs = new Set();
    for (const part of html.split(/(?=<h2\b)/)) {
      const m = part.match(/^<h2\b([^>]*)>([\s\S]*?)<\/h2>([\s\S]*)$/);
      if (!m) {
        intro += part;
        continue;
      }
      const id = (m[1].match(/id="([^"]+)"/) || [])[1] || null;
      const secTitle = m[2].replace(/<[^>]+>/g, "").trim();
      const base =
        (id ? id.replace(/^sec:/, "") : secTitle)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "section";
      let secSlug = base;
      for (let n = 2; usedSlugs.has(secSlug); n++) secSlug = `${base}-${n}`;
      usedSlugs.add(secSlug);
      sections.push({ id, slug: secSlug, title: secTitle, html: m[3].trim() });
    }

    docs.push({
      slug,
      title,
      order: i + 1,
      num: i,
      intro: intro.trim(),
      sections,
    });
  });

  // 4. Build an id -> page-location map so \ref links resolve across pages.
  //    head:true marks a section's own <h2> id (links to the page, no anchor).
  const idLoc = {};
  for (const ch of docs) {
    for (const m of ch.intro.matchAll(/\bid="([^"]+)"/g)) {
      idLoc[m[1]] ??= { chap: ch.slug, section: null, head: false };
    }
    for (const sec of ch.sections) {
      if (sec.id) {
        idLoc[sec.id] = { chap: ch.slug, section: sec.slug, head: true };
      }
      for (const m of sec.html.matchAll(/\bid="([^"]+)"/g)) {
        idLoc[m[1]] ??= { chap: ch.slug, section: sec.slug, head: false };
      }
    }
  }

  // Rewrite pandoc \ref anchors to absolute /docs URLs, fixing pandoc's
  // chapter-local "1." numbering prefix to the real chapter number.
  const rewriteRefs = (html, chapterNum) =>
    html.replace(
      /<a href="#([^"]+)"[^>]*data-reference="[^"]*"[^>]*>([^<]*)<\/a>/g,
      (_m, id, text) => {
        const label = text.replace(/^1\./, `${chapterNum}.`);
        if (chapLabels[id]) {
          return `<a href="/docs/${chapLabels[id].slug}">${chapLabels[id].num}</a>`;
        }
        const loc = idLoc[id];
        if (!loc) return `<a href="#${id}">${label}</a>`;
        let href = `/docs/${loc.chap}`;
        if (loc.section) href += `/${loc.section}`;
        if (!loc.head) href += `#${id}`;
        return `<a href="${href}">${label}</a>`;
      },
    );

  // 5. Write the split HTML files and assemble the index tree.
  const index = [];
  for (const ch of docs) {
    const dir = `${String(ch.order).padStart(2, "0")}-${ch.slug}`;
    fs.mkdirSync(path.join(OUT_HTML, dir), { recursive: true });
    const introFile = `${dir}/_intro.html`;
    fs.writeFileSync(
      path.join(OUT_HTML, introFile),
      `${rewriteRefs(ch.intro, ch.num)}\n`,
    );
    const sections = ch.sections.map((sec) => {
      const file = `${dir}/${sec.slug}.html`;
      fs.writeFileSync(
        path.join(OUT_HTML, file),
        `${rewriteRefs(sec.html, ch.num)}\n`,
      );
      return { slug: sec.slug, title: sec.title, file };
    });
    index.push({
      slug: ch.slug,
      title: ch.title,
      order: ch.order,
      intro: introFile,
      sections,
    });
  }

  // 6. Copy figure images referenced via \includegraphics.
  const imgDir = path.join(SRC, "img");
  if (fs.existsSync(imgDir)) {
    for (const f of fs.readdirSync(imgDir)) {
      fs.copyFileSync(path.join(imgDir, f), path.join(OUT_MEDIA, f));
    }
  }

  // 7. Index + manifest.
  fs.writeFileSync(
    path.join(OUT_HTML, "index.json"),
    `${JSON.stringify(index, null, 2)}\n`,
  );
  fs.rmSync(TMP, { recursive: true, force: true });
  const sectionCount = index.reduce((n, c) => n + c.sections.length, 0);
  log(
    `done — ${index.length} chapters, ${sectionCount} sections, ` +
      `${diagrams} diagrams` +
      (diagramFails ? `, ${diagramFails} diagram(s) failed` : ""),
  );
  return index.length;
}

function main() {
  if (!fs.existsSync(MAIN)) {
    log(`no report found at ${path.relative(ROOT, SRC)} — nothing to do`);
    return;
  }
  if (!have("pandoc")) {
    log("pandoc not installed — keeping committed content/docs as-is");
    return;
  }

  const manifestPath = path.join(OUT_HTML, ".manifest");
  const indexPath = path.join(OUT_HTML, "index.json");
  const srcHash = hashSource();
  const upToDate =
    !FORCE &&
    fs.existsSync(manifestPath) &&
    fs.existsSync(indexPath) &&
    fs.readFileSync(manifestPath, "utf8").trim() === srcHash;
  if (upToDate) {
    log("LaTeX source unchanged — docs up to date");
    return;
  }

  log("converting LaTeX report → HTML…");
  try {
    convert();
    fs.writeFileSync(manifestPath, `${srcHash}\n`);
  } catch (err) {
    fs.rmSync(TMP, { recursive: true, force: true });
    log(`conversion failed: ${err.message}`);
    // Don't break the build if a previous good output is already committed.
    if (!fs.existsSync(indexPath)) process.exitCode = 1;
  }
}

main();
