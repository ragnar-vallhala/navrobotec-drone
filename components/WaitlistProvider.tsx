"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import WaitlistDialog from "./WaitlistDialog";
import { WAITLIST_LEDE, WAITLIST_TITLE } from "@/lib/waitlist";

/* One waitlist dialog for the whole site, mounted once in the root layout.
 *
 * The nav pill, the hero button, the banner, the call-out cards, the products
 * tile, the X427 page and the auto popup all call `openWaitlist`; none of them
 * carries a form of its own. The dialog is the same controlled WaitlistDialog
 * the popup used, so the form, copy and rules are one thing. */

type Ctx = { openWaitlist: () => void };

const WaitlistContext = createContext<Ctx>({ openWaitlist: () => {} });

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

  const openWaitlist = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);
  const value = useMemo(() => ({ openWaitlist }), [openWaitlist]);

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      {mounted ? (
        <WaitlistDialog
          title={WAITLIST_TITLE}
          lede={WAITLIST_LEDE}
          open={open}
          onClosed={() => setOpen(false)}
        />
      ) : null}
    </WaitlistContext.Provider>
  );
}
