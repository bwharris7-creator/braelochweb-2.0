"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

/** Private-event inquiry form → POST /api/inquiry → Sanity (visible in /studio). */
export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-card">
        <h3 className="font-display text-2xl font-bold text-forest">Got it — talk soon! 🍻</h3>
        <p className="mt-2 text-charcoal/70">
          Your inquiry is in. We&rsquo;ll get back to you within a couple of days.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-md border-2 border-cream-dark bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl bg-white p-8 shadow-card">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-charcoal">
            Name *
          </label>
          <input id="name" name="name" required className={input} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
            Email *
          </label>
          <input id="email" name="email" type="email" required className={input} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-charcoal">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={input} />
        </div>
        <div>
          <label htmlFor="eventDate" className="mb-1.5 block text-sm font-medium text-charcoal">
            Requested date
          </label>
          <input id="eventDate" name="eventDate" type="date" className={input} />
        </div>
        <div>
          <label htmlFor="headcount" className="mb-1.5 block text-sm font-medium text-charcoal">
            Headcount (rough is fine)
          </label>
          <input id="headcount" name="headcount" inputMode="numeric" className={input} />
        </div>
        <div>
          <label htmlFor="eventType" className="mb-1.5 block text-sm font-medium text-charcoal">
            Event type
          </label>
          <select id="eventType" name="eventType" className={input} defaultValue="">
            <option value="" disabled>
              Choose one…
            </option>
            <option>Birthday</option>
            <option>Corporate event</option>
            <option>Wedding / rehearsal</option>
            <option>Fundraiser</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-charcoal">
          Tell us about it
        </label>
        <textarea id="message" name="message" rows={4} className={input} />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-gold px-8 py-3 font-semibold text-forest transition-all hover:-translate-y-px hover:bg-gold-dark hover:shadow-card-hover disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send Inquiry"}
      </button>

      {status === "error" && (
        <p className="text-sm text-brick">
          Hmm, that didn&rsquo;t go through. Email us instead at{" "}
          <a href={`mailto:${site.email}?subject=Private%20Event%20Inquiry`} className="font-semibold underline">
            {site.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
