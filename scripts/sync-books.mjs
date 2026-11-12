#!/usr/bin/env node
/**
 * Copies the markdown books for NavLink, nav and Navigator out of their
 * repositories into content/docs-books/<part>/ and writes manifest.json.
 *
 * Read-only on the source repositories: it only runs `git ls-tree` and
 * `git show` against refs you have already fetched. Run `git fetch` in each
 * clone first. Clone locations can be overridden with
 * BOOKS_<PART>_REPO, for example BOOKS_NAV_REPO=/path/to/nav.
 *
 * A chapter that exists on none of the listed refs is recorded as coming.
 * Chapter titles are never made up: a coming chapter has a number and no title.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "content/docs-books");
const STACK = process.env.BOOKS_STACK ?? path.join(os.homedir(), "space/Drone/stack");

const BOOKS = [
  {
    part: "navlink",
    repo: "ragnar-vallhala/navlink",
    dir: process.env.BOOKS_NAVLINK_REPO ?? `${STACK}/navlink`,
    path: "docs/book",
    total: 10,
    refs: ["origin/docs/book-ch1-3", "origin/docs/book-ch4-6", "origin/docs/book-ch7-10"],
  },
  {
    part: "nav",
    repo: "ragnar-vallhala/nav",
    dir: process.env.BOOKS_NAV_REPO ?? `${STACK}/nav`,
    path: "docs/book",
    total: 10,
    refs: ["origin/main", "origin/docs/book-ch1-3", "origin/docs/book-ch4-6", "origin/docs/book-ch7-10"],
  },
  {
    part: "navigator",
    repo: "ragnar-vallhala/navigator",
    dir: process.env.BOOKS_NAVIGATOR_REPO ?? `${STACK}/navigator`,
    path: "navigator/docs/book",
    total: 11,
    refs: ["origin/main"],
  },
];

const git = (dir, ...args) =>
  execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", maxBuffer: 1 << 26 });

fs.rmSync(OUT, { recursive: true, force: true });
const manifest = {};

for (const b of BOOKS) {
  const found = new Map(); // chapter number -> { file, ref, sha, text }
  for (const ref of b.refs) {
    let names = "";
    try {
      names = git(b.dir, "ls-tree", "--name-only", ref, `${b.path}/`);
    } catch {
      continue; // ref not present in this clone
    }
    const sha = git(b.dir, "rev-parse", "--short", ref).trim();
    for (const full of names.split("\n").filter((n) => n.endsWith(".md"))) {
      const file = path.basename(full);
      const m = file.match(/^(\d+)-/);
      if (!m) continue;
      found.set(Number(m[1]), { file, ref: ref.replace(/^origin\//, ""), sha, text: git(b.dir, "show", `${ref}:${full}`) });
    }
  }
  fs.mkdirSync(path.join(OUT, b.part), { recursive: true });
  const chapters = [];
  for (let n = 1; n <= b.total; n++) {
    const c = found.get(n);
    if (!c) {
      chapters.push({ n, status: "coming" });
      continue;
    }
    fs.writeFileSync(path.join(OUT, b.part, c.file), c.text);
    chapters.push({ n, status: "ready", file: c.file, ref: c.ref, sha: c.sha });
  }
  manifest[b.part] = { part: b.part, repo: b.repo, total: b.total, chapters };
  console.log(b.part, chapters.filter((c) => c.status === "ready").length, "of", b.total);
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
