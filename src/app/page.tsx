import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Home — the "live hub" (PLAN.md §4).
 * Phase 1: structure + design system in place. The dynamic modules
 * (taps, this-weekend, social strip) get wired in Phase 2/3.
 */
export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl animate-fade-in-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-loch">
              Kennett Square, PA
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">
              Craft beer with a<span className="text-amber-ale"> Scottish soul</span>
            </h1>
            <p className="mt-6 text-xl text-cream/80">{site.tagline}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/beer"
                className="rounded-md bg-amber-ale px-8 py-3 text-center font-semibold text-cream transition-all hover:-translate-y-1 hover:bg-amber-ale-dark hover:shadow-card-hover"
              >
                What&rsquo;s on Tap
              </Link>
              <a
                href={site.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border-2 border-cream/40 px-8 py-3 text-center font-semibold text-cream transition-colors hover:border-cream hover:bg-cream/10"
              >
                Order Take-Out
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Three reasons to visit — skill's Feature Grid pattern, Braeloch-flavored */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-forest sm:text-4xl">
          A brewery built for lingering
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Dog-Friendly Beer Garden",
              body: "Bring the pup — open-air seating, Giggy Bites dog treats, and plenty of room to sprawl.",
            },
            {
              title: "Full Kitchen",
              body: "Shareables, flatbreads, tacos, and more from a full-service kitchen. Casual counter service, no reservations needed.",
            },
            {
              title: "Live Music & Events",
              body: "Weekly live music, open mic nights, and a massive rustic space you can book for your own celebration.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <h3 className="font-display text-xl font-semibold text-forest">{f.title}</h3>
              <p className="mt-2 text-charcoal/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic module placeholders — wired in Phase 2/3 */}
      <section className="bg-cream-dark/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-dashed border-heath/40 p-8 text-center">
              <h2 className="font-display text-2xl font-bold text-forest">On Tap Right Now</h2>
              <p className="mt-2 text-charcoal/60">
                Live tap list from Untappd lands here in Phase 2.
              </p>
            </div>
            <div className="rounded-xl border-2 border-dashed border-heath/40 p-8 text-center">
              <h2 className="font-display text-2xl font-bold text-forest">This Weekend</h2>
              <p className="mt-2 text-charcoal/60">
                Live events from the calendar land here in Phase 2.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
