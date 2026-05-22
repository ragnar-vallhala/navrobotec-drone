import type { Metadata } from "next";
import BookPlaceholder from "../BookPlaceholder";
import { getBook } from "@/lib/docs";

export function generateMetadata(): Metadata {
  const book = getBook("vayu");
  return {
    title: `${book?.title ?? "Vayu Guide"} | NAVRobotec`,
    description:
      book?.description ??
      "Tutorial-style walkthrough of the Vayu flight control stack.",
  };
}

export default function VayuBookPage() {
  return <BookPlaceholder slug="vayu" />;
}
