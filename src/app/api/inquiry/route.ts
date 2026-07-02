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
    eventDate: field("eventDate"),
    headcount: field("headcount"),
    eventType: field("eventType"),
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
  return NextResponse.json({ ok: true });
}
