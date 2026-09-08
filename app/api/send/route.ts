import { EmailTemplate } from '../../../components/EmailTemplate';
import { Resend } from 'resend';
import * as React from 'react';

/* Constructed per request, not at module scope.
 *
 * At module scope this runs during `next build` — Next evaluates the module to
 * collect page data — and the Resend constructor throws when the key is
 * absent, so the whole build fails with "Missing API key". An API key is a
 * runtime concern: requiring it to compile means CI and every container build
 * need the production secret in hand before they can produce an artefact.
 *
 * Missing at runtime is a different matter, and answered honestly below
 * rather than by a crash. */
function mailer(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, project } = body;

    console.log('Incoming Inquiry:', { firstName, lastName, email });

    if (!firstName || !lastName || !email || !project) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resend = mailer();
    if (!resend) {
      // Loud in the log, and honest to the caller: the enquiry did not get
      // through, so do not tell them it did.
      console.error('RESEND_API_KEY is not set — inquiry not delivered');
      return Response.json(
        { error: 'Mail is not configured on this server' },
        { status: 503 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Navrobotec <support@navrobotec.com>',
      to: ['support@navrobotec.com'],
      subject: `New Inquiry from ${firstName} ${lastName}`,
      react: EmailTemplate({ firstName, lastName, email, project }) as React.ReactElement,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return Response.json({ error }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Unexpected API Error:', error);
    return Response.json({ error }, { status: 500 });
  }
}
