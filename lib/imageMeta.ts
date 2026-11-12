import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface ImageMeta {
  width: number;
  height: number;
}

// Module-level cache: the source files are static, so a given public path's
// dimensions never change within a server process. Avoids re-reading
// and re-encoding on every request (the [slug] route is rendered on demand).
const cache = new Map<string, ImageMeta | null>();

/**
 * Read an image under /public and return its intrinsic size. Returns null if
 * the file can't be read.
 *
 * @param publicSrc path as referenced in markup, e.g. "/images/hero.png"
 */
export async function getImageMeta(publicSrc: string): Promise<ImageMeta | null> {
  if (cache.has(publicSrc)) return cache.get(publicSrc) ?? null;

  let result: ImageMeta | null = null;
  try {
    const filePath = path.join(process.cwd(), 'public', publicSrc);
    const input = fs.readFileSync(filePath);
    const meta = await sharp(input).metadata();
    if (meta.width && meta.height) {
      result = {
        width: meta.width,
        height: meta.height,
      };
    }
  } catch {
    result = null;
  }

  cache.set(publicSrc, result);
  return result;
}
