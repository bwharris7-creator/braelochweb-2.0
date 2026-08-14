import Image from "next/image";
import Link from "next/link";
import OnTapNow from "@/components/OnTapNow";
import ThisWeekend from "@/components/ThisWeekend";
import { site } from "@/lib/site";

/**
 * Home — the "live hub" (PLAN.md §4).
 * Phase 1: structure + design system in place, real site imagery.
 * The dynamic modules (taps, this-weekend, social strip) get wired in Phase 2/3.
 */

const features = [
  {
    title: "Dog-Friendly Beer Garden",
    body: "Bring the pup — open-air seating, Giggy Bites dog treats, and plenty of room to sprawl.",
    image: "/images/dog.webp",
    alt: "A dog relaxing in the Braeloch beer garden",
  },
  {
    title: "Full Kitchen",
    body: "Shareables, flatbreads, tacos, and more from a full-service kitchen. Casual counter service, no reservations needed.",
    image: "/images/food.webp",
    alt: "A plated dish from the Braeloch kitchen",
  },
  {
    title: "Live Music & Events",
    body: "Weekly live music, open mic nights, and a massive rustic space you can book for your own celebration.",
    image: "/images/taproom.webp",
    alt: "The Braeloch taproom full of guests under exposed-brick arches",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero — beer garden at dusk, string lights doing the heavy lifting */}
      <section className="relative text-cream">
        <Image
          src="/images/beer-garden.webp"
          alt="Braeloch's brick beer garden at dusk, strung with warm lights"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/35 to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-40">
          <div className="max-w-2xl animate-fade-in-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Kennett Square, PA
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">
              Welcome to your<span className="text-gold"> third place</span>
            </h1>
            <p className="mt-6 text-xl text-cream/90">
              Not home. Not work. Craft beer, local food, and good company in a 1903 trolley barn
              in Kennett Square.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/beer"
                className="rounded-md bg-gold px-8 py-3 text-center font-semibold text-forest transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-card-hover"
              >
                What&rsquo;s on Tap
              </Link>
              <a
                href={site.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border-2 border-cream/50 px-8 py-3 text-center font-semibold text-cream transition-colors hover:border-cream hover:bg-cream/10"
              >
                Order Take-Out
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Three reasons to visit — skill's Feature Grid pattern with real photos */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-forest sm:text-4xl">
          A brewery built for lingering
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="overflow-hidden rounded-xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={f.image}
                  alt={f.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-forest">{f.title}</h3>
                <p className="mt-2 text-charcoal/70">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live modules: taps + events */}
      <section className="bg-cream-dark/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <OnTapNow />
            <ThisWeekend />
          </div>
        </div>
      </section>

      {/* Private events — booking entry point */}
      <section className="relative text-cream">
        <Image
          src="/images/bowling-alley.webp"
          alt="The Bowling Alley Room set for a private party"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/75" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Private Events
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Hosting something? We&rsquo;ve got the room.
            </h2>
            <p className="mt-4 text-lg text-cream/90">
              Birthdays, rehearsal dinners, corporate happy hours, showers — three spaces for
              parties from 10 to 100+ guests, starting at no rental fee.
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
