"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import WaitlistCarousel from "./WaitlistCarousel";
import { useWaitlist } from "./WaitlistProvider";
import styles from "./WaitlistPopup.module.css";
import { POPUP_SHOTS } from "@/lib/product-media";
import {
  isWaitlisted,
  markPopupShown,
  popupShownThisVisit,
} from "@/lib/waitlist";

/* A one-time nudge towards the X427 waitlist, mounted once in the root layout.
 *
 * When it appears: about 2 seconds after the first page of a visit that is
 * not /docs or /admin, unless this browser has already joined (localStorage)
 * or the prompt has already appeared to this visitor (a localStorage flag in
 * lib/waitlist.ts, with an in-memory fallback when storage is blocked). It
 * shows once per visitor: a refresh or a later visit does not bring it back. If
 * the first page is /docs or /admin it is simply skipped there and can show on
 * the next client-side page, since the flag is only set when it appears.
 *
 * It is a native modal <dialog>, like InterestDialog: focus moves in and
 * returns, the page behind is inert, Escape and a click on the backdrop close
 * it, and so do the X and "Not now". It also closes by itself after about 12
 * seconds; the countdown pauses while the pointer is over it or a control
 * inside it has keyboard focus. Initial focus goes to the dialog itself, not a
 * button, so merely appearing does not count as interaction.
 *
 * "Join the waitlist" closes it and opens the same WaitlistDialog as the X427
 * page, rendered here in controlled mode, so there is one form. */

const SHOW_AFTER_MS = 2000;
const HIDE_AFTER_MS = 12000;
const EXCLUDED = ["/docs", "/admin", "/waitlist"];

function excluded(path: string | null): boolean {
  return EXCLUDED.some((p) => path === p || path?.startsWith(`${p}/`));
}

const SHOTS = POPUP_SHOTS;

export default function WaitlistPopup() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const { openWaitlist } = useWaitlist();
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = useRef(HIDE_AFTER_MS);
  const startedAt = useRef(0);

  const stopTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = null;
  }, []);

  const close = useCallback(() => {
    stopTimer();
    ref.current?.close();
  }, [stopTimer]);

  const startTimer = useCallback(() => {
    stopTimer();
    startedAt.current = Date.now();
    hideTimer.current = setTimeout(close, remaining.current);
  }, [close, stopTimer]);

  const pause = useCallback(() => {
    if (!hideTimer.current) return;
    remaining.current = Math.max(
      1500,
      remaining.current - (Date.now() - startedAt.current),
    );
    stopTimer();
  }, [stopTimer]);

  /* Decide, per page, whether to show. Storage is read only inside effects,
     so the server and first client render agree (both render nothing). */
  useEffect(() => {
    if (excluded(pathname)) return;
    if (isWaitlisted() || popupShownThisVisit()) return;
    const timer = setTimeout(() => {
      if (isWaitlisted() || popupShownThisVisit()) return;
      if (document.querySelector("dialog[open]")) return;
      markPopupShown();
      remaining.current = HIDE_AFTER_MS;
      setShow(true);
    }, SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  /* Open as modal once rendered; lock the page's scroll like InterestDialog. */
  useEffect(() => {
    if (!show) return;
    const dialog = ref.current;
    if (!dialog) return;
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    const { overflow, paddingRight } = root.style;
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
    if (!dialog.open) dialog.showModal();
    dialog.focus();
    startTimer();
    return () => {
      stopTimer();
      root.style.overflow = overflow;
      root.style.paddingRight = paddingRight;
    };
  }, [show, startTimer, stopTimer]);

  const join = () => {
    close();
    openWaitlist();
  };

  return (
    <>
      {show ? (
        <dialog
          ref={ref}
          tabIndex={-1}
          className={styles.dialog}
          aria-labelledby={titleId}
          onClose={() => setShow(false)}
          onClick={(event) => {
            if (event.target === ref.current) close();
          }}
          /* A pointer over the backdrop reports the dialog itself as its
             target, so only the panel's own contents count as hovering. */
          onPointerMove={(event) => {
            if (event.target === ref.current) {
              if (!hideTimer.current) startTimer();
            } else pause();
          }}
          onPointerLeave={() => {
            if (!hideTimer.current) startTimer();
          }}
          onFocus={(event) => {
            if (event.target !== ref.current) pause();
          }}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            ) {
              startTimer();
            }
          }}
        >
          <div className={styles.panel}>
            <button
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 2l10 10M12 2 2 12" />
              </svg>
            </button>
            <div className={styles.visual}>
              <WaitlistCarousel
                shots={SHOTS}
                sizes="(max-width: 44rem) 90vw, 26rem"
              />
            </div>
            <div className={styles.body}>
              <p className="label label-signal">X427 waitlist</p>
              <h2 id={titleId} className={`h2 ${styles.title}`}>
                X427 waitlist is open
              </h2>
              <p className={styles.text}>
                College students get a free board, first come, first served:
                the first 50.
              </p>
              <div className={styles.actions}>
                <button type="button" className="btn btn-primary" onClick={join}>
                  Join the waitlist
                </button>
                <button type="button" className="btn btn-ghost" onClick={close}>
                  Not now
                </button>
              </div>
            </div>
          </div>
        </dialog>
      ) : null}

    </>
  );
}
