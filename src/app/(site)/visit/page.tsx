import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import OpenNowPill from "@/components/OpenNowPill";
import { hoursDisplay, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit — Hours & Directions",
  description:
    "Hours, directions, and what to expect at Braeloch Brewing, 225 Birch St, Kennett Square, PA.",
};

/** Visit page shell (PLAN.md §4 /visit). */

const faqs = [
  {
    q: "Can I bring my dog?",
    a: "Please do — dogs are welcome in the beer garden, and we keep Giggy Bites dog treats behind the counter.",
  },
  {
    q: "Are kids welcome?",
    a: "Absolutely. It's a family-friendly space with a kids' menu (the chicken fingers have a fan club).",
  },
  {
    q: "Do you take reservations?",
    a: "No reservations needed — it's casual counter service. Grab any open table and order when you're ready.",
  },
  {
    q: "Is there parking?",
    a: "Yes — free parking at the brewery, with more street parking nearby.",
  },
];

export default function VisitPage() {
  return (
    <>
      <PageHero
        eyebrow="Visit Us"
        title="Come find the loch"
        subtitle="225 Birch Street, a couple blocks off State Street in downtown Kennett Square."
      />

      {/* Hours + address */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-white p-8 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-forest">Hours</h2>
              <OpenNowPill />
            </div>
            <dl className="mt-6 space-y-3">
              {hoursDisplay.map((row) => (
                <div key={row.days} className="flex justify-between border-b border-cream-dark pb-3 text-charcoal">
                  <dt className="font-medium">{row.days}</dt>
                  <dd className={row.hours === "Closed" ? "text-charcoal/50" : "font-semibold"}>
                    {row.hours}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold text-forest">Find Us</h2>
            <address className="mt-4 text-lg not-italic leading-relaxed text-charcoal">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </address>
            <p className="mt-4 text-charcoal/70">
              <a href={site.phoneHref} className="font-medium text-forest hover:text-gold-dark">
                {site.phone}
              </a>
              <br />
              <a href={`mailto:${site.email}`} className="font-medium text-forest hover:text-gold-dark">
                {site.email}
              </a>
            </p>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-md bg-gold px-6 py-3 font-semibold text-forest transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-card-hover"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl shadow-card">
          <iframe
            title="Map to Braeloch Brewing"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              `${site.name} ${site.address.street} ${site.address.city} ${site.address.state}`
            )}&output=embed`}
            className="h-96 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-forest">Good to know</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl bg-white p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold text-charcoal">{f.q}</h3>
              <p className="mt-2 text-charcoal/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
