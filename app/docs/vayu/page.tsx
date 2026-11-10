import type { Metadata } from "next";
import BookInPreparation from "../BookInPreparation";
import { getBook } from "@/lib/docs";

export function generateMetadata(): Metadata {
  const book = getBook("vayu");
  return {
    title: `${book?.title ?? "VAYU Guide"}`,
    // Reachable, but kept out of search until the guide is written.
    robots: { index: false, follow: true },
    description:
      book?.description ??
      "Tutorial-style walkthrough of the VAYU flight control stack.",
  };
}

export default function VayuBookPage() {
  return <BookInPreparation slug="vayu" />;
}
