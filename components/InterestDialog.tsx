"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import EnquiryForm from "./EnquiryForm";
import styles from "./InterestDialog.module.css";

/* Register interest, in a dialog rather than a band at the foot of the page.
 *
 * A native <dialog> opened with showModal(), not a div with role="dialog".
 * The platform then owns the parts that are usually got wrong: focus moves
 * into the dialog and is trapped there, Escape closes it, focus returns to
 * the button that opened it, and everything behind it is inert to a screen
 * reader as well as to the mouse. None of that is code here.
 *
 * The form is mounted only while the dialog is open, keyed by that, so a
 * visitor who fills half of it in, closes, and opens it again gets an empty
 * form rather than the remains of the last attempt — and so the interest chip
 * is re-selected from the product each time.
 */
export default function InterestDialog({
  label,
  title,
  lede,
  interest,
  options,
}: {
  label: string;
  title: string;
  lede: string;
  /* The product this page is about, pre-selected in the chips. Absent when
     the catalogue has no interest label for the slug, in which case the
     visitor picks for themselves. */
  interest?: string;
  options: string[];
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => ref.current?.close(), []);

  /* The page behind a modal must not scroll under it. <dialog> does not do
     this for us, and the scrollbar disappearing shifts the layout, so the
     width it occupied is replaced by padding. */
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    const { overflow, paddingRight } = root.style;
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
    return () => {
      root.style.overflow = overflow;
      root.style.paddingRight = paddingRight;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          ref.current?.showModal();
          setOpen(true);
        }}
      >
        {label}
      </button>

      <dialog
        ref={ref}
        className={styles.dialog}
        aria-labelledby="interest-title"
        /* Fired by Escape as well as by close(), so this is the one place
           that has to reset the state. */
        onClose={() => setOpen(false)}
        /* A click on the backdrop lands on the dialog element itself; a click
           on anything inside lands on that child. Comparing the target is the
           whole of "click outside to dismiss". */
        onClick={(event) => {
          if (event.target === ref.current) close();
        }}
      >
        <div className={styles.panel}>
          <button
            type="button"
            onClick={close}
            className={styles.close}
            aria-label="Close"
          >
            <span aria-hidden>&times;</span>
          </button>

          <header className={styles.head}>
            <p className="label label-signal">{label}</p>
            <h2 id="interest-title" className={`h2 ${styles.title}`}>
              {title}
            </h2>
            <p className={`body ${styles.lede}`}>{lede}</p>
          </header>

          {open ? (
            <EnquiryForm
              source="wishlist"
              fields={[
                { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
                { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
                { name: "company", label: "Company or team", type: "text", autoComplete: "organization", wide: true },
              ]}
              interests={{ legend: "Which of these", options }}
              /* Ticked on arrival, because the visitor opened this from the
                 product's own page. The others stay available: someone who
                 wants the H747 often wants the airframe too. */
              defaultInterests={interest ? [interest] : []}
              message={{
                label: "What would you use it for?",
                placeholder:
                  "The aircraft, the payload, the environment, how many — whatever would help us build the right one first.",
                rows: 4,
              }}
              submit="Register interest"
              done={{
                title: "Thank you — that reached us.",
                body: "You are on the list for it. We write when there is something real to show, not before.",
              }}
            />
          ) : null}
        </div>
      </dialog>
    </>
  );
}
