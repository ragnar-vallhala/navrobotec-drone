import type { Metadata } from "next";
import BookInPreparation from "../BookInPreparation";
import { getBook } from "@/lib/docs";

export function generateMetadata(): Metadata {
  const book = getBook("vaios");
  return {
    title: `${book?.title ?? "VaiOS Guide"}`,
    // Reachable, but kept out of search until the guide is written.
    robots: { index: false, follow: true },
    description:
      book?.description ??
      "Tutorial-style walkthrough of the VaiOS real-time kernel.",
  };
}

export default function VaiosBookPage() {
  return <BookInPreparation slug="vaios" />;
}
