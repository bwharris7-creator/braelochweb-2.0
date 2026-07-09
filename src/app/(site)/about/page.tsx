import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About — The Braeloch Story",
  description:
    "Braeloch Brewing: your third place. A family story from Keuka Lake, poured in a 1903 trolley barn in Kennett Square.",
};

/**
 * About page (PLAN.md §4 /about) — real copy migrated from the current
 * site's Story / Building History / Brewhouse pages (2026-07-02).
 */

const gallery = [
  { src: "/images/lounge.webp", alt: "Leather couches under the hand-painted Braeloch mural" },
  { src: "/images/sign.webp", alt: "The Braeloch Brewing sign on the brick facade" },
  { src: "/images/dog.webp", alt: "A regular of the four-legged variety" },
  { src: "/images/taps.webp", alt: "Braeloch tap handles at the bar" },
  { src: "/images/hat-wall.webp", alt: "The hat wall above the tanks" },
  { src: "/images/taproom.webp", alt: "The taproom on a packed night" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Your Third Place"
        subtitle="Not home. Not work. Somewhere in between — with great craft beer."
      />

      {/* Story — real copy from the current site */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-lg leading-relaxed text-charcoal/80">
          <p>
            <strong className="text-forest">What is Braeloch?</strong> We hear that question all
            the time. To us, Braeloch is our third place. It&rsquo;s not home or work but
            somewhere in between. It&rsquo;s the love of craft beer and enjoying this love with
            friends, both new and old — a place where community can come for great craft beer,
            local food, and to hang out and enjoy what life has to offer.
          </p>
          <p>
            The name comes from a family home on Keuka Lake in the Finger Lakes. That home was a
            gathering place — reunions, relaxing, talking, having fun. A place to unwind and get
            away from life&rsquo;s worries and the weight of the world. We strive to bring that
            same experience to Kennett Square.
          </p>
          <p>
            <strong className="text-forest">Who are we?</strong> Owners Kent and Amy Steeves are
            beer lovers from way back. We met in college over beer, discussed what jobs to accept
            while drinking beer, and ultimately decided to start our own craft brewery over a
            beer.
          </p>
          <p>
            As home brewers, we loved to share our beer — in fact, we <em>needed</em> to share our
            beer so we could make more. In 2017, after much searching, we found our building.
            &ldquo;Found,&rdquo; as in it took almost two years to make the building our home. On
            March 1, 2019 we opened our doors, and we&rsquo;ve loved every minute of sharing our
            passion since.
          </p>
          <p className="font-medium text-forest">
            We hope you&rsquo;ll find Braeloch your third place too — where life is simple, escape
            is effortless, and every moment feels like Welcome Home.
          </p>
        </div>
      </section>

      {/* Building history — real copy */}
      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl shadow-hero">
            <Image
              src="/images/facade.webp"
              alt="The 1903 trolley barn that houses Braeloch, BREWERY sign over the old trolley door"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              The Building
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              A 1903 trolley barn, reborn
            </h2>
            <div className="mt-4 space-y-4 text-cream/80">
              <p>
                The building went up in 1903 as a trolley barn for the Interurban train cars that
                traversed Kennett Square — four garage doors welcomed trolleys in for service.
                Later it housed the Mushroom Growers Association, supplying growers nationwide
                with equipment and spores.
              </p>
              <p>
                After a fire in the 1980s and decades of other tenants, Braeloch became just the
                fourth occupant in the building&rsquo;s history. Eighteen months of construction
                later, we opened our doors on March 1, 2019.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brewhouse — real copy */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-dark">
            The Brewhouse
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest">
            10 barrels, three vessels, endless rotation
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-charcoal/70">
            Braeloch runs a 10bbl, 3-vessel brewhouse designed and built for us in the USA by
            Practical Fusion in Oregon. The cellar holds four 10bbl fermentors matched by four
            brite tanks — room to brew multiple batches a week and let lagers condition as long
            as they need.
          </p>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl shadow-card">
          <Image
            src="/images/brewhouse.webp"
            alt="Stainless fermentors under the brick arches of the tank room"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-forest">
          Around the brewery
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((g) => (
            <div key={g.src} className="relative aspect-square overflow-hidden rounded-xl shadow-card">
              <Image
                src={g.src}
                alt={g.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(min-width: 768px) 33vw, 50vw"
              />
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
