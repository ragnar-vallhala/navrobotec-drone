import { NextRequest, NextResponse } from "next/server";
import { getTikzCode } from "@/lib/docs-engine";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const TMP_DIR = "/tmp/navrobotec-docs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> },
) {
  const hash = (await params).hash;
  const tikzCode = getTikzCode(hash);

  if (!tikzCode) {
    return new NextResponse("TikZ code not found", { status: 404 });
  }

  const cacheDir = path.join(process.cwd(), "public/docs/diagrams");
  const cachePath = path.join(cacheDir, `${hash}.svg`);

  // Return cached version if exists
  if (fs.existsSync(cachePath)) {
    const svg = fs.readFileSync(cachePath, "utf-8");
    return new NextResponse(svg, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  // Compile TikZ
  try {
    if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

    const workDir = path.join(TMP_DIR, hash);
    if (!fs.existsSync(workDir)) fs.mkdirSync(workDir);

    const texContent = `
\\documentclass[tikz,border=10pt]{standalone}
\\usepackage{tikz}
\\usetikzlibrary{shapes,arrows,arrows.meta,positioning,calc,fit,chains,scopes}
\\begin{document}
\\begin{tikzpicture}${tikzCode}\\end{tikzpicture}
\\end{document}
`;

    fs.writeFileSync(path.join(workDir, "diag.tex"), texContent);

    // pdflatex -> dvi -> dvisvgm
    // Using -output-format=dvi for faster SVG conversion
    execSync(`pdflatex -output-format=dvi diag.tex`, { cwd: workDir });
    execSync(`dvisvgm --no-fonts diag.dvi -o diag.svg`, { cwd: workDir });

    const svg = fs.readFileSync(path.join(workDir, "diag.svg"), "utf-8");

    // Save to public cache for future requests
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(cachePath, svg);

    return new NextResponse(svg, {
      headers: { "Content-Type": "image/svg+xml" },
    });
  } catch (error: any) {
    console.error("TikZ Compilation Error:", error.message);
    return new NextResponse(
      `<svg><text x="10" y="20" fill="red">Compilation Failed: ${error.message}</text></svg>`,
      {
        headers: { "Content-Type": "image/svg+xml" },
        status: 500,
      },
    );
  }
}
