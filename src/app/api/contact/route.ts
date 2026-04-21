import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "nigelburt@gmail.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Website Contact <onboarding@resend.dev>";

  if (!resendApiKey) {
    return NextResponse.json({ error: "Contact form is not configured yet." }, { status: 500 });
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const company = asTrimmedString(payload.company);
  if (company) {
    // Honeypot: silently accept bot submissions.
    return NextResponse.json({ ok: true });
  }

  const name = asTrimmedString(payload.name);
  const email = asTrimmedString(payload.email);
  const subject = asTrimmedString(payload.subject);
  const message = asTrimmedString(payload.message);

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Website enquiry: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    }),
  });

  if (!resendResponse.ok) {
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
