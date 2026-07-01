import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Food — Full Kitchen Menu",
  description: "Shareables, flatbreads, tacos, and more from Braeloch's full-service kitchen.",
};

/**
 * Food page shell (PLAN.md §4 /food).
 * DESIGN PHASE: items below are from the current site's menu; prices and
 * dietary tags are illustrative until the real menu data lands (Phase 0 §9C).
 */

const menu = [
  {
    category: "Shareables",
    items: [
      {
        name: "Brewhouse Hummus",
        desc: "Basil oil, paprika, crudité, grilled flatbread",
        price: "$12",
        tags: ["V"],
      },
      {
        name: "Bavarian Pretzel",
        desc: "House beer cheese, whole-grain mustard",
        price: "$11",
        tags: ["V"],
      },
      {
        name: "Loaded Frites",
        desc: "Beer cheese, bacon, scallion, crema",
        price: "$13",
        tags: [],
      },
    ],
  },
  {
    category: "Flatbreads",
    items: [
      {
        name: "Margherita",
        desc: "San Marzano tomato, fresh mozzarella, basil",
        price: "$14",
        tags: ["V"],
      },
      {
        name: "Mushroom & Ale",
        desc: "Kennett Square mushrooms, caramelized onion, fontina, ale glaze",
        price: "$16",
        tags: ["V"],
      },
    ],
  },
  {
    category: "Tacos",
    items: [
      {
        name: "Baja Fish Tacos",
        desc: "Crispy cod, cabbage slaw, chipotle crema, lime",
        price: "$15",
        tags: [],
      },
      {
        name: "Carnitas Tacos",
        desc: "Slow pork, salsa verde, pickled onion, cotija",
        price: "$14",
        tags: ["GF"],
      },
    ],
  },
  {
    category: "Kids & Sweets",
    items: [
      {
        name: "Chicken Fingers & Frites",
        desc: "The undisputed kids' favorite",
        price: "$9",
        tags: [],
      },
      {
        name: "Seasonal Dessert",
        desc: "Ask what the kitchen's spinning this week",
        price: "$8",
        tags: ["V"],
      },
    ],
  },
];

function DietTag({ tag }: { tag: string }) {
  return (
    <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest">
      {tag === "V" ? "Vegetarian" : "Gluten-Free"}
    </span>
  );
}

export default function FoodPage() {
  return (
    <>
      <PageHero
        eyebrow="Let's Eat"
        title="From the Kitchen"
        subtitle="A full-service kitchen behind casual counter service. No reservations — grab a table, order at the counter, and we'll find you."
      />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-loch/20 px-4 py-1.5 text-xs font-medium text-forest">
          <span className="h-2 w-2 rounded-full bg-loch" aria-hidden />
          Design preview — sample items & prices; the real menu (with photos) lands next
        </p>
      </div>

      {/* Menu */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {menu.map((m) => (
            <a
              key={m.category}
              href={`#${m.category.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="rounded-full border border-forest/20 px-4 py-1.5 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-cream"
            >
              {m.category}
            </a>
          ))}
        </div>

        {menu.map((section) => (
          <div
            key={section.category}
            id={section.category.toLowerCase().replace(/[^a-z]+/g, "-")}
            className="mt-12 scroll-mt-24"
          >
            <h2 className="font-display text-2xl font-bold text-forest">{section.category}</h2>
            <div className="mt-4 space-y-4">
              {section.items.map((item) => (
                <div key={item.name} className="rounded-xl bg-white p-5 shadow-card">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold text-charcoal">
                      {item.name}
                    </h3>
                    <span className="shrink-0 font-semibold text-gold-dark">{item.price}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="text-sm text-charcoal/70">{item.desc}</p>
                    {item.tags.map((t) => (
                      <DietTag key={t} tag={t} />
                    ))}
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
