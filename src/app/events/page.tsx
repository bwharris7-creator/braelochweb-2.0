import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events — Live Music & More",
  description: "Live music, open mic nights, and events at Braeloch Brewing in Kennett Square.",
};

/**
 * Events page shell (PLAN.md §4 /events).
 * DESIGN PHASE: these are REAL events from the current Common Ninja calendar
 * (verified 2026-07-01) rendered as static content — Phase 2 makes this
 * self-updating from the same source.
 */

const upcoming = [
  { date: "Fri, Jul 3", time: "5–8pm", title: "Live Music: Steve Liberace", kind: "Live Music" },
  { date: "Sat, Jul 11", time: "6–9pm", title: "Live Music: Dog Paw", kind: "Live Music" },
  { date: "Sun, Jul 12", time: "2–5pm", title: "Live Music: Allison Landon", kind: "Live Music" },
  { date: "Sat, Jul 18", time: "6–9pm", title: "Live Music: JamNJames", kind: "Live Music" },
  { date: "Sun, Jul 19", time: "2–5pm", title: "Live Music: Jim Nelson", kind: "Live Music" },
  { date: "Sat, Jul 25", time: "6–9pm", title: "Live Music: Just a Bit Outside", kind: "Live Music" },
  { date: "Thu, Jul 30", time: "5:30pm", title: "Open Mic Night", kind: "Community" },
  { date: "Sun, Aug 2", time: "2–5pm", title: "Live Music: Acoustic Ferrari", kind: "Live Music" },
  { date: "Sat, Aug 8", time: "All Day", title: "Braeloch @ Festival of Flight Air Show", kind: "Off-Site" },
  { date: "Sat, Aug 22", time: "12–4pm", title: "Braeloch Blood Drive", kind: "Community" },
];

const kindColor: Record<string, string> = {
  "Live Music": "bg-gold/15 text-gold-dark",
  Community: "bg-loch/20 text-forest",
  "Off-Site": "bg-brick/15 text-brick",
};

export default function EventsPage() {
  const thisWeekend = upcoming.slice(0, 1);
  const rest = upcoming.slice(1);

  return (
    <>
      <PageHero
        eyebrow="What's Happening"
        title="Live Music & Events"
        subtitle="Something's always on — weekly live music, open mic nights, and the occasional blood drive between beers."
      />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-loch/20 px-4 py-1.5 text-xs font-medium text-forest">
          <span className="h-2 w-2 rounded-full bg-loch" aria-hidden />
          Real events from the current calendar — auto-updating in Phase 2
        </p>
      </div>

      {/* This weekend */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-forest">This Weekend</h2>
        <div className="mt-4">
          {thisWeekend.map((e) => (
            <div
              key={e.title}
              className="rounded-xl bg-forest p-8 text-cream shadow-hero sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-gold">
                  {e.date} · {e.time}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold">{e.title}</h3>
              </div>
              <span className="mt-4 inline-block rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-forest sm:mt-0">
                {e.kind}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming list */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-forest">Coming Up</h2>
        <div className="mt-4 divide-y divide-cream-dark overflow-hidden rounded-xl bg-white shadow-card">
          {rest.map((e) => (
            <div key={e.title} className="flex flex-wrap items-center gap-3 px-6 py-4 sm:gap-6">
              <div className="w-28 shrink-0">
                <p className="font-semibold text-charcoal">{e.date}</p>
                <p className="text-sm text-charcoal/60">{e.time}</p>
              </div>
              <p className="flex-1 font-medium text-charcoal">{e.title}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${kindColor[e.kind]}`}>
                {e.kind}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Private events */}
      <section className="relative text-cream">
        <Image
          src="/images/taproom.webp"
          alt="The Braeloch taproom filled with guests"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/75" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Private Events
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              A massive rustic space for your thing
            </h2>
            <p className="mt-4 text-lg text-cream/90">
              Birthdays, corporate events, weddings — the taproom, mezzanine, and beer garden can
              host groups from a dozen to a few hundred.
            </p>
            <a
              href={`mailto:${site.email}?subject=Private%20Event%20Inquiry`}
              className="mt-8 inline-block rounded-md bg-gold px-8 py-3 font-semibold text-forest transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-card-hover"
            >
              Start an Inquiry
            </a>
            <p className="mt-3 text-sm text-cream/60">
              (A proper booking form replaces this in Phase 3.)
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
