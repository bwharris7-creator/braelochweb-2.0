import Link from "next/link";
import { hoursDisplay, nav, site } from "@/lib/site";

/** Global footer (PLAN.md §4): hours, address, socials — source of truth on every page. */
export default function Footer() {
  return (
    <footer className="bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="font-display text-lg font-bold">{site.name}</h2>
          <address className="mt-3 text-sm not-italic leading-relaxed text-cream/80">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </address>
          <p className="mt-3 text-sm text-cream/80">
            <a href={site.phoneHref} className="hover:text-cream">
              {site.phone}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="hover:text-cream">
              {site.email}
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/60">Hours</h2>
          <dl className="mt-3 space-y-1 text-sm text-cream/80">
            {hoursDisplay.map((row) => (
              <div key={row.days} className="flex justify-between gap-4">
                <dt>{row.days}</dt>
                <dd>{row.hours}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/60">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream/80 transition-colors hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/private-events" className="text-cream/80 transition-colors hover:text-cream">
                Private Events
              </Link>
            </li>
            <li>
              <a
                href={site.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/80 transition-colors hover:text-cream"
              >
                Order Take-Out
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cream/60">Follow</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="text-cream/80 transition-colors hover:text-cream">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="text-cream/80 transition-colors hover:text-cream">
                Facebook
              </a>
            </li>
            <li>
              <a href={site.social.untappd} target="_blank" rel="noopener noreferrer" className="text-cream/80 transition-colors hover:text-cream">
                Untappd
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
