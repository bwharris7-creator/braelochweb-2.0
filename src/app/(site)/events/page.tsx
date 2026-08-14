import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";
import {
  eventsJsonLd,
  fmtEventDate,
  fmtEventTime,
  getUpcomingEvents,
  type EventInstance,
  type EventKind,
} from "@/lib/events";

export const metadata: Metadata = {
  title: "Events — Live Music & More",
  description: "Live music, open mic nights, and events at Braeloch Brewing in Kennett Square.",
};

/**
 * Events page (PLAN.md §4 /events) — LIVE from the Common Ninja calendar,
 * revalidated hourly. Staff keep updating the calendar exactly as before;
 * this page keeps up on its own.
 */

const kindColor: Record<EventKind, string> = {
  "Live Music": "bg-gold/15 text-gold-dark",
  Community: "bg-loch/20 text-forest",
  "Off-Site": "bg-brick/15 text-brick",
  Event: "bg-forest/10 text-forest",
};

function SourceUnavailable() {
  return (
    <div className="rounded-xl border-2 border-dashed border-brick/40 p-10 text-center">
      <h2 className="font-display text-2xl font-bold text-forest">
        The calendar is catching its breath
      </h2>
      <p className="mx-auto mt-2 max-w-md text-charcoal/60">
        We couldn&rsquo;t load the events feed just now. Check our{" "}
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-forest underline hover:text-gold-dark"
        >
          Instagram
        </a>{" "}
        for what&rsquo;s happening, or try again in a minute.
      </p>
    </div>
  );
}

function FeaturedEvent({ e }: { e: EventInstance }) {
  return (
    <div className="rounded-xl bg-forest p-8 text-cream shadow-hero sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          {fmtEventDate(e)} · {fmtEventTime(e)}
        </p>
        <h3 className="mt-2 font-display text-3xl font-bold">{e.title}</h3>
        {e.description && (
          <p className="mt-3 line-clamp-2 max-w-xl whitespace-pre-line text-cream/80">
            {e.description}
          </p>
        )}
      </div>
      <span className="mt-4 inline-block shrink-0 rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-forest sm:mt-0">
        {e.kind}
      </span>
    </div>
  );
}

export default async function EventsPage() {
  const events = await getUpcomingEvents(30);
  const featured = events?.[0];
  const rest = events?.slice(1) ?? [];

  return (
    <>
      <PageHero
        eyebrow="What's Happening"
        title="Live Music & Events"
        subtitle="Something's always on — weekly live music, open mic nights, and the occasional blood drive between beers."
      />

      {events !== null && events.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd(events)) }}
        />
      )}

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 pt-8 sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1.5 text-xs font-medium text-forest">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gold" aria-hidden />
          Live from our events calendar · updates hourly
        </p>
        <Link
          href="/private-events"
          className="rounded-full border border-forest/20 px-4 py-1.5 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          Hosting your own? Book a private event →
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {events === null ? (
          <SourceUnavailable />
        ) : events.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-card">
            <h2 className="font-display text-2xl font-bold text-forest">
              Nothing on the books — yet
            </h2>
            <p className="mt-2 text-charcoal/60">
              New events land here as soon as they&rsquo;re scheduled.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold text-forest">Up Next</h2>
            <div className="mt-4">{featured && <FeaturedEvent e={featured} />}</div>

            {rest.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-2xl font-bold text-forest">Coming Up</h2>
                <div className="mt-4 divide-y divide-cream-dark overflow-hidden rounded-xl bg-white shadow-card">
                  {rest.map((e) => (
                    <div key={e.id} className="flex flex-wrap items-center gap-3 px-6 py-4 sm:gap-6">
                      <div className="w-28 shrink-0">
                        <p className="font-semibold text-charcoal">{fmtEventDate(e)}</p>
                        <p className="text-sm text-charcoal/60">{fmtEventTime(e)}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-charcoal">{e.title}</p>
                        {e.location && (
                          <p className="truncate text-sm text-charcoal/50">{e.location}</p>
                        )}
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${kindColor[e.kind]}`}
                      >
                        {e.kind}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
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
            <Link
              href="/private-events"
              className="mt-8 inline-block rounded-md bg-gold px-8 py-3 font-semibold text-forest transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-card-hover"
            >
              Start an Inquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
