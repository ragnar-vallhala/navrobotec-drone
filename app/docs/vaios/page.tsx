import type { Metadata } from "next";
import BookPlaceholder from "../BookPlaceholder";
import { getBook } from "@/lib/docs";

export function generateMetadata(): Metadata {
  const book = getBook("vaios");
  return {
    title: `${book?.title ?? "VaiOS Guide"} | NAVRobotec`,
    description:
      book?.description ??
      "Tutorial-style walkthrough of the VaiOS real-time kernel.",
  };
}

export default function VaiosBookPage() {
  return <BookPlaceholder slug="vaios" />;
}
