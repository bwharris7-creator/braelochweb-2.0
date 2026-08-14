import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Private Events — Book the Space",
  description:
    "Host your celebration at Braeloch Brewing in Kennett Square — the Bowling Alley Room, Tap Room, or Creekside beer garden. Parties from 10 to 100+ guests.",
};

/**
 * Private events page (PLAN.md §4) — real venue content migrated from the old
 * site (spaces, capacities, fees, event types) + the Special Event Request form.
 */

const spaces = [
  {
    name: "Bowling Alley Room",
    blurb:
      "Our private room, built around a table reclaimed from an old bowling lane. Doors close, popcorn machine included.",
    seats: "Seats 20",
    capacity: "Max 25 guests",
    fee: "$25/hr",
    image: "/images/bowling-alley.webp",
    alt: "The Bowling Alley Room's long reclaimed-lane table with seating for twenty",
  },
  {
    name: "Tap Room",
    blurb:
      "The left back area of the main tap room — semi-private, in the thick of the atmosphere, with the bar a few steps away.",
    seats: "Seats ~50",
    capacity: "~75 mingling",
    fee: "No rental fee",
    image: "/images/event-taproom.webp",
    alt: "The back area of the Braeloch tap room set up for a gathering",
  },
  {
    name: "Creekside",
    blurb:
      "Our beer garden extension along the grass and creek. Open air, string lights, room to roam — and dogs are welcome.",
    seats: "Seats ~35",
    capacity: "Plenty of mingling space",
    fee: "No rental fee",
    image: "/images/creekside.webp",
    alt: "The Creekside beer garden extension along the grass and creek",
  },
];

const eventTypes = [
  "Anniversaries",
  "Engagement Celebrations",
  "Rehearsal Dinners",
  "Reunions",
  "Retirements",
  "Baby Showers",
  "Wedding Showers",
  "Team Building",
  "Birthdays",
  "Graduations",
  "Corporate Happy Hours",
  "Sales Meetings",
  "Pre/Post Wedding Socials",
  "Post-Reception Parties",
  "Get Out Of The House!",
];

export default function PrivateEventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Private Events"
        title="Throw it at the brewery"
        subtitle="Private events are hosted throughout the year, with party sizes from 10 to 100+ guests."
      />

      {/* Spaces */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-forest">
          Three spaces to choose from
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {spaces.map((s) => (
            <div
              key={s.name}
              className="overflow-hidden rounded-xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-forest">{s.name}</h3>
                  <span className="shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-dark">
                    {s.fee}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-brick">
                  {s.seats} · {s.capacity}
                </p>
                <p className="mt-3 text-charcoal/70">{s.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event types */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            What people book us for
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Just about any excuse to gather
          </h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {eventTypes.map((t) => (
              <li
                key={t}
                className="rounded-full border border-cream/25 px-4 py-1.5 text-sm text-cream/90"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Special Event Request form */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-forest">
          Special Event Request
        </h2>
        <p className="mt-2 text-center text-charcoal/60">
          Tell us what you&rsquo;re planning and our events coordinator will follow up with
          real answers.
        </p>
        <div className="mt-8">
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
