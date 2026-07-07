import Link from "next/link";
import { getTapMenus } from "@/lib/taps";

/**
 * Homepage "On Tap Right Now" module (PLAN.md §4) — first pours from the
 * live "Beers On Tap" menu; warm pointer to the beer page if the source naps.
 */
export default async function OnTapNow() {
  const menus = await getTapMenus();
  const onTap = menus?.find((m) => m.name.toLowerCase().includes("tap")) ?? menus?.[0];
  const taps = onTap ? onTap.sections.flatMap((s) => s.items) : null;

  return (
    <div className="rounded-xl bg-white p-8 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-forest">On Tap Right Now</h2>
        {taps && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal/50">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" aria-hidden />
            Live
          </span>
        )}
      </div>

      {taps?.length ? (
        <ul className="mt-5 space-y-4">
          {taps.slice(0, 3).map((t) => (
            <li key={t.name} className="flex items-baseline justify-between gap-4">
              <span className="min-w-0">
                <span className="block truncate font-medium text-charcoal">{t.name}</span>
                <span className="text-sm uppercase tracking-wide text-brick">{t.style}</span>
              </span>
              {t.abv && (
                <span className="shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-dark">
                  {t.abv}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-charcoal/60">
          Rotating taps brewed on-site — hazy IPAs, lagers, and a Scottish ale or two.
        </p>
      )}

      <Link
        href="/beer"
        className="mt-6 inline-block text-sm font-semibold text-gold-dark transition-colors hover:text-forest"
      >
        Full tap list →
      </Link>
    </div>
  );
}
