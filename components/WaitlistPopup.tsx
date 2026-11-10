"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import WaitlistDialog from "./WaitlistDialog";
import styles from "./WaitlistPopup.module.css";
import {
  isWaitlisted,
  markPopupShown,
  popupShownThisVisit,
  WAITLIST_LEDE,
  WAITLIST_TITLE,
} from "@/lib/waitlist";

/* A one-time nudge towards the X427 waitlist, mounted once in the root layout.
 *
 * When it appears: about 2 seconds after the first page of a visit that is
 * not /docs or /admin, unless this browser has already joined (localStorage)
 * or the prompt has already been shown in this visit (sessionStorage; a new
 * tab or visit shows it once more). The session flag is set the moment it
 * appears, so no later page in the visit shows it again, whether or not it was
 * dismissed.
 *
 * What it will not do: take focus, dim the page, or move anything. It is a
 * non-modal card in the bottom corner. It goes away on its own after about 8
 * seconds (the countdown pauses while the pointer or keyboard focus is on it),
 * with the X, with Escape, or with "Not now".
 *
 * "Join the waitlist" opens the same WaitlistDialog as the X427 page, rendered
 * here in controlled mode, so there is one form. It works on every page. */

const SHOW_AFTER_MS = 2000;
const HIDE_AFTER_MS = 8000;
const EXCLUDED = ["/docs", "/admin"];

function excluded(path: string | null): boolean {
  return EXCLUDED.some((p) => path === p || path?.startsWith(`${p}/`));
}

export default function WaitlistPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dialogMounted, setDialogMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const titleId = useId();

  /* The hide countdown, kept in refs so pausing does not re-render. */
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = useRef(HIDE_AFTER_MS);
  const startedAt = useRef(0);

  const stopTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = null;
  }, []);

  const dismiss = useCallback(() => {
    stopTimer();
    setVisible(false);
  }, [stopTimer]);

  const startTimer = useCallback(() => {
    stopTimer();
    startedAt.current = Date.now();
    hideTimer.current = setTimeout(dismiss, remaining.current);
  }, [dismiss, stopTimer]);

  const pause = useCallback(() => {
    if (!hideTimer.current) return;
    remaining.current = Math.max(
      1000,
      remaining.current - (Date.now() - startedAt.current),
    );
    stopTimer();
  }, [stopTimer]);

  /* Decide, per page, whether to show. Reads storage only inside the effect,
     so the server and the first client render agree (both render nothing). */
  useEffect(() => {
    if (excluded(pathname)) return;
    if (isWaitlisted() || popupShownThisVisit()) return;

    const timer = setTimeout(() => {
      /* Re-checked at the moment of showing: a form may have been opened, or
         the visitor may have joined in another tab, in the meantime. */
      if (isWaitlisted() || popupShownThisVisit()) return;
      if (document.querySelector("dialog[open]")) return;
      markPopupShown();
      remaining.current = HIDE_AFTER_MS;
      setVisible(true);
    }, SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  /* Start the countdown when it appears; clean up when it goes. */
  useEffect(() => {
    if (!visible) return;
    startTimer();
    return stopTimer;
  }, [visible, startTimer, stopTimer]);

  /* Escape closes it without needing focus to be inside it. */
  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  /* Leaving for a page where it must not show also takes it down. */
  useEffect(() => {
    if (excluded(pathname)) dismiss();
  }, [pathname, dismiss]);

  const join = () => {
    dismiss();
    setDialogMounted(true);
    setDialogOpen(true);
  };

  return (
    <>
      {visible ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className={styles.card}
          onPointerEnter={pause}
          onPointerLeave={() => {
            if (!hideTimer.current) startTimer();
          }}
          onFocus={pause}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              startTimer();
            }
          }}
        >
          <button
            type="button"
            className={styles.close}
            onClick={dismiss}
            aria-label="Close"
          >
            <span aria-hidden>&times;</span>
          </button>
          <h2 id={titleId} className={`h3 ${styles.title}`}>
            X427 waitlist is open
          </h2>
          <p className={styles.text}>
            College students get a free board, first come, first served: the
            first 50.
          </p>
          <div className={styles.actions}>
            <button type="button" className="btn btn-primary" onClick={join}>
              Join the waitlist
            </button>
            <button type="button" className="btn btn-ghost" onClick={dismiss}>
              Not now
            </button>
          </div>
        </section>
      ) : null}

      {dialogMounted ? (
        <WaitlistDialog
          title={WAITLIST_TITLE}
          lede={WAITLIST_LEDE}
          open={dialogOpen}
          onClosed={() => setDialogOpen(false)}
        />
      ) : null}
    </>
  );
}
