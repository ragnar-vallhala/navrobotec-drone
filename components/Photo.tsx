import Image from "next/image";
import type { ComponentProps } from "react";
import { getImageMeta } from "@/lib/imageMeta";

/* next/image with a blur placeholder for local pictures.

   The full-size image is optimised on first request, which on a small server
   can take a second or two, and until then the box is empty. A 16px blurred
   copy of the same picture is inlined into the HTML (about 300 bytes), so the
   box paints at once in the right colours and the sharp image fades in over
   it. The placeholder is computed once per process and cached.

   Small images (avatars, logos) are left alone: the placeholder would cost
   more than the picture. */
export default async function Photo(props: ComponentProps<typeof Image>) {
  const { src, width, placeholder, ...rest } = props;
  const small = typeof width === "number" && width <= 160;
  if (
    typeof src === "string" &&
    src.startsWith("/") &&
    !placeholder &&
    !small
  ) {
    const meta = await getImageMeta(src);
    if (meta) {
      return (
        <Image
          src={src}
          width={width}
          placeholder="blur"
          blurDataURL={meta.blurDataURL}
          {...rest}
        />
      );
    }
  }
  return <Image src={src} width={width} placeholder={placeholder} {...rest} />;
}
