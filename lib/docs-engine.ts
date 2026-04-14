import fs from "fs";
import path from "path";

const REPORT_PATH = "/home/ragnar/Documents/Drone/report/sections/";

const tikzCache: Record<string, string> = {};

export interface DocSection {
  title: string;
  slug: string;
  content: string;
  subsections: DocSection[];
}

function buildDocTree(filePath: string, baseSlug = ""): DocSection | null {
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, ".tex");

  // Extract title
  const titleMatch =
    content.match(/\\chapter\{([^}]+)\}/) ||
    content.match(/\\section\{([^}]+)\}/);
  const title = titleMatch ? titleMatch[1] : fileName.replace(/_/g, " ");

  // Extract slug
  const slug = (baseSlug ? `${baseSlug}/${fileName}` : fileName).toLowerCase();

  // Find children (\input commands)
  const children: DocSection[] = [];
  const inputs = [...content.matchAll(/\\input\{([^}]+)\}/g)];

  for (const match of inputs) {
    let inputPath = match[1];
    // Handle cases where inputPath is relative to the root or sections/
    let fullInputPath = path.resolve(path.dirname(filePath), inputPath);
    if (!fullInputPath.endsWith(".tex")) fullInputPath += ".tex";

    // Recovery logic for common report structure
    if (!fs.existsSync(fullInputPath)) {
      fullInputPath = path.resolve(
        "/home/ragnar/Documents/Drone/report/",
        inputPath,
      );
      if (!fullInputPath.endsWith(".tex")) fullInputPath += ".tex";
    }

    const child = buildDocTree(fullInputPath, slug);
    if (child) children.push(child);
  }

  // Get own content (text before first \input)
  const ownContent = content.split(/\\input\{/)[0];

  return {
    title,
    slug,
    content: parseLatex(ownContent, path.dirname(filePath)),
    subsections: children,
  };
}

export function getDocStructure(): DocSection[] {
  const rootFiles = [
    "introduction.tex",
    "architecture.tex",
    "hardware.tex",
    "navhal.tex",
    "vaios.tex",
    "vayu.tex",
    "results.tex",
  ];

  const structure: DocSection[] = [];
  for (const file of rootFiles) {
    const fullPath = path.join(REPORT_PATH, file);
    const section = buildDocTree(fullPath);
    if (section) structure.push(section);
  }

  return structure;
}

// Flat lookup for the router
export function getFlattenedDocs(): DocSection[] {
  const tree = getDocStructure();
  const flattened: DocSection[] = [];

  function flatten(sections: DocSection[]) {
    for (const s of sections) {
      flattened.push(s);
      if (s.subsections.length > 0) flatten(s.subsections);
    }
  }
  flatten(tree);
  return flattened;
}

export function parseLatex(tex: string, baseDir: string): string {
  let content = tex;

  // Resolve \input{path}
  content = content.replace(/\\input\{([^}]+)\}/g, (match, inputPath) => {
    let fullPath = path.resolve(baseDir, inputPath);
    if (!fullPath.endsWith(".tex")) fullPath += ".tex";

    if (fs.existsSync(fullPath)) {
      return parseLatex(
        fs.readFileSync(fullPath, "utf-8"),
        path.dirname(fullPath),
      );
    }
    return `<!-- Missing input: ${inputPath} -->`;
  });

  // Remove LaTeX comments
  content = content.replace(/(?<!\\)%.*/g, "");

  return content;
}

export function convertToHtml(tex: string): string {
  let html = tex;

  // Strip chapter/section tags used for titles
  html = html.replace(/\\chapter\{[^}]+\}/g, "");
  html = html.replace(/\\section\{([^}]+)\}/g, "<h2>$1</h2>");
  html = html.replace(/\\subsection\{([^}]+)\}/g, "<h3>$1</h3>");
  html = html.replace(/\\subsubsection\{([^}]+)\}/g, "<h4>$1</h4>");

  // Formatting
  html = html.replace(/\\textit\{([^}]+)\}/g, "<em>$1</em>");
  html = html.replace(/\\textbf\{([^}]+)\}/g, "<strong>$1</strong>");
  html = html.replace(/\\texttt\{([^}]+)\}/g, "<code>$1</code>");

  // Lists
  html = html.replace(/\\begin\{itemize\}/g, "<ul>");
  html = html.replace(/\\end\{itemize\}/g, "</ul>");
  html = html.replace(/\\begin\{enumerate\}/g, "<ol>");
  html = html.replace(/\\end\{enumerate\}/g, "</ol>");
  html = html.replace(/\\item\s+([^\\<\n]+)/g, "<li>$1</li>");

  // TikZ placeholders
  html = html.replace(
    /\\begin\{tikzpicture\}([\s\S]*?)\\end\{tikzpicture\}/g,
    (match, tikzCode) => {
      const hash = Buffer.from(tikzCode)
        .toString("base64")
        .substring(0, 16)
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
      tikzCache[hash] = tikzCode;
      return `<div class="tikz-container" data-hash="${hash}"><!-- TIKZ_BLOCK_${hash} --></div>`;
    },
  );

  // Math (Simplified, assumes MathJax or similar handles it on client)
  html = html.replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>');
  html = html.replace(
    /\\\[([\s\S]*?)\\\]/g,
    '<div class="math-block">$1</div>',
  );

  // Remove labels and remaining commands
  html = html.replace(/\\label\{[^}]+\}/g, "");
  html = html.replace(/\\ref\{[^}]+\}/g, "[Ref]");

  return html;
}

export function getTikzCode(hash: string): string | null {
  // If not in memory, we might need a full rescan.
  // For simplicity during dev, ensure getDocStructure() is called at least once.
  if (Object.keys(tikzCache).length === 0) {
    getDocStructure();
  }
  return tikzCache[hash] || null;
}
