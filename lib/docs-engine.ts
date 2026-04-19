import fs from "fs";
import path from "path";

const REPORT_PATH = "/home/ragnar/Documents/Drone/report/sections/";

const tikzCache: Record<string, string> = {};
const labelRegistry: Record<string, { slug: string; title: string }> = {};

export interface DocSection {
  title: string;
  slug: string;
  content: string;
  subsections: DocSection[];
}

export interface TikzNode {
  id: string;
  label: string;
  style: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  anchorNode?: string;
  anchorPoint?: string;
  xshift?: number;
  yshift?: number;
  layoutParent?: string;
  color?: string;
  fill?: string;
  labelAnchor?: string;
  labelXShift?: number;
  labelYShift?: number;
}

export interface TikzDraw {
  from: string;
  fromAnchor?: string;
  fromShift?: string;
  to: string;
  toAnchor?: string;
  toShift?: string;
  perpNode?: string;
  perpAnchor?: string;
  isPerpendicular?: boolean;
  isPerpendicularH?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  fromPerpNode?: string;
  fromPerpAnchor?: string;
  fromPerpType?: string;
  toPerpNode?: string;
  toPerpAnchor?: string;
  toPerpType?: string;
  style: string;
  label?: string;
}

export interface TikzDiagram {
  nodes: TikzNode[];
  draws: TikzDraw[];
  raw?: string;
  debug?: any;
  globalOptions?: {
    nodeDistanceX?: number;
    nodeDistanceY?: number;
    styles?: Record<string, string>;
  };
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
    let fullInputPath = path.resolve(
      /* turbopackIgnore: true */ path.dirname(filePath),
      inputPath,
    );
    if (!fullInputPath.endsWith(".tex")) fullInputPath += ".tex";

    // Recovery logic for common report structure
    if (!fs.existsSync(fullInputPath)) {
      fullInputPath = path.resolve(
        /* turbopackIgnore: true */ "/home/ragnar/Documents/Drone/report/",
        inputPath,
      );
      if (!fullInputPath.endsWith(".tex")) fullInputPath += ".tex";
    }

