import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Private Events — Book the Space",
  description:
    "Host your birthday, corporate event, or celebration at Braeloch Brewing — taproom, mezzanine, and beer garden in Kennett Square.",
};

/** Private events page (PLAN.md §4) — pitch + real inquiry form → /studio. */

const spaces = [
  {
    name: "The Taproom",
    blurb: "Exposed brick, arched windows, and the bar at the center of it all.",
  },
  {
    name: "The Mezzanine",
    blurb: "A semi-private perch above the action — ideal for parties of 20–50.",
  },
  {
    name: "The Beer Garden",
    blurb: "Open air, string lights, picnic tables, and room for the whole crowd (dogs included).",
  },
];

export default function PrivateEventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Private Events"
        title="Throw it at the brewery"
        subtitle="Birthdays, corporate events, rehearsal dinners, fundraisers — a massive rustic space with beer, food, and zero rental-hall energy."
      />

      {/* Spaces */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {spaces.map((s) => (
            <div key={s.name} className="rounded-xl bg-white p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-forest">{s.name}</h2>
              <p className="mt-2 text-charcoal/70">{s.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Atmosphere band */}
      <section className="relative text-cream">
        <Image
          src="/images/taproom.webp"
          alt="A packed private event in the Braeloch taproom"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            From a dozen friends to a few hundred
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream/90">
            Tell us what you&rsquo;re planning and we&rsquo;ll make the space work.
          </p>
        </div>
      </section>

      {/* Inquiry form */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-forest">
          Start the conversation
        </h2>
        <p className="mt-2 text-center text-charcoal/60">
          No commitment — just the basics so we can reply with real answers.
        </p>
        <div className="mt-8">
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
