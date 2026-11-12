/* A tiny tokenizer for the few languages the books use (c, cpp, python, bash,
   sh, toml). It marks comments, strings, numbers and keywords with span
   classes tok-c, tok-s, tok-n, tok-k. Unknown languages are returned escaped,
   unhighlighted. */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const C_KW = "auto break case char const continue default do double else enum extern float for goto if inline int long register return short signed sizeof static struct switch typedef union unsigned void volatile while bool true false NULL class namespace template typename using new delete public private protected virtual override nullptr constexpr";
const PY_KW = "and as assert break class continue def del elif else except finally for from global if import in is lambda None not or pass raise return try while with yield True False";
const SH_KW = "if then else elif fi for while do done case esac in function return export local set unset cd echo exit";
const TOML_KW = "true false";

const LANGS: Record<string, { kw: string; line: string[]; block?: [string, string] }> = {
  c: { kw: C_KW, line: ["//"], block: ["/*", "*/"] },
  cpp: { kw: C_KW, line: ["//"], block: ["/*", "*/"] },
  python: { kw: PY_KW, line: ["#"] },
  bash: { kw: SH_KW, line: ["#"] },
  sh: { kw: SH_KW, line: ["#"] },
  toml: { kw: TOML_KW, line: ["#"] },
};

export function highlight(code: string, lang: string): string {
  const spec = LANGS[lang];
  if (!spec) return esc(code);
  const kws = new Set(spec.kw.split(" "));
  let out = "";
  let i = 0;
  const span = (cls: string, t: string) => `<span class="tok-${cls}">${esc(t)}</span>`;
  while (i < code.length) {
    const rest = code.slice(i);
    const ch = code[i];
    if (spec.block && rest.startsWith(spec.block[0])) {
      const end = code.indexOf(spec.block[1], i + 2);
      const stop = end < 0 ? code.length : end + spec.block[1].length;
      out += span("c", code.slice(i, stop));
      i = stop;
    } else if (spec.line.some((m) => rest.startsWith(m) && (m !== "#" || i === 0 || /[\s]/.test(code[i - 1])))) {
      const end = code.indexOf("\n", i);
      const stop = end < 0 ? code.length : end;
      out += span("c", code.slice(i, stop));
      i = stop;
    } else if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== ch && code[j] !== "\n") j += code[j] === "\\" ? 2 : 1;
      const stop = Math.min(j + 1, code.length);
      out += span("s", code.slice(i, stop));
      i = stop;
    } else if (/[0-9]/.test(ch) && !/[A-Za-z_]/.test(code[i - 1] ?? " ")) {
      const m = rest.match(/^(0[xX][0-9a-fA-F]+|[0-9]+(\.[0-9]+)?)/)!;
      out += span("n", m[0]);
      i += m[0].length;
    } else if (/[A-Za-z_]/.test(ch)) {
      const m = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/)!;
      out += kws.has(m[0]) ? span("k", m[0]) : esc(m[0]);
      i += m[0].length;
    } else {
      out += esc(ch);
      i += 1;
    }
  }
  return out;
}