    const child = buildDocTree(fullInputPath, slug);
    if (child) children.push(child);
  }

  // Find labels to register
  const labels = [...content.matchAll(/\\label\{([^}]+)\}/g)];
  for (const match of labels) {
    labelRegistry[match[1]] = { slug, title };
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
    "preliminary.tex",
    "architecture.tex",
    "hardware.tex",
    "navhal.tex",
    "vaios.tex",
    "vayu.tex",
    "results.tex",
  ];

  const structure: DocSection[] = [];

  // Clear caches to ensure fresh data
  for (const key in tikzCache) delete tikzCache[key];
  for (const key in labelRegistry) delete labelRegistry[key];

  for (const file of rootFiles) {
    const fullPath = path.join(/* turbopackIgnore: true */ REPORT_PATH, file);
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
    let fullPath = path.resolve(/* turbopackIgnore: true */ baseDir, inputPath);
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

  // 1. Process TikZ blocks FIRST before typography interference
  html = html.replace(
    /\\begin\{tikzpicture\}\s*(\[[\s\S]*?\])?\s*([\s\S]*?)\\end\{tikzpicture\}/g,
    (match, options, tikzCode) => {
      const fullCode = (options || "") + (tikzCode || "");
      const diagram = parseTikz(fullCode);

      if (options) {
        const distMatch = options.match(
          /node distance=([\d.-]+)cm(?:\s*and\s*([\d.-]+)cm)?/,
        );
        const styles: Record<string, string> = {};
        const styleRegex =
          /([\w_]+)\/\.style\s*=\s*\{([\s\S]*?)\}(?=\s*[,\]])/g;
        let sm;
        while ((sm = styleRegex.exec(options)) !== null) {
          styles[sm[1]] = sm[2];
        }

        diagram.globalOptions = {
          nodeDistanceY: distMatch ? parseFloat(distMatch[1]) : undefined,
          nodeDistanceX: distMatch
            ? distMatch[2]
              ? parseFloat(distMatch[2])
              : parseFloat(distMatch[1])
            : undefined,
          styles,
        };

        const globalNodeStyle = styles["node"] || "";
        diagram.nodes = diagram.nodes.map((node) => {
          let mergedStyle = globalNodeStyle
            ? `${globalNodeStyle}, ${node.style}`
            : node.style;
          const baseStyle = Object.keys(styles).find(
            (s) => s !== "node" && node.style.includes(s),
          );
          if (baseStyle) {
            mergedStyle = `${styles[baseStyle]}, ${mergedStyle}`;
          }
          node.style = mergedStyle;

          const fillMatch = mergedStyle.match(/fill=([\w!%]+)/);
          if (fillMatch) node.fill = fillMatch[1];
          const colMatch = mergedStyle.match(/color=([\w!%]+)/);
          if (colMatch) node.color = colMatch[1];

          // Specialized fills
          if (node.id === "cpu") node.fill = "secondary!15";
          if (node.id === "main_bus") node.fill = "white";

          const wMatch = mergedStyle.match(/minimum width=([-.\d]+)cm/);
          if (wMatch) node.width = parseFloat(wMatch[1]);
          const hMatch = mergedStyle.match(/minimum height=([-.\d]+)cm/);
          if (hMatch) node.height = parseFloat(hMatch[1]);

          if (node.id === "soc") {
            if (!node.width || node.width < 5) {
              node.width = 11.5;
              node.height = 6.0;
            }
            // Defaults for soc label if style parsing doesn't provide them
            node.labelAnchor = "above";
            node.labelYShift = -0.5;
          }

          // Parse label options from mergedStyle
          // Example: label={[shift={(0,-0.6)}]above:\textbf{Microcontroller Unit}}
          const labelRegex =
            /label\s*=\s*\{?(\[[^\]]*\])?\s*(\w+)?\s*:\s*([^,\]}]+)\}?/g;
          let lm;
          while ((lm = labelRegex.exec(mergedStyle)) !== null) {
            const options = lm[1] || "";
            if (lm[2]) node.labelAnchor = lm[2];
            // Clean up TikZ formatting like \textbf and braces
            node.label = lm[3]
              .replace(/\\textbf/g, "")
              .replace(/[{}]/g, "")
              .trim();

            if (options) {
              // Capture shift=(x,y). Handle optional 'cm' unit.
              const sMatch = options.match(
                /shift\s*=\s*\{?\(\s*([-.\d]+)(?:cm)?\s*,\s*([-.\d]+)(?:cm)?\s*\)\}?/,
              );
              if (sMatch) {
                node.labelXShift = parseFloat(sMatch[1]);
                node.labelYShift = parseFloat(sMatch[2]);
              }
            }
          }

          return node;
        });

        diagram.draws = diagram.draws.map((draw) => {
          const baseStyle = Object.keys(styles).find(
            (s) => s !== "node" && draw.style.includes(s),
          );
          if (baseStyle) {
            draw.style = `${styles[baseStyle]}, ${draw.style}`;
          }
          return draw;
        });
      }

      const json = JSON.stringify(diagram);
      return `<div class="tikz-parsed-container" data-diagram='${json.replace(
        /'/g,
        "&apos;",
      )}'></div>`;
    },
  );

  // 2. Strip chapter/section tags used for titles
  html = html.replace(/\\chapter\{[^}]+\}/g, "");
  html = html.replace(/\\section\{([^}]+)\}/g, "<h2>$1</h2>");
  html = html.replace(/\\subsection\{([^}]+)\}/g, "<h3>$1</h3>");
  html = html.replace(/\\subsubsection\{([^}]+)\}/g, "<h4>$1</h4>");

  // 3. Formatting
  html = html.replace(/\\textit\{([^}]+)\}/g, "<em>$1</em>");
  html = html.replace(/\\textbf\{([^}]+)\}/g, "<strong>$1</strong>");
  html = html.replace(/\\texttt\{([^}]+)\}/g, "<code>$1</code>");

  // 4. Lists
  html = html.replace(/\\begin\{itemize\}/g, "<ul>");
  html = html.replace(/\\end\{itemize\}/g, "</ul>");
  html = html.replace(/\\begin\{enumerate\}/g, "<ol>");
  html = html.replace(/\\end\{enumerate\}/g, "</ol>");
  html = html.replace(/\\item\s+([^\\<\n]+)/g, "<li>$1</li>");

  // 5. Typography (Must be after TikZ is gone!)
  html = html.replace(/---/g, "&mdash;");
  html = html.replace(/--/g, "&ndash;");

  // 6. Math
  html = html.replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>');
  html = html.replace(
    /\\\[([\s\S]*?)\\\]/g,
    '<div class="math-block">$1</div>',
  );

  // 7. Labels and Refs
  html = html.replace(/\\label\{([^}]+)\}/g, '<span id="$1"></span>');
  html = html.replace(/\\ref\{([^}]+)\}/g, (match, key) => {
    const target = labelRegistry[key];
    if (target) {
      const link =
        target.slug === "introduction" ? "/docs" : `/docs/${target.slug}`;
      return `<a href="${link}#${key}" class="latex-ref">${target.title}</a>`;
    }
    return `<span class="broken-ref">[Ref: ${key}]</span>`;
  });

  // 8. Figures & Captions
  html = html.replace(
    /\\begin\{figure\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{figure\}/g,
    '<figure class="latex-figure">$1</figure>',
  );
  html = html.replace(/\\caption\{([^}]+)\}/g, "<figcaption>$1</figcaption>");
  html = html.replace(/\\centering/g, "");
  html = html.replace(/\\hspace\*?\{[^}]+\}/g, "");
  html = html.replace(/\\vspace\*?\{[^}]+\}/g, "");

  return html;
}

