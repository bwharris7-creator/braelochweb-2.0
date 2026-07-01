import Link from "next/link";
import { fmtEventDate, fmtEventTime, getThisWeekend, getUpcomingEvents } from "@/lib/events";

/**
 * Homepage "This Weekend" module (PLAN.md §4) — live from the events
 * calendar. Falls back to the next few upcoming events when the weekend is
 * quiet, and to a friendly note if the source is unreachable.
 */
export default async function ThisWeekend() {
  let heading = "This Weekend";
  let events = await getThisWeekend();

  if (events !== null && events.length === 0) {
    heading = "Coming Up";
    events = await getUpcomingEvents(3);
  }

  return (
    <div className="rounded-xl bg-forest p-8 text-cream shadow-card">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">{heading}</h2>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cream/60">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" aria-hidden />
          Live
        </span>
      </div>

      {events === null ? (
        <p className="mt-4 text-cream/70">
          The calendar didn&rsquo;t load — see everything on the{" "}
          <Link href="/events" className="font-semibold text-gold hover:text-cream">
            events page
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {events.slice(0, 3).map((e) => (
            <li key={e.id} className="flex items-baseline gap-4">
              <span className="w-24 shrink-0 text-sm font-semibold uppercase tracking-wide text-gold">
                {fmtEventDate(e)}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{e.title}</span>
                <span className="text-sm text-cream/60">{fmtEventTime(e)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/events"
        className="mt-6 inline-block text-sm font-semibold text-gold transition-colors hover:text-cream"
      >
        Full calendar →
      </Link>
    </div>
  );
}
