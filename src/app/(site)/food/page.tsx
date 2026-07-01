import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";
import { fmtPrice, getMenu, TAG_LABELS } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Food — Full Kitchen Menu",
  description: "Shareables, flatbreads, tacos, and more from Braeloch's full-service kitchen.",
};

/**
 * Food page (PLAN.md §4 /food) — menu content from Sanity, edited by the
 * taproom manager at /studio. Shows built-in sample data until the Sanity
 * project is connected.
 */

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z]+/g, "-");
}

export default async function FoodPage() {
  const { categories, live } = await getMenu();

  return (
    <>
      <PageHero
        eyebrow="Let's Eat"
        title="From the Kitchen"
        subtitle="A full-service kitchen behind casual counter service. No reservations — grab a table, order at the counter, and we'll find you."
      />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {live ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1.5 text-xs font-medium text-forest">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold" aria-hidden />
            Live menu · kept fresh by the kitchen
          </p>
        ) : (
          <p className="inline-flex items-center gap-2 rounded-full bg-loch/20 px-4 py-1.5 text-xs font-medium text-forest">
            <span className="h-2 w-2 rounded-full bg-loch" aria-hidden />
            Design preview — sample items; goes live when the menu editor connects
          </p>
        )}
      </div>

      {/* Menu */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <a
              key={c.title}
              href={`#${slug(c.title)}`}
              className="rounded-full border border-forest/20 px-4 py-1.5 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-cream"
            >
              {c.title}
            </a>
          ))}
        </div>

        {categories.map((section) => (
          <div key={section.title} id={slug(section.title)} className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl font-bold text-forest">{section.title}</h2>
            <div className="mt-4 space-y-4">
              {section.items.map((item) => (
                <div key={item.name} className="flex gap-5 rounded-xl bg-white p-5 shadow-card">
                  {item.photoUrl && (
                    <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:block">
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-lg font-semibold text-charcoal">
                        {item.name}
                      </h3>
                      <span className="shrink-0 font-semibold text-gold-dark">
                        {fmtPrice(item.price)}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {item.description && (
                        <p className="text-sm text-charcoal/70">{item.description}</p>
                      )}
                      {item.dietaryTags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest"
                        >
                          {TAG_LABELS[t] ?? t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Order CTA band */}
      <section className="relative text-cream">
        <Image
          src="/images/food.webp"
          alt="A spread from the Braeloch kitchen"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Rather eat on the couch?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream/90">
            The whole menu is available for take-out.
          </p>
          <a
            href={site.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-md bg-gold px-8 py-3 font-semibold text-forest transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-card-hover"
          >
            Order Take-Out
          </a>
        </div>
      </section>
    </>
  );
}
