"use client";

import { useWaitlist } from "./WaitlistProvider";
import type { WaitlistProduct } from "@/lib/waitlist";

/* A button that opens the site's one waitlist dialog, for the X427 unless a
   product is given. */
export default function WaitlistButton({
  label = "Join the waitlist",
  className = "btn btn-ghost",
  product = "x427",
}: {
  label?: string;
  className?: string;
  product?: WaitlistProduct;
}) {
  const { openWaitlistFor } = useWaitlist();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openWaitlistFor(product)}
    >
      {label}
    </button>
  );
}
