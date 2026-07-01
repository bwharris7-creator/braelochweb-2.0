import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About — The Braeloch Story",
  description:
    "The story of Braeloch Brewing: a Scottish-hearted brewery in a historic Kennett Square building.",
};

/**
 * About page shell (PLAN.md §4 /about).
 * DESIGN PHASE: story copy is placeholder scaffolding — real copy migrates
 * from the current site's Story/Building History/Brewhouse pages in Phase 0 §9C.
 */

const gallery = [
  { src: "/images/taproom.webp", alt: "The taproom on a packed night" },
  { src: "/images/beer-garden.webp", alt: "The beer garden at dusk" },
  { src: "/images/dog.webp", alt: "A regular of the four-legged variety" },
  { src: "/images/beer-pour.webp", alt: "Braeloch cans outside the brewery" },
  { src: "/images/food.webp", alt: "From the kitchen" },
  { src: "/images/hive-mind.webp", alt: "Hive Mind honey ale" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Brae. Loch. Brewing."
        subtitle="A hillside, a lake, and a very large brick building in Kennett Square."
      />

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose-lg space-y-6 text-charcoal/80">
          <p>
            <em>Brae</em> is Scots for hillside. <em>Loch</em>, you know. Put them together and
            you get the landscape our founders wanted to bottle: unhurried, generous, and best
            enjoyed in good company.
          </p>
          <p>
            [Design placeholder — the full founding story, the family history, and why Kennett
            Square, migrated from the current site in the content phase.]
          </p>
        </div>
      </section>

      {/* Building history */}
      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl shadow-hero">
            <Image
              src="/images/beer-garden.webp"
              alt="The historic brick building that houses Braeloch"
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
              A century of brick, now full of beer
            </h2>
            <p className="mt-4 text-lg text-cream/80">
              [Design placeholder — building history copy: the industrial past of 225 Birch
              Street, the restoration, the arched windows and exposed brick that give the
              taproom its bones.]
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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

      {/* 3D tour placeholder */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-xl border-2 border-dashed border-brick/40 p-10 text-center">
          <h2 className="font-display text-2xl font-bold text-forest">Walk through in 3D</h2>
          <p className="mt-2 text-charcoal/60">
            The existing 3D tour embed migrates here from the current site.
          </p>
        </div>
      </section>
    </>
  );
}
