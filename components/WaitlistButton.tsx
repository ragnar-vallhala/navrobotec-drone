"use client";

import { useWaitlist } from "./WaitlistProvider";

/* A button that opens the site's one waitlist dialog. */
export default function WaitlistButton({
  label = "Join the waitlist",
  className = "btn btn-ghost",
}: {
  label?: string;
  className?: string;
}) {
  const { openWaitlist } = useWaitlist();
  return (
    <button type="button" className={className} onClick={openWaitlist}>
      {label}
    </button>
  );
}
