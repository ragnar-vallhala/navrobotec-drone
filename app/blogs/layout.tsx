import ReadingBar from "@/components/ReadingBar";

/* Exists only to put the reading chrome above every blog page — the index and
   each post — without repeating it in both. */
export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReadingBar />
      {children}
    </>
  );
}
