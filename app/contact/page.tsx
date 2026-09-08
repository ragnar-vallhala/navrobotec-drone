import Cinematic from "@/components/Cinematic";
import EnquiryForm from "@/components/EnquiryForm";
import styles from "./page.module.css";

/* No longer a client component: the form is, and it is the only part that
   needed to be.
 *
 * It used to post to a Next route at /api/send, which sent mail through
 * Resend. Two things were wrong with that. nginx routes /api/ to the API on
 * every vhost, so the request never reached Next — it got the API's 404 and
 * the visitor was told "That did not send." And the route needed a mail key
 * that is not set in any deployment here, so even reachable it would have
 * answered 503. Every enquiry from this page has been lost for as long as the
 * site has been behind the proxy. It posts to the API now, like the services
 * site does, and the row is durable before anyone is told it worked. */

export const metadata = {
  title: "Contact",
  description:
    "Collaborations, developer integrations, pilot programmes, or a question about the VaiOS flight stack.",
};

/* These labels are stored as written — they have to match kInterests in
   api/src/domain/Enquiry.cc or the value is dropped on the way in. */
const TOPICS = [
  "Flight controller hardware",
  "VaiOS & scheduling",
  "NavHAL porting",
  "Autonomy & swarms",
  "Pilot programme",
  "Research collaboration",
  "Careers",
  "Something else",
];

const DETAILS = [
  { k: "Email", v: "support@navrobotec.com", href: "mailto:support@navrobotec.com" },
  { k: "Phone", v: "+91 95969 17316", href: "tel:+919596917316" },
  { k: "Based in", v: "Ghaziabad, India" },
];

export default function Contact() {
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
              <EnquiryForm
                source="contact"
                fields={[
                  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
                  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
                  { name: "company", label: "Company or team", type: "text", autoComplete: "organization", wide: true },
                ]}
                interests={{ legend: "What is this about?", options: TOPICS }}
                message={{
                  label: "What are you building?",
                  placeholder:
                    "The aircraft, the platform, the constraint you are up against — whatever an engineer would need to give you a useful first answer.",
                }}
                submit="Send"
                done={{
                  title: "Thank you — that reached us.",
                  body: "An engineer reads it and writes the reply. If it is urgent, support@navrobotec.com goes to the same place.",
                }}
              />
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
