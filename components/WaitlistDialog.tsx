"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import form from "./EnquiryForm.module.css";
import styles from "./InterestDialog.module.css";

/* The X427 student waitlist, in the same kind of dialog as InterestDialog.
 *
 * It is a separate component and a separate button from "Enquire" on purpose:
 * an enquiry is a conversation with an engineer, the waitlist is a place in a
 * line, and they land in different tables. See InterestDialog for why this is
 * a native <dialog> and why the form is mounted only while it is open; the
 * scroll lock below is the same one.
 *
 * Copy is limited to the offer as stated: the first 50 college students and
 * clubs on the waitlist receive a free kit. Nothing here says when, or what
 * is in it.
 *
 * As in EnquiryForm, the API decides what is valid and field errors come back
 * keyed by the `name` attributes below.
 */

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

const YEARS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th year or later",
  "Postgraduate",
  "Not applicable",
];

type FieldName = "name" | "email" | "college_or_club" | "year" | "city";

type Joined = { position: number; email: string };

const DUPLICATE =
  "That email address is already on the X427 waitlist. You do not need to join again.";

function WaitlistForm() {
  const [sending, setSending] = useState(false);
  const [joined, setJoined] = useState<Joined | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const busy = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);
  const uid = useId();
  const fid = (name: string) => `${uid}-f-${name}`;
  const eid = (name: string) => `${uid}-e-${name}`;
  const [failure, setFailure] = useState(0);

  useEffect(() => {
    if (failure === 0) return;
    const first = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    (first ?? alertRef.current)?.focus();
  }, [failure]);

  useEffect(() => {
    if (joined) doneRef.current?.focus();
  }, [joined]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "");

    setSending(true);
    setErrors({});

    try {
      const response = await fetch(`${API}/api/v1/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          name: get("name"),
          email: get("email"),
          college_or_club: get("college_or_club"),
          year: get("year"),
          city: get("city"),
          /* The honeypot, as on the enquiry form. */
          website: get("website"),
        }),
      });
      const body = await response.json().catch(() => null);

      if (response.status === 409) {
        setErrors({ email: DUPLICATE });
        setFailure((n) => n + 1);
        return;
      }

      if (!response.ok) {
        const fields = body?.error?.fields as
          | { field: string; message: string }[]
          | undefined;
        const shown = new Set<string>([
          "name",
          "email",
          "college_or_club",
          "year",
          "city",
        ] satisfies FieldName[]);
        const next: Record<string, string> = {};
        const stray: string[] = [];
        for (const f of fields ?? []) {
          if (shown.has(f.field)) next[f.field] = f.message;
          else stray.push(`${f.field}: ${f.message}`);
        }
        if (!fields?.length) {
          next[""] =
            response.status === 429
              ? "Too many requests just now. Please wait a minute and try again."
              : (body?.error?.message ??
                "Something went wrong. Please try again, or write to us directly.");
        } else if (stray.length) {
          next[""] = `Please check your details. ${stray.join("; ")}`;
        }
        setErrors(next);
        setFailure((n) => n + 1);
        return;
      }

      const position = Number(body?.data?.position);
      if (!Number.isFinite(position) || position < 1) {
        /* The API accepted it but did not say where: say that much and no
           more, rather than inventing a number. */
        setJoined({ position: 0, email: get("email").trim() });
      } else {
        setJoined({ position, email: get("email").trim() });
      }
    } catch {
      setErrors({
        "":
          "We could not reach the server. Please check your connection, or write to support@navrobotec.com.",
      });
      setFailure((n) => n + 1);
    } finally {
      busy.current = false;
      setSending(false);
    }
  };

  if (joined) {
    return (
      <div className={form.done} role="status" tabIndex={-1} ref={doneRef}>
        <p className="label label-signal">On the waitlist</p>
        <h2 className="h2">
          {joined.position > 0
            ? `You are on the X427 waitlist, position ${joined.position}.`
            : "You are on the X427 waitlist."}
        </h2>
        <p className="body">
          The first 50 college students and clubs on the waitlist receive a
          free kit. We will email you at {joined.email} about next steps.
        </p>
      </div>
    );
  }

  const input = (
    name: FieldName,
    label: string,
    type: "text" | "email",
    autoComplete: string,
    opts: { required?: boolean; wide?: boolean; maxLength: number },
  ) => (
    <div className={`${form.field} ${opts.wide ? form.wide : ""}`}>
      <label className="label" htmlFor={fid(name)}>
        {label}
        {opts.required ? null : (
          <span className={form.optional}> — optional</span>
        )}
      </label>
      <input
        id={fid(name)}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={opts.required}
        maxLength={opts.maxLength}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? eid(name) : undefined}
        className={form.input}
      />
      {errors[name] ? (
        <p id={eid(name)} className={form.fieldError}>
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className={form.form} ref={formRef} noValidate>
      {errors[""] ? (
        <p role="alert" className={form.alert} tabIndex={-1} ref={alertRef}>
          {errors[""]}
        </p>
      ) : null}

      <div className={form.row}>
        {input("name", "Name", "text", "name", { required: true, maxLength: 120 })}
        {input("email", "Email", "email", "email", { required: true, maxLength: 254 })}
        {input("college_or_club", "College or club", "text", "organization", {
          required: true,
          wide: true,
          maxLength: 160,
        })}

        <div className={form.field}>
          <label className="label" htmlFor={fid("year")}>
            Year of study
            <span className={form.optional}> — optional</span>
          </label>
          <select
            id={fid("year")}
            name="year"
            defaultValue=""
            aria-invalid={errors.year ? true : undefined}
            aria-describedby={errors.year ? eid("year") : undefined}
            className={form.input}
          >
            <option value="">Select</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.year ? (
            <p id={eid("year")} className={form.fieldError}>
              {errors.year}
            </p>
          ) : null}
        </div>

        {input("city", "City", "text", "address-level2", { maxLength: 80 })}
      </div>

      <div className={form.honeypot} aria-hidden>
        <label htmlFor={fid("website")}>Website</label>
        <input
          id={fid("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={form.actions}>
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "Joining…" : "Join waitlist"}
        </button>
        <p className={`small muted ${form.aside}`}>
          Or write to{" "}
          <a href="mailto:support@navrobotec.com" className={form.link}>
            support@navrobotec.com
          </a>
          .
        </p>
      </div>
    </form>
  );
}

export default function WaitlistDialog({
  label = "Join waitlist",
  title,
  lede,
}: {
  label?: string;
  title: string;
  lede: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const close = useCallback(() => ref.current?.close(), []);

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
        className="btn btn-ghost"
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
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
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
            <p className="label label-signal">Waitlist</p>
            <h2 id={titleId} className={`h2 ${styles.title}`}>
              {title}
            </h2>
            <p className={`body ${styles.lede}`}>{lede}</p>
          </header>

          {open ? <WaitlistForm /> : null}
        </div>
      </dialog>
    </>
  );
}
