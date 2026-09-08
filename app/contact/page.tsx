"use client";

import { useState } from "react";
import Cinematic from "@/components/Cinematic";
import styles from "./page.module.css";

/* The one page here that genuinely needs to be a client component: it posts a
   form and reports what happened.
 *
 * The old one told the sender "Something went wrong. Please try again." for
 * every failure, including the one where the server has no mail key and no
 * amount of trying again will help. It now says which it was, and always
 * leaves the address — the thing that works when this form does not. */

const FIELDS = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name", required: true },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true, wide: true },
];

const DETAILS = [
  { k: "Email", v: "support@navrobotec.com", href: "mailto:support@navrobotec.com" },
  { k: "Phone", v: "+91 95969 17316", href: "tel:+919596917316" },
  { k: "Based in", v: "Ghaziabad, India" },
];

type Status = "idle" | "sending" | "sent" | "failed" | "unconfigured";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    project: "",
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("sent");
        setForm({ firstName: "", lastName: "", email: "", project: "" });
        return;
      }
      /* 503 is the server saying it has no mail key. Retrying will not fix
         that, so do not suggest it. */
      setStatus(response.status === 503 ? "unconfigured" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  const set = (name: string, value: string) =>
    setForm((current) => ({ ...current, [name]: value }));

  return (
    <div className="page-flush">
      <Cinematic
        kicker="Contact"
        title={<>Tell us what you want it to fly.</>}
        lede="Collaborations, developer integrations, pilot programmes, or a question about the stack — all reach the same inbox, and an engineer answers."
      />

      <section className="section">
        <div className="shell">
          <div className={styles.layout}>
            <div className={styles.formCol}>
              {status === "sent" ? (
                <div className={styles.done}>
                  <p className="label label-signal">Received</p>
                  <h2 className="h2">Thank you — that reached us.</h2>
                  <p className="body">
                    An engineer reads it and writes the reply. If it is urgent,{" "}
                    <a href="mailto:support@navrobotec.com" className={styles.link}>
                      support@navrobotec.com
                    </a>{" "}
                    goes to the same place.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className={styles.form} noValidate={false}>
                  {status === "failed" ? (
                    <p role="alert" className={styles.alert}>
                      That did not send. Please try again, or write to{" "}
                      <a href="mailto:support@navrobotec.com" className={styles.link}>
                        support@navrobotec.com
                      </a>
                      .
                    </p>
                  ) : null}
                  {status === "unconfigured" ? (
                    <p role="alert" className={styles.alert}>
                      Mail is not configured on this server, so this form cannot
                      deliver right now — trying again will not help. Please
                      write to{" "}
                      <a href="mailto:support@navrobotec.com" className={styles.link}>
                        support@navrobotec.com
                      </a>{" "}
                      instead.
                    </p>
                  ) : null}

                  <div className={styles.row}>
                    {FIELDS.map((field) => (
                      <label
                        key={field.name}
                        className={`${styles.field} ${field.wide ? styles.wide : ""}`}
                      >
                        <span className="label">
                          {field.label}
                          {field.required ? (
                            <span aria-hidden className={styles.required}>
                              {" "}*
                            </span>
                          ) : null}
                        </span>
                        <input
                          className={styles.input}
                          type={field.type}
                          name={field.name}
                          autoComplete={field.autoComplete}
                          required={field.required}
                          value={form[field.name as keyof typeof form]}
                          onChange={(e) => set(field.name, e.target.value)}
                        />
                      </label>
                    ))}
                  </div>

                  <label className={styles.field}>
                    <span className="label">
                      What are you building?
                      <span aria-hidden className={styles.required}> *</span>
                    </span>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      name="project"
                      rows={6}
                      required
                      value={form.project}
                      onChange={(e) => set("project", e.target.value)}
                    />
                  </label>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending…" : "Send"}
                  </button>
                </form>
              )}
            </div>

            <aside className={styles.detailsCol}>
              <dl className={styles.details}>
                {DETAILS.map((detail) => (
                  <div key={detail.k} className={styles.detail}>
                    <dt className="label">{detail.k}</dt>
                    <dd className={styles.detailValue}>
                      {detail.href ? (
                        <a href={detail.href} className={styles.link}>
                          {detail.v}
                        </a>
                      ) : (
                        detail.v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
