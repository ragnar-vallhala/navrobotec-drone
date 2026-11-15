"use client";

import InterestDialog from "@/components/InterestDialog";
import WaitlistButton from "@/components/WaitlistButton";
import type { WaitlistProduct } from "@/lib/waitlist";

/* The enquiry and waitlist buttons, as the product pages always had them.
   The waitlist is the primary action where a product has one; otherwise the
   enquiry is. */
export default function ProductActions({
  name,
  interest,
  options,
  waitlist,
  block = false,
}: {
  name: string;
  interest?: string;
  options: string[];
  waitlist: WaitlistProduct | false;
  block?: boolean;
}) {
  const cls = block ? " btn-block" : "";
  return (
    <>
      {waitlist ? (
        <WaitlistButton
          label="Join waitlist"
          className={`btn btn-primary${cls}`}
          product={waitlist}
        />
      ) : null}
      <InterestDialog
        label="Enquire"
        title={`Enquire about ${name}`}
        lede="Your message goes to an engineer, and the reply comes from one."
        interest={interest}
        options={options}
        buttonClassName={`btn ${waitlist ? "btn-ghost" : "btn-primary"}${cls}`}
      />
    </>
  );
}
