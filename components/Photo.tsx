"use client";

import Image from "next/image";
import { useCallback, useState, type ComponentProps } from "react";

/* next/image that shows a picture only once the whole file is downloaded and
   decoded, then fades it in.

   There is no blurred stand-in and no half-drawn picture: a browser paints an
   image as its bytes arrive, so a big file visibly fills in from the top. Until
   the file is complete this one is invisible (the box keeps its size, so the
   page does not move) and then it appears in one piece.

   The hidden state is a CSS rule in globals.css that only applies when the
   page's script has run (html[data-js]), so without JavaScript pictures simply
   load the ordinary way. A picture that finished before React woke up is
   caught by the ref check. */
export default function Photo(props: ComponentProps<typeof Image>) {
  const { onLoad, onError, ...rest } = props;
  const [ready, setReady] = useState(false);

  const ref = useCallback((el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth > 0) setReady(true);
  }, []);

  return (
    <Image
      {...rest}
      ref={ref}
      data-reveal=""
      data-ready={ready ? "" : undefined}
      onLoad={(e) => {
        const el = e.currentTarget;
        el.decode().catch(() => {}).finally(() => setReady(true));
        onLoad?.(e);
      }}
      onError={(e) => {
        setReady(true);
        onError?.(e);
      }}
    />
  );
}
