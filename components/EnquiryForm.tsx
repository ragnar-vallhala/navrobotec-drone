"use client";

import { useState } from "react";
import styles from "./EnquiryForm.module.css";

/* The form, for both places on this site that ask for something.
 *
 * It posts to the same API the services site posts to, so an enquiry from
 * either front lands in one place and shows up in the console with the site
 * it came from. Two things were wrong before:
 *
 *   • /investors embedded a Google form in an iframe. Nothing it collected
 *     ever reached the enquiries table, so the console's investor count was
 *     zero however many people filled it in, and the answers lived in a
 *     spreadsheet nobody on the site could see.
 *   • /contact posted to a Next route at /api/send. nginx routes /api/ to
 *     the API for every vhost, so that request never reached Next at all —
 *     it got the API's 404 and the visitor was told "That did not send."
 *     It had been dead for as long as it had been behind the proxy.
 *
 * The API is the authority on what is valid: nothing is checked here that the
 * server does not check, so the two can never disagree. Field errors come
 * back keyed by the `name` attributes below and are shown against the input
 * they belong to.
 */

/* Same origin behind the proxy, so this is empty in every deployment the
   stack builds. */
const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export type EnquiryField = {
  name: "name" | "email" | "company";
  label: string;
  type: "text" | "email";
  autoComplete: string;
  required?: boolean;
  wide?: boolean;
};

export type EnquiryFormProps = {
  /** Which entry point this is. Must be one of the API's kSources. */
  source: "contact" | "investor" | "wishlist";
  fields: EnquiryField[];
  /** Multi-select chips, stored as `interests`. */
  interests?: { legend: string; options: string[] };
  /** Chips to start with, for a link that arrives already saying what it is
      about. Anything not in `interests.options` is dropped: the value comes
      off a URL, and anyone can type one into it. */
  defaultInterests?: string[];
  /** Single-select, stored as `budget`. */
  budget?: { legend: string; options: string[] };
  message: { label: string; placeholder: string; rows?: number };
  submit: string;
  /** Shown in place of the form once the API has the enquiry. */
  done: { title: string; body: React.ReactNode };
};

export default function EnquiryForm({
  source,
  fields,
  interests,
  defaultInterests,
  budget,
  message,
  submit,
  done,
}: EnquiryFormProps) {
  const [chosen, setChosen] = useState<string[]>(() =>
    (defaultInterests ?? []).filter((label) =>
      (interests?.options ?? []).includes(label),
    ),
  );
  const [band, setBand] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [reference, setReference] = useState("");
  /* Keyed by field name, plus "" for anything not about one field. */
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (value: string) =>
    setChosen((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(event.currentTarget);

    setSending(true);
    setErrors({});

    try {
      const response = await fetch(`${API}/api/v1/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          company: String(data.get("company") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          /* Hidden from people, filled in by bots. The API accepts a post
             with this set and quietly discards it. */
          website: String(data.get("website") ?? ""),
          interests: chosen,
          budget: band,
          source,
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        const fields = body?.error?.fields as
          | { field: string; message: string }[]
          | undefined;
        setErrors(
          fields?.length
            ? Object.fromEntries(fields.map((f) => [f.field, f.message]))
            : {
                "":
                  body?.error?.message ??
                  "Something went wrong sending that. Please try again, or write to us directly.",
              },
        );
        return;
      }

      setReference(String(body?.data?.id ?? ""));
      setSent(true);
    } catch {
      /* Offline, blocked, or the API is down. Say so, and give the address —
         the one thing that works without us. */
      setErrors({
        "":
          "We could not reach the server. Please check your connection, or write to support@navrobotec.com.",
      });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className={styles.done}>
        <p className="label label-signal">Received</p>
        <h2 className="h2">{done.title}</h2>
        <p className="body">{done.body}</p>
        {reference ? (
          <p className={`data ${styles.reference}`}>
            Reference {reference.slice(0, 8)}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      {errors[""] ? (
        <p role="alert" className={styles.alert}>
          {errors[""]}
        </p>
      ) : null}

      <div className={styles.row}>
        {fields.map((field) => (
          <div
            key={field.name}
            className={`${styles.field} ${field.wide ? styles.wide : ""}`}
          >
            <label className="label" htmlFor={`f-${field.name}`}>
              {field.label}
              {field.required ? null : (
                <span className={styles.optional}> — optional</span>
              )}
            </label>
            <input
              id={`f-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required={field.required}
              aria-invalid={errors[field.name] ? true : undefined}
              aria-describedby={
                errors[field.name] ? `e-${field.name}` : undefined
              }
              className={styles.input}
            />
            {errors[field.name] ? (
              <p id={`e-${field.name}`} className={styles.fieldError}>
                {errors[field.name]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {interests ? (
        <fieldset className={styles.set}>
          <legend className="label">{interests.legend}</legend>
          <div className={styles.chips}>
            {interests.options.map((option) => {
              const on = chosen.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggle(option)}
                  aria-pressed={on}
                  className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {budget ? (
        <fieldset className={styles.set}>
          <legend className="label">{budget.legend}</legend>
          <div className={styles.chips}>
            {budget.options.map((option) => {
              const on = band === option;
              return (
                <button
                  key={option}
                  type="button"
                  /* Selecting the chosen one again clears it: the whole
                     field is optional, and a radio group with no way back to
                     "unanswered" makes a stray click permanent. */
                  onClick={() => setBand(on ? "" : option)}
                  aria-pressed={on}
                  className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {errors.budget ? (
            <p className={styles.fieldError}>{errors.budget}</p>
          ) : null}
        </fieldset>
      ) : null}

      <div className={styles.field}>
        <label className="label" htmlFor="f-message">
          {message.label}
        </label>
        <textarea
          id="f-message"
          name="message"
          rows={message.rows ?? 6}
          required
          placeholder={message.placeholder}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "e-message" : undefined}
          className={`${styles.input} ${styles.textarea}`}
        />
        {errors.message ? (
          <p id="e-message" className={styles.fieldError}>
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Left in the tab order for nobody: hidden from sight and from a
          screen reader, with autocomplete off so a password manager does
          not helpfully fill it in and get a real person discarded. */}
      <div className={styles.honeypot} aria-hidden>
        <label htmlFor="f-website">Website</label>
        <input
          id="f-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "Sending…" : submit}
        </button>
        <p className={`small muted ${styles.aside}`}>
          Or write to{" "}
          <a href="mailto:support@navrobotec.com" className={styles.link}>
            support@navrobotec.com
          </a>
          .
        </p>
      </div>
    </form>
  );
}
