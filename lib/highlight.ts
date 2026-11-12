/* A tiny tokenizer for the languages the books use. It marks comments,
   strings, numbers, keywords and variables with span classes tok-c, tok-s,
   tok-n, tok-k, tok-v. Blocks without a language tag are sniffed (detectLang)
   and only highlighted when the guess is confident; ASCII diagrams and plain
   listings stay plain. */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const C_KW = "auto break case char const continue default do double else enum extern float for goto if inline int long register return short signed sizeof static struct switch typedef union unsigned void volatile while bool true false NULL class namespace template typename using new delete public private protected virtual override nullptr constexpr uint8_t uint16_t uint32_t uint64_t int8_t int16_t int32_t int64_t size_t";
const PY_KW = "and as assert break class continue def del elif else except finally for from global if import in is lambda None not or pass raise return try while with yield True False";
const SH_KW = "if then else elif fi for while do done case esac in function return export local set unset cd echo exit sudo git cmake make gh nav apt dpkg mkdir";
const TOML_KW = "true false";
const KCONFIG_KW = "config menuconfig menu endmenu choice endchoice if endif bool tristate int hex string depends on default select imply help prompt source comment range visible mainmenu";
const MAKE_KW = "ifeq ifneq ifdef ifndef else endif include define endef export override";
const JSON_KW = "true false null";
const YAML_KW = "true false null yes no";

type Spec = {
  kw: string;
  line: string[];
  block?: [string, string];
  /* Regexes tried at the start of a line; a match is emitted as a keyword. */
  lineKey?: RegExp[];
  /* Highlight $VAR, ${VAR}, $(VAR) as variables. */
  vars?: boolean;
  /* Command-like words: name( as keyword (CMake). */
  call?: boolean;
  /* A string followed by ':' is a key. */
  strKeys?: boolean;
  nocase?: boolean;
};