export function parseTikz(tex: string): TikzDiagram {
  const nodes: TikzNode[] = [];
  const draws: TikzDraw[] = [];

  // Strip comments and normalize whitespace
  let workingTex = tex.replace(/(?<!\\)%.*/g, "");

  // Strip leading options block [ ... ] by finding the first TikZ command
  const firstCmdMatch = workingTex.match(/\\(?:node|draw|path)/);
  if (firstCmdMatch && firstCmdMatch.index && firstCmdMatch.index > 0) {
    workingTex = workingTex.substring(firstCmdMatch.index);
  }

  // Decompose by semicolon while respecting nested braces/brackets
  const commands: string[] = [];
  let currentCmd = "";
  let braceLevel = 0;
  let bracketLevel = 0;

  for (let i = 0; i < workingTex.length; i++) {
    const char = workingTex[i];
    if (char === "{" && workingTex[i - 1] !== "\\") braceLevel++;
    if (char === "}" && workingTex[i - 1] !== "\\") braceLevel--;
    if (char === "[" && workingTex[i - 1] !== "\\") bracketLevel++;
    if (char === "]" && workingTex[i - 1] !== "\\") bracketLevel--;

    if (char === ";" && braceLevel === 0 && bracketLevel === 0) {
      commands.push(currentCmd.trim());
      currentCmd = "";
    } else {
      currentCmd += char;
    }
  }
  if (currentCmd.trim()) commands.push(currentCmd.trim());

  commands.forEach((cmd) => {
    // 1. Process Nodes
    const nodeMatch = cmd.match(
      /^\\node\s*(?:\[([^\]]*)\])?\s*(?:\(([^)]+)\))?\s*(?:at\s*(?:([^;{]+)))?\s*\{([\s\S]*)\}/,
    );
    if (nodeMatch) {
      const style = nodeMatch[1] || "";
      const id = (nodeMatch[2] || `anon_${nodes.length}`).trim();
      const at = (nodeMatch[3] || "").trim();
      let label = (nodeMatch[4] || "")
        .replace(/\\\\/g, "\n")
        .replace(/[{}]/g, "")
        .trim();

      if (!label) {
        const styleLabelMatch = style.match(/label=\{([^}]*)\}/);
        if (styleLabelMatch) {
          const inner = styleLabelMatch[1];
          const textMatch = inner.match(
            /(?:above|below|left|right)\s*:\s*(.*)/,
          );
          if (textMatch && textMatch[1]) {
            label = textMatch[1]
              .replace(/\\textbf/g, "")
              .replace(/[{}]/g, "")
              .trim();
          } else {
            label = inner.trim();
          }
        }
      }

      let x = 0,
        y = 0,
        anchorNode = undefined,
        anchorPoint = undefined;
      let xshift = 0,
        yshift = 0,
        layoutParent = undefined;
      let width = 1.8,
        height = 0.8;

      const wMatch = style.match(/minimum width=([-.\d]+)cm/);
      if (wMatch) width = parseFloat(wMatch[1]);
      const hMatch = style.match(/minimum height=([-.\d]+)cm/);
      if (hMatch) height = parseFloat(hMatch[1]);
      const lpMatch = style.match(
        /(?:above|below|left|right)(?:\s*(?:left|right))?(?:\s*=\s*(?:([\d.-]+)cm)?(?:\s*and\s*([\d.-]+)cm)?\s*of\s*([^,\] ]+))/,
      );
      if (lpMatch && lpMatch[3]) layoutParent = lpMatch[3].trim();

      if (at) {
        const coordsMatch = at.match(
          /(?:\[([^\]]*)\])?\((?:\[([^\]]*)\])?([^)]+)\)/,
        );
        const atTarget = coordsMatch ? coordsMatch[3] : at;
        const atOptions =
          (coordsMatch ? coordsMatch[1] : "") ||
          (coordsMatch ? coordsMatch[2] : "");

        if (atTarget.includes("node ")) {
          const m = atTarget.match(/node\s*([^)]+)/);
          if (m) anchorNode = m[1].trim();
        } else if (atTarget.includes(".")) {
          const [node, pt] = atTarget.split(".");
          anchorNode = node.trim();
          anchorPoint = pt.trim();
        } else if (atTarget.includes(",")) {
          const coords = atTarget
            .split(",")
            .map((v: string) => parseFloat(v.replace(/[()]/g, "").trim()));
        }

        if (atOptions) {
          const ys = atOptions.match(/yshift=([-.\d]+)cm/);
          if (ys) yshift = parseFloat(ys[1]);
          const xs = atOptions.match(/xshift=([-.\d]+)cm/);
          if (xs) xshift = parseFloat(xs[1]);
        }
      }

      nodes.push({
        id,
        style,
        x,
        y,
        anchorNode,
        anchorPoint,
        label,
        xshift,
        yshift,
        layoutParent,
        width,
        height,
      });
      return;
    }

    // 2. Process Draws
    if (cmd.startsWith("\\draw") || cmd.startsWith("\\path")) {
      const styleMatch = cmd.match(
        /^\\(?:draw|path)\s*(?:\[([\s\S]*?)\])?\s*([\s\S]*)$/,
      );
      if (!styleMatch) return;

      const style = styleMatch[1] || "";
      const body = styleMatch[2] || "";

      // Balanced path splitter: only split operators NOT inside parentheses
      const parts: string[] = [];
      let currentPart = "";
      let pLevel = 0;

      for (let i = 0; i < body.length; i++) {
        const char = body[i];
        if (char === "(") pLevel++;
        if (char === ")") pLevel--;

        const next2 = body.substring(i, i + 2);
        if (
          pLevel === 0 &&
          (next2 === "--" || next2 === "|-" || next2 === "-|")
        ) {
          if (currentPart.trim()) parts.push(currentPart.trim());
          parts.push(next2);
          currentPart = "";
          i++; // Skip the second char of operator
        } else {
          currentPart += char;
        }
      }
      if (currentPart.trim()) parts.push(currentPart.trim());

      const parseCoord = (s: string): any => {
        const shiftMatch = s.match(/\[([^\]]+)\]\s*(.*)/);
        let clean = (shiftMatch ? shiftMatch[2] : s).trim();
        if (clean.startsWith("(")) clean = clean.substring(1);
        if (clean.endsWith(")")) clean = clean.substring(0, clean.length - 1);
        clean = clean.trim();
        const shift = shiftMatch ? shiftMatch[1] : null;

        if (clean.includes("|-") || clean.includes("-|")) {
          const op = clean.includes("|-") ? "|-" : "-|";
          const cp = clean.split(op).map((x) => x.trim());
          const p1 = parseCoord(cp[0]);
          const p2 = parseCoord(cp[1]);
          return {
            node: p1.node,
            anchor: p1.anchor,
            perpNode: p2.node,
            perpAnchor: p2.anchor,
            perpType: op,
            shift,
          };
        }

        if (clean.includes(".")) {
          const p = clean.split(".");
          return { node: p[0].trim(), anchor: p[1].trim(), shift };
        }
        return { node: clean.trim(), anchor: undefined, shift };
      };

      let lastPoint: any = null;
      let accX = 0;
      let accY = 0;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (["--", "|-", "-|"].includes(part)) continue;

        const coordMatch = part.match(/\(([^)]+)\)/);
        if (!coordMatch) continue;

        const isRelative = part.startsWith("++");
        const rawCoord = coordMatch[1];
        let current = parseCoord(rawCoord);

        if (isRelative && lastPoint) {
          const [dx, dy] = rawCoord
            .replace(/[cm\s()]/g, "")
            .split(",")
            .map((v: string) => parseFloat(v) || 0);
          accX += dx;
          accY += dy;
          current = {
            node: lastPoint.node,
            anchor: lastPoint.anchor,
            shift: `shift={(${accX}cm,${accY}cm)}`,
            accX,
            accY,
          };
        } else {
          // If not relative, reset accumulation to any shift on the node itself
          accX = 0;
          accY = 0;
          if (current.shift) {
            const sm = current.shift.match(/shift=\{?\(([^)]+)\)\}?/);
            if (sm) {
              const [sx, sy] = sm[1]
                .split(",")
                .map((v: string) => parseFloat(v) || 0);
              accX = sx;
              accY = sy;
            }
          }
          current.accX = accX;
          current.accY = accY;
        }

        if (lastPoint) {
          const op = parts[i - 1] || "--";
          draws.push({
            from: lastPoint.node,
            fromAnchor: lastPoint.anchor,
            fromShift: lastPoint.shift
              ? `shift={${lastPoint.shift.replace(/^, /, "")}}`
              : undefined,
            fromPerpNode: lastPoint.perpNode,
            fromPerpAnchor: lastPoint.perpAnchor,
            fromPerpType: lastPoint.perpType,
            to: current.node,
            toAnchor: current.anchor,
            toShift: current.shift
              ? `shift={${current.shift.replace(/^, /, "")}}`
              : undefined,
            toPerpNode: current.perpNode,
            toPerpAnchor: current.perpAnchor,
            toPerpType: current.perpType,
            perpNode: op === "|-" || op === "-|" ? current.node : undefined, // for path operator
            isPerpendicular: op === "|-" || current.perpType === "|-",
            isPerpendicularH: op === "-|" || current.perpType === "-|",
            isFirst: i === 2,
            isLast: i + 2 >= parts.length,
            style,
          });
        }
        lastPoint = current;
      }
    }
  });

  return {
    nodes,
    draws,
  };
}

