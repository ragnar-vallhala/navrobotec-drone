import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/* Next's built-in 404 renders against its own colours, which on this site came
 * out as near-black text on a near-black ground. This one is a page like any
 * other, and it offers the three places a mistyped URL is most likely aiming
 * at rather than only saying no. */
export default function NotFound() {
  return (
    <div className="page">
      <section className="section shell">
        <p className="label">Error 404</p>
        <h1 className="h1" style={{ marginTop: "1.25rem" }}>
          That page isn&apos;t here.
        </h1>
        <p className="lede muted" style={{ marginTop: "1.25rem" }}>
          The link may be out of date, or the page may have moved while the
          site was rebuilt. These are the places most links point at.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.875rem",
            marginTop: "2.5rem",
          }}
        >
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/docs" className="btn btn-ghost">
            Documentation
          </Link>
          <Link href="/blogs" className="btn btn-ghost">
            Engineering journal
          </Link>
        </div>
      </section>
    </div>
  );
}