const LANGS: Record<string, Spec> = {
  c: { kw: C_KW, line: ["//"], block: ["/*", "*/"], lineKey: [/^\s*#\s*\w+/] },
  cpp: { kw: C_KW, line: ["//"], block: ["/*", "*/"], lineKey: [/^\s*#\s*\w+/] },
  python: { kw: PY_KW, line: ["#"] },
  bash: { kw: SH_KW, line: ["#"], vars: true },
  sh: { kw: SH_KW, line: ["#"], vars: true },
  toml: { kw: TOML_KW, line: ["#"], lineKey: [/^\s*\[[^\]\n]+\]/, /^\s*[\w.-]+(?=\s*=)/] },
  cmake: { kw: "", line: ["#"], call: true, vars: true },
  yaml: { kw: YAML_KW, line: ["#"], lineKey: [/^\s*-?\s*[\w.-]+(?=:(\s|$))/], strKeys: true },
  json: { kw: JSON_KW, line: ["//"], strKeys: true },
  make: { kw: MAKE_KW, line: ["#"], vars: true, lineKey: [/^[\w.%\/-]+(?=\s*:)/] },
  kconfig: { kw: KCONFIG_KW, line: ["#"], nocase: false },
};
const ALIAS: Record<string, string> = {
  "c++": "cpp", h: "c", hpp: "cpp", py: "python", shell: "bash", zsh: "bash", console: "bash",
  cmakelists: "cmake", yml: "yaml", jsonc: "json", makefile: "make", mk: "make", kconfig: "kconfig",
};

/* Guess the language of an untagged block, or return "" when unsure. */
export function detectLang(code: string): string {
  const lines = code.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return "";
  const t = code.trim();
  if (/^\$ /m.test(code) || /^(sudo|git|cmake|make|gh|apt|dpkg|cd|mkdir|export|\.\/)\s/m.test(code)) return "bash";
  if (/^\s*#\s*include\b/m.test(code) || /^\s*(static\s+|const\s+)*(int|void|uint\d+_t|char|float|double|struct)\s+\**\w+\s*[\(\{;=]/m.test(code)) return "c";
  if (/^(def |class \w+.*:$|import \w|from \w+ import)/m.test(code)) return "python";
  if (/^\s*(cmake_minimum_required|add_subdirectory|add_executable|add_library|target_link_libraries|project)\s*\(/m.test(code) || /^\s*(set|if|endif|function|endfunction)\s*\(/m.test(code)) return "cmake";
  if (/^(config|menuconfig|menu|choice)\s+\w*/m.test(code) && /^\s+(bool|int|string|hex|tristate|depends on|default|help)\b/m.test(code)) return "kconfig";
  if (/^[\w.%\/-]+\s*:.*\n\t/m.test(code)) return "make";
  if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
    try {
      JSON.parse(t);
      return "json";
    } catch {
      /* pseudo-JSON with comments is left plain */
    }
  }
  const body = lines.filter((l) => !/^\s*#/.test(l));
  if (/^\s*\[[\w.-]+\]\s*$/m.test(code) && body.every((l) => /^\s*(\[[\w.-]+\]|[\w.-]+\s*=.*)$/.test(l))) return "toml";
  if (body.length >= 2 && body.every((l) => /^\s*[\w.-]+\s*=\s*\S/.test(l))) return "toml";
  if (body.length >= 2 && body.every((l) => /^\s*(-\s+\S.*|[\w.-]+:(\s+\S.*)?)$/.test(l)) && body.some((l) => /^\s*[\w.-]+:/.test(l))) return "yaml";
  return "";
}

export function highlight(code: string, langIn: string): string {
  let lang = ALIAS[langIn] ?? langIn;
  if (!lang) lang = detectLang(code);
  const spec = LANGS[lang];
  if (!spec) return esc(code);
  const kws = new Set(spec.kw.split(" ").filter(Boolean));
  let out = "";
  let i = 0;
  const span = (cls: string, t: string) => `<span class="tok-${cls}">${esc(t)}</span>`;
  const atLineStart = () => i === 0 || code[i - 1] === "\n";
  while (i < code.length) {
    const rest = code.slice(i);
    const ch = code[i];
    let m: RegExpMatchArray | null;
    if (atLineStart() && spec.lineKey) {
      let hit = "";
      for (const re of spec.lineKey) {
        const mm = rest.match(re);
        if (mm) {
          hit = mm[0];
          break;
        }
      }
      if (hit) {
        const lead = hit.match(/^\s*/)![0];
        out += esc(lead) + span("k", hit.slice(lead.length));
        i += hit.length;
        continue;
      }
    }
    if (lang === "bash" || lang === "sh") {
      if (atLineStart() && rest.startsWith("$ ")) {
        out += span("c", "$") + " ";
        i += 2;
        continue;
      }
    }
    if (spec.block && rest.startsWith(spec.block[0])) {
      const end = code.indexOf(spec.block[1], i + 2);
      const stop = end < 0 ? code.length : end + spec.block[1].length;
      out += span("c", code.slice(i, stop));
      i = stop;
    } else if (spec.line.some((mk) => rest.startsWith(mk) && (mk !== "#" || i === 0 || /\s/.test(code[i - 1])))) {
      const end = code.indexOf("\n", i);
      const stop = end < 0 ? code.length : end;
      out += span("c", code.slice(i, stop));
      i = stop;
    } else if (spec.vars && (m = rest.match(/^(\$\{[^}\n]*\}|\$\([^)\n]*\)|\$[A-Za-z_]\w*)/))) {
      out += span("v", m[0]);
      i += m[0].length;
    } else if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== ch && code[j] !== "\n") j += code[j] === "\\" ? 2 : 1;
      const stop = Math.min(j + 1, code.length);
      const isKey = spec.strKeys && /^\s*:/.test(code.slice(stop, stop + 8));
      out += span(isKey ? "k" : "s", code.slice(i, stop));
      i = stop;
    } else if (/[0-9]/.test(ch) && !/[A-Za-z_]/.test(code[i - 1] ?? " ")) {
      const mm = rest.match(/^(0[xX][0-9a-fA-F]+|[0-9]+(\.[0-9]+)?)/)!;
      out += span("n", mm[0]);
      i += mm[0].length;
    } else if (/[A-Za-z_]/.test(ch)) {
      const mm = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/)!;
      const w = spec.nocase ? mm[0].toLowerCase() : mm[0];
      const isCall = spec.call && /^\s*\(/.test(code.slice(i + mm[0].length, i + mm[0].length + 3)) && /^[a-z_]+$/.test(mm[0]);
      out += kws.has(w) || isCall ? span("k", mm[0]) : esc(mm[0]);
      i += mm[0].length;
    } else {
      out += esc(ch);
      i += 1;
    }
  }
  return out;
}