export function tikzToMermaid(tex: string): string {
  const nodes: { id: string; label: string; style: string }[] = [];
  const edges: { from: string; to: string; label?: string }[] = [];

  const nodeRegex =
    /\\node\s*(?:\[([^\]]*)\])?\s*\(([^)]+)\)\s*(?:at\s*\(([^)]+)\))?\s*\{([\s\S]*?)\};/g;
  let match;
  while ((match = nodeRegex.exec(tex)) !== null) {
    const [_, style = "", id, at = "", label] = match;
    nodes.push({
      id: id.trim(),
      label: label.replace(/\\\\/g, "<br/>").replace(/[{}]/g, "").trim(),
      style,
    });
  }

  const drawRegex =
    /\\draw\s*(?:\[([^\]]*)\])?\s*\(([^)]+)\)\s*--\s*(?:node\s*(?:\[([^\]]*)\])?\s*\{([^}]*)\}\s*)?\(([^)]+)\);/g;
  while ((match = drawRegex.exec(tex)) !== null) {
    const [_, style = "", from, nodeStyle, label, to] = match;
    edges.push({
      from: from.split(".")[0].trim(),
      to: to.split(".")[0].trim(),
      label: label?.trim(),
    });
  }

  let mmd = "graph TD\n";
  mmd += "  classDef default fill:#fff,stroke:#333,stroke-width:1px;\n";
  mmd +=
    "  classDef mcu fill:rgba(var(--color-primary-rgb),0.05),stroke:var(--color-primary),stroke-width:2px;\n";

  nodes.forEach((node) => {
    let shape = `["${node.label}"]`;
    if (node.style.includes("circle")) shape = `(("${node.label}"))`;
    if (node.style.includes("rounded corners")) shape = `("${node.label}")`;
    mmd += `  ${node.id}${shape}\n`;
    if (
      node.style.includes("mcu") ||
      node.id === "soc" ||
      node.label.length > 20
    ) {
      mmd += `  class ${node.id} mcu\n`;
    }
  });

  edges.forEach((edge) => {
    const arrow = " --> ";
    if (edge.label) {
      mmd += `  ${edge.from} -- "${edge.label}" --> ${edge.to}\n`;
    } else {
      mmd += `  ${edge.from}${arrow}${edge.to}\n`;
    }
  });

  return mmd;
}
