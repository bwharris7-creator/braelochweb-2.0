import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";
import { getTapMenus, type Tap, type TapMenu } from "@/lib/taps";

export const metadata: Metadata = {
  title: "Beer — What's on Tap",
  description: "See what's pouring at Braeloch Brewing in Kennett Square, PA.",
};

/**
 * Beer page (PLAN.md §4 /beer) — live from the Untappd embed menu, organized
 * exactly like the source: Beers On Tap → style sections → beers, then
 * Cans & Bottles. Sample fallback (real Braeloch beers) if the source is down.
 */

const sampleMenus: TapMenu[] = [
  {
    name: "Beers On Tap",
    sections: [
      {
        name: "Sample Preview",
        items: [
          { name: "Grace Brewster Hopper", style: "New England IPA", abv: "5.8%", description: "Hazy, juicy, and soft — a tribute IPA loaded with tropical hop character.", labelUrl: null, untappdUrl: null, rating: null },
          { name: "Fat Oliver", style: "Belgian Pale Ale", abv: "7.0%", description: "Fruity Belgian yeast over a biscuity malt base. Deceptively easy drinking.", labelUrl: null, untappdUrl: null, rating: null },
          { name: "Further Down the Road", style: "Vienna Lager", abv: "6.0%", description: "Amber, toasty, clean — a classic Vienna built for long conversations.", labelUrl: null, untappdUrl: null, rating: null },
        ],
      },
    ],
  },
];

function TapCard({ beer }: { beer: Tap }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex items-start gap-4">
        {beer.labelUrl && (
          <Image
            src={beer.labelUrl}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl font-semibold text-forest">
              {beer.untappdUrl ? (
                <a
                  href={beer.untappdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-dark"
                >
                  {beer.name}
                </a>
              ) : (
                beer.name
              )}
            </h3>
            {beer.abv && (
              <span className="shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-dark">
                {beer.abv}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-brick">
            {beer.style}
          </p>
        </div>
      </div>
      {beer.description && (
        <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{beer.description}</p>
      )}
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z]+/g, "-");
}

const toGo = [
  { format: "16oz Singles & 4-Packs", note: "Mix and match from the cooler" },
  { format: "32oz Crowlers", note: "Canned fresh off the tap line" },
  { format: "32/64oz Growlers", note: "Bring yours back for a refill" },
  { format: "Cases", note: "For the truly committed" },
];

export default async function BeerPage() {
  const liveMenus = await getTapMenus();
  const menus = liveMenus ?? sampleMenus;
  const live = liveMenus !== null;

  return (
    <>
      <PageHero
        eyebrow="Let's Drink"
        title="What's on Tap"
        subtitle="Brewed on-site in small batches. Plus PA wine, hard cider, seltzers, and Athletic NA beer for the rest of the crew."
      />

      {/* Live/preview notice + menu jump links */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 pt-8 sm:px-6 lg:px-8">
        {live ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1.5 text-xs font-medium text-forest">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold" aria-hidden />
            Live from Untappd · updates hourly
          </p>
        ) : (
          <p className="inline-flex items-center gap-2 rounded-full bg-loch/20 px-4 py-1.5 text-xs font-medium text-forest">
            <span className="h-2 w-2 rounded-full bg-loch" aria-hidden />
            Sample preview — the live list is taking a quick break
          </p>
        )}
        {menus.length > 1 &&
          menus.map((menu) => (
            <a
              key={menu.name}
              href={`#${slug(menu.name)}`}
              className="rounded-full border border-forest/20 px-4 py-1.5 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-cream"
            >
              {menu.name}
            </a>
          ))}
      </div>

      {/* Menus → style sections → beers (mirrors the Untappd embed hierarchy) */}
      {menus.map((menu) => (
        <section
          key={menu.name}
          id={slug(menu.name)}
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8"
        >
          <h2 className="border-b-2 border-gold/40 pb-3 font-display text-3xl font-bold text-forest">
            {menu.name}
          </h2>
          {menu.sections.map((section) => (
            <div key={section.name} className="mt-8">
              {section.name && (
                <h3 className="text-sm font-semibold uppercase tracking-widest text-brick">
                  {section.name}
                </h3>
              )}
              <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map((beer) => (
                  <TapCard key={beer.name} beer={beer} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      {/* Slushee callout */}
      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Year-Round
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Alcoholic slushees. Yes, really.
            </h2>
            <p className="mt-4 text-lg text-cream/80">
              Beer slushees and hard lemonade slushees, spinning in every season. The beer
              garden&rsquo;s worst-kept secret.
            </p>
          </div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl shadow-hero">
            <Image
              src="/images/slushee.webp"
              alt="A frosty beer slushee in a can-shaped glass"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Beer to go */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-forest">Beer to go</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {toGo.map((f) => (
            <div key={f.format} className="rounded-xl bg-white p-6 text-center shadow-card">
              <h3 className="font-display text-lg font-semibold text-forest">{f.format}</h3>
              <p className="mt-2 text-sm text-charcoal/60">{f.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href={site.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-gold px-8 py-3 font-semibold text-forest transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-card-hover"
          >
            Order for Pickup
          </a>
        </div>
      </section>

      {/* Where to find our beer */}
      <section className="relative text-cream">
        <Image
          src="/images/beer-pour.webp"
          alt="Four Braeloch cans lined up in front of the brick brewery"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Beyond the taproom</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream/90">
            Braeloch pours at bars and bottle shops around the Brandywine Valley.
          </p>
          <a
            href={site.social.untappd}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-md border-2 border-cream/60 px-8 py-3 font-semibold text-cream transition-colors hover:border-cream hover:bg-cream/10"
          >
            Find Braeloch on Untappd
          </a>
        </div>
      </section>
    </>
  );
}
