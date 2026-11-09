import Image from "next/image";
import styles from "./BoardPhoto.module.css";
import type { Shot } from "@/lib/product-media";

/* A render that fills its positioned parent. The parent's aspect ratio is the
 * crop's, so nothing is cut and nothing shifts while it loads. With `narrow`,
 * phones get a squarer crop of the same view. */
export default function BoardPhoto({
  shot,
  narrow,
  sizes,
  priority = false,
}: {
  shot: Shot;
  narrow?: Shot;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${styles.image} ${narrow ? styles.wide : ""}`}
      />
      {narrow ? (
        <Image
          src={narrow.src}
          alt={narrow.alt}
          fill
          sizes={sizes}
          className={`${styles.image} ${styles.narrow}`}
        />
      ) : null}
    </>
  );
}
