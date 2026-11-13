"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import WaitlistDialog from "./WaitlistDialog";
import {
  MINI_WAITLIST_TITLE,
  WAITLIST_LEDE,
  WAITLIST_TITLE,
  type WaitlistProduct,
} from "@/lib/waitlist";

/* One waitlist dialog for the whole site, mounted once in the root layout.
 *
 * The nav pill, the hero button, the banner, the call-out cards, the products
 * tile, the X427 page and the auto popup all call `openWaitlist`; none of them
 * carries a form of its own. The dialog is the same controlled WaitlistDialog
 * the popup used, so the form, copy and rules are one thing. */

/* `openWaitlist` is the X427's list and is passed straight to onClick in
   several places, so it takes no argument; `openWaitlistFor` names a product. */
type Ctx = {
  openWaitlist: () => void;
  openWaitlistFor: (product: WaitlistProduct) => void;
};

const WaitlistContext = createContext<Ctx>({
  openWaitlist: () => {},
  openWaitlistFor: () => {},
});

export function useWaitlist(): Ctx {
  return useContext(WaitlistContext);
}

export default function WaitlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<WaitlistProduct>("x427");

  const openWaitlistFor = useCallback((next: WaitlistProduct) => {
    setProduct(next);
    setMounted(true);
    setOpen(true);
  }, []);
  const openWaitlist = useCallback(
    () => openWaitlistFor("x427"),
    [openWaitlistFor],
  );
  const value = useMemo(
    () => ({ openWaitlist, openWaitlistFor }),
    [openWaitlist, openWaitlistFor],
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      {mounted ? (
        <WaitlistDialog
          product={product}
          title={product === "x427-mini" ? MINI_WAITLIST_TITLE : WAITLIST_TITLE}
          lede={WAITLIST_LEDE}
          open={open}
          onClosed={() => setOpen(false)}
        />
      ) : null}
    </WaitlistContext.Provider>
  );
}
