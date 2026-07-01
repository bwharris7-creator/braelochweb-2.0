import { site } from "./site";

/**
 * Live events from the Common Ninja calendar (PLAN.md §3, validated 2026-07-01).
 *
 * Source: the public widget page server-embeds all event data in its
 * __NEXT_DATA__ blob at props.pageProps.pluginData.data.content.items —
 * no API token needed. Cached via ISR (hourly). If Common Ninja ever changes
 * this structure, upgrade to their authed Widget Data API (same data):
 * GET api.commoninja.com/platform/api/v1/widgets/{id} with a Bearer token.
 *
 * Recurrence is rule-based, NOT pre-expanded: items may carry
 * recurringEvent ("daily" | "weekly") + totalRecurrings (total occurrence
 * count) and must be expanded into dated instances here.
 */

const WIDGET_ID = "8486c21f-ed86-4f36-8340-55ee24aea676";
const WIDGET_URL = `https://commoninja.site/${WIDGET_ID}`;
const REVALIDATE_SECONDS = 3600;
/** Safety cap so a malformed recurrence count can't flood the page. */
const MAX_RECURRENCES = 52;

interface RawCNEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  allDay?: boolean;
  media?: string;
  location?: string;
  link?: string;
  linkText?: string;
  recurringEvent?: string;
  totalRecurrings?: number;
}

export interface EventInstance {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date | null;
  allDay: boolean;
  image: string | null;
  location: string | null;
  link: string | null;
  kind: EventKind;
}

export type EventKind = "Live Music" | "Community" | "Off-Site" | "Event";

function classify(title: string, location: string | null): EventKind {
  const t = title.toLowerCase();
  if (t.includes("live music") || t.includes("open mic")) {
    return t.includes("open mic") ? "Community" : "Live Music";
  }
  if (t.includes("blood drive") || t.includes("fundraiser") || t.includes("charity")) {
    return "Community";
  }
  if (t.includes("braeloch @") || (location && !location.toLowerCase().includes("braeloch"))) {
    return "Off-Site";
  }
  return "Event";
}

const STEP_MS: Record<string, number> = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
};

/** Expand a raw event into one instance per occurrence. */
function expand(raw: RawCNEvent): EventInstance[] {
  const start = new Date(raw.start);
  if (isNaN(start.getTime())) return [];
  const end = raw.end ? new Date(raw.end) : null;

  const base: Omit<EventInstance, "start" | "end" | "id"> = {
    title: raw.title,
    description: raw.description ?? "",
    allDay: raw.allDay ?? false,
    image: raw.media || null,
    location: raw.location || null,
    link: raw.link || null,
    kind: classify(raw.title, raw.location || null),
  };

  const step = raw.recurringEvent ? STEP_MS[raw.recurringEvent] : undefined;
  const count = step ? Math.min(Math.max(raw.totalRecurrings ?? 1, 1), MAX_RECURRENCES) : 1;

  return Array.from({ length: count }, (_, i) => ({
    ...base,
    id: count > 1 ? `${raw.id}:${i}` : raw.id,
    start: new Date(start.getTime() + i * (step ?? 0)),
    end: end && !isNaN(end.getTime()) ? new Date(end.getTime() + i * (step ?? 0)) : null,
  }));
}

/**
 * Fetch and parse all events. Returns null on source failure so callers can
 * render a graceful fallback instead of a blank section (PLAN.md §3).
 */
export async function getAllEvents(): Promise<EventInstance[] | null> {
  try {
    const res = await fetch(WIDGET_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return null;
    const data = JSON.parse(match[1]);
    const items: RawCNEvent[] | undefined =
      data?.props?.pageProps?.pluginData?.data?.content?.items;
    if (!Array.isArray(items)) return null;
    return items.flatMap(expand).sort((a, b) => a.start.getTime() - b.start.getTime());
  } catch {
    return null;
  }
}

/** Upcoming events (start >= start of today, brewery time). */
export async function getUpcomingEvents(limit?: number): Promise<EventInstance[] | null> {
  const all = await getAllEvents();
  if (all === null) return null;
  const startOfTodayApprox = Date.now() - 24 * 60 * 60 * 1000; // generous: keep anything from the last day
  const upcoming = all.filter((e) => e.start.getTime() >= startOfTodayApprox);
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/** Events between now and the end of the coming Sunday (brewery time, approx). */
export async function getThisWeekend(): Promise<EventInstance[] | null> {
  const upcoming = await getUpcomingEvents();
  if (upcoming === null) return null;
  const now = new Date();
  const weekdayET = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    weekday: "short",
  }).format(now);
  const dayIdx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayET);
  const daysUntilSundayEnd = dayIdx === 0 ? 1 : 8 - dayIdx;
  const windowEnd = now.getTime() + daysUntilSundayEnd * 24 * 60 * 60 * 1000;
  return upcoming.filter((e) => e.start.getTime() <= windowEnd);
}

/* ---------- formatting helpers (brewery timezone) ---------- */

export function fmtEventDate(e: EventInstance): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(e.start);
}

export function fmtEventTime(e: EventInstance): string {
  if (e.allDay) return "All Day";
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    hour: "numeric",
    minute: "2-digit",
  });
  const clean = (s: string) => s.replace(":00", "").replace(" ", "").toLowerCase();
  const start = clean(fmt.format(e.start));
  if (!e.end) return start;
  const end = clean(fmt.format(e.end));
  return end === start ? start : `${start}–${end}`;
}

/** schema.org Event JSON-LD for SEO (PLAN.md §6). */
export function eventsJsonLd(events: EventInstance[]) {
  return events.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.start.toISOString(),
    ...(e.end ? { endDate: e.end.toISOString() } : {}),
    ...(e.image ? { image: e.image } : {}),
    ...(e.description ? { description: e.description } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: e.location || site.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.state,
        postalCode: site.address.zip,
        addressCountry: "US",
      },
    },
    organizer: { "@type": "Organization", name: site.name, url: site.url },
  }));
}
