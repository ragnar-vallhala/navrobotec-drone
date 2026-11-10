import variants from "./image-variants.json";

/* next/image loader that points at the files scripts/make-image-variants.mjs
   wrote at build time, instead of asking Next to resize on request. A picture
   with no pre-generated variants (an SVG, a remote URL, anything added after
   the script ran) is served as it is. */
const table = variants as Record<string, number[]>;

export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const widths = table[src];
  if (!widths || widths.length === 0) return src;
  const pick = widths.find((w) => w >= width) ?? widths[widths.length - 1];
  const dot = src.lastIndexOf(".");
  return `/_v${src.slice(0, dot)}-${pick}.webp`;
}
