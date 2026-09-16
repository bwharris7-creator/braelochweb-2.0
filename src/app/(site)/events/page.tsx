import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EventList from "@/components/EventList";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";
import { eventsJsonLd, getUpcomingEvents, toEventCard } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events — Live Music & More",
  description: "Live music, open mic nights, and events at Braeloch Brewing in Kennett Square.",
};

/**
 * Events page (PLAN.md §4 /events) — LIVE from the Common Ninja calendar,
 * revalidated hourly. Staff keep updating the calendar exactly as before;
 * this page keeps up on its own.
 */

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

export default async function EventsPage() {
  const events = await getUpcomingEvents(30);

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
          <EventList events={events.map(toEventCard)} />
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
              Hosting something? We&rsquo;ve got the room.
            </h2>
            <p className="mt-4 text-lg text-cream/90">
              Birthdays, showers, team outings, rehearsal dinners — book the Bowling Alley Room,
              a corner of the Tap Room, or Creekside for parties from 10 to 100+ guests.
            </p>
            <Link
              href="/private-events"
              className="mt-8 inline-block rounded-md bg-gold px-8 py-3 font-semibold text-forest transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-card-hover"
            >
              Book Your Event
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
