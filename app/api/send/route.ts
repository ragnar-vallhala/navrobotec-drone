import { EmailTemplate } from '../../../components/EmailTemplate';
import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, project } = body;

    console.log('Incoming Inquiry:', { firstName, lastName, email });

    if (!firstName || !lastName || !email || !project) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
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
