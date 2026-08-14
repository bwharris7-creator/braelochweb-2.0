"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Special Event Request form → POST /api/inquiry → Sanity (visible in /studio)
 * + email alert to the events coordinator. Fields mirror the legacy Google Form
 * so nothing staff relied on is lost.
 */

const EVENT_TYPES = [
  "Anniversary",
  "Engagement Celebration",
  "Rehearsal Dinner",
  "Reunion",
  "Retirement",
  "Baby Shower",
  "Wedding Shower",
  "Team Building",
  "Birthday",
  "Graduation",
  "Corporate Happy Hour",
  "Sales Meeting",
  "Pre/Post Wedding Social",
  "Post-Reception Party",
  "Other",
];

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
          Your request is in. Our events coordinator will get back to you within a couple of
          days.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-md border-2 border-cream-dark bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none";
  const label = "mb-1.5 block text-sm font-medium text-charcoal";

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl bg-white p-8 shadow-card">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Contact Name *
          </label>
          <input id="name" name="name" required autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="company" className={label}>
            Company or Organization
          </label>
          <input id="company" name="company" autoComplete="organization" className={input} />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Contact Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Contact Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={input}
          />
        </div>
      </div>

      <fieldset>
        <legend className={label}>May we reach out via text messaging? *</legend>
        <div className="flex gap-6">
          {["Yes", "No"].map((v) => (
            <label key={v} className="flex items-center gap-2 text-charcoal">
              <input
                type="radio"
                name="textConsent"
                value={v}
                required
                className="h-4 w-4 accent-[var(--color-gold)]"
              />
              {v}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="eventType" className={label}>
            Event Type *
          </label>
          <select id="eventType" name="eventType" required className={input} defaultValue="">
            <option value="" disabled>
              Choose one…
            </option>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="headcount" className={label}>
            Number of Guests *
          </label>
          <input
            id="headcount"
            name="headcount"
            inputMode="numeric"
            required
            className={input}
          />
        </div>
        <div>
          <label htmlFor="eventDate" className={label}>
            Event Date *
          </label>
          <input id="eventDate" name="eventDate" type="date" required className={input} />
        </div>
        <div>
          <label htmlFor="eventStartTime" className={label}>
            Event Time — Start *
          </label>
          <input
            id="eventStartTime"
            name="eventStartTime"
            type="time"
            required
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="budget" className={label}>
          Estimated Total Budget
        </label>
        <input id="budget" name="budget" inputMode="decimal" className={input} />
        <p className="mt-1 text-xs text-charcoal/50">Including tax and 20% gratuity.</p>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Additional Information
        </label>
        <textarea id="message" name="message" rows={4} className={input} />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-gold px-8 py-3 font-semibold text-forest transition-all hover:-translate-y-px hover:bg-gold-dark hover:shadow-card-hover disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Submit Request"}
      </button>

      {status === "error" && (
        <p className="text-sm text-brick">
          Hmm, that didn&rsquo;t go through. Email us instead at{" "}
          <a
            href={`mailto:${site.email}?subject=Special%20Event%20Request`}
            className="font-semibold underline"
          >
            {site.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
