import { NextResponse } from "next/server";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Private-event inquiry intake (PLAN.md Phase 3).
 * Writes an eventInquiry document to Sanity so submissions appear in /studio.
 * Requires SANITY_API_WRITE_TOKEN (server-only Editor token) — returns 503
 * with a fallback hint when unset so the form can degrade to mailto.
 */

const MAX = 2000;

export async function POST(req: Request) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId) {
    return NextResponse.json({ error: "form-not-configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const field = (k: string) => String(body[k] ?? "").trim().slice(0, MAX);
  const name = field("name");
  const email = field("email");
  if (!name || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: "name-and-valid-email-required" }, { status: 400 });
  }

  const doc = {
    _type: "eventInquiry",
    name,
    email,
    phone: field("phone"),
    company: field("company"),
    textConsent: field("textConsent"),
    eventType: field("eventType"),
    eventDate: field("eventDate"),
    eventStartTime: field("eventStartTime"),
    headcount: field("headcount"),
    budget: field("budget"),
    message: field("message"),
    submittedAt: new Date().toISOString(),
    handled: false,
  };

  const res = await fetch(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ mutations: [{ create: doc }] }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "storage-failed" }, { status: 502 });
  }

  // Alert the events coordinator (best-effort: the inquiry is already saved,
  // so an email failure must never fail the submission).
  await sendAlert(doc).catch(() => {});

  return NextResponse.json({ ok: true });
}

/** Email alert via Resend. Skips silently until RESEND_API_KEY + INQUIRY_ALERT_TO are set. */
async function sendAlert(doc: {
  name: string;
  email: string;
  phone: string;
  company: string;
  textConsent: string;
  eventType: string;
  eventDate: string;
  eventStartTime: string;
  headcount: string;
  budget: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_ALERT_TO;
  if (!apiKey || !to) return;
  const from = process.env.INQUIRY_ALERT_FROM ?? "Braeloch Website <inquiries@braelochbrewing.beer>";

  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:4px 12px 4px 0;color:#6b4632;font-weight:600">${label}</td><td style="padding:4px 0">${value}</td></tr>` : "";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: doc.email,
      subject: `Special Event Request — ${doc.name}${doc.eventType ? ` (${doc.eventType})` : ""}${doc.eventDate ? ` · ${doc.eventDate}` : ""}`,
      html: `
        <div style="font-family:sans-serif;color:#211e1b;max-width:560px">
          <h2 style="color:#1f3d2b">New Special Event Request</h2>
          <table style="border-collapse:collapse">
            ${row("Contact name", doc.name)}
            ${row("Company", doc.company)}
            ${row("Email", doc.email)}
            ${row("Phone", doc.phone)}
            ${row("OK to text?", doc.textConsent)}
            ${row("Event type", doc.eventType)}
            ${row("Requested date", doc.eventDate)}
            ${row("Start time", doc.eventStartTime)}
            ${row("Number of guests", doc.headcount)}
            ${row("Estimated budget", doc.budget)}
          </table>
          ${doc.message ? `<p style="white-space:pre-line;border-left:3px solid #c3a126;padding-left:12px">${doc.message}</p>` : ""}
          <p style="color:#6b4632;font-size:13px">Reply directly to this email to answer ${doc.name}.
          Track all inquiries in the <a href="https://braeloch.vercel.app/studio">menu &amp; inquiries editor</a> (mark handled when done).</p>
        </div>`,
    }),
  });
}
