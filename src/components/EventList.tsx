"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EventCard, EventKind } from "@/lib/events";

/**
 * /events "Up Next" + "Coming Up" lists with a detail popup per event,
 * mirroring the Common Ninja widget's popup (image, date, time, location,
 * add to calendar, description, and the Tickets / sign-up link staff set on
 * the event). Each popup is deep-linkable at /events#event-<id>.
 */

const kindColor: Record<EventKind, string> = {
  "Live Music": "bg-gold/15 text-gold-dark",
  Community: "bg-loch/20 text-forest",
  "Off-Site": "bg-brick/15 text-brick",
  Event: "bg-forest/10 text-forest",
};

const HASH_PREFIX = "#event-";

/** Staff sometimes leave the button label blank in the calendar. */
const ctaLabel = (e: EventCard) => e.linkText ?? "More Info";

function ExternalIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path d="M11 3a1 1 0 100 2h2.59l-6.3 6.29a1 1 0 101.42 1.42L15 6.41V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  );
}

function Meta({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-start gap-2 text-sm font-medium text-charcoal/80">
      <span className="mt-0.5 shrink-0 text-gold-dark">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

function icsFor(e: EventCard) {
  // Built from the Google link's params so both calendar options agree.
  const g = new URL(e.googleCalendarUrl).searchParams;
  const [start, end] = (g.get("dates") ?? "").split("/");
  const allDay = start.length === 8;
  const esc = (s: string) =>
    s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Braeloch Brewing//Events//EN",
    "BEGIN:VEVENT",
    `UID:${e.id}@braelochbrewing.beer`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
    allDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.description)}`,
    `LOCATION:${esc(g.get("location") ?? "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs(e: EventCard) {
  const url = URL.createObjectURL(
    new Blob([icsFor(e)], { type: "text/calendar" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.title.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "event"}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function EventDialog({
  event,
  onClose,
}: {
  event: EventCard | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (event && !dialog.open) dialog.showModal();
    if (!event && dialog.open) dialog.close();
  }, [event]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Click on the backdrop (the dialog element itself, outside the panel) closes.
      onClick={(ev) => ev.target === ref.current && onClose()}
      // Native <dialog> closes on Escape in most browsers; handle it explicitly so it always does.
      onKeyDown={(ev) => {
        if (ev.key === "Escape") {
          ev.preventDefault();
          onClose();
        }
      }}
      aria-labelledby="event-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl bg-cream p-0 text-charcoal shadow-hero backdrop:bg-charcoal/70 backdrop:backdrop-blur-sm"
    >
      {event && (
        <div className="relative flex max-h-[85vh] flex-col">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 rounded-full bg-cream/90 p-2 text-charcoal/60 shadow-card transition-colors hover:bg-cream-dark hover:text-charcoal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="overflow-y-auto p-6 sm:p-8">
            <div className="sm:flex sm:gap-6">
              {event.image && (
                <div className="relative mb-5 aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl bg-cream-dark sm:mb-0 sm:aspect-[4/3] sm:w-48">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 192px, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 pr-6">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${kindColor[event.kind]}`}
                >
                  {event.kind}
                </span>
                <h2
                  id="event-dialog-title"
                  className="mt-2 font-display text-2xl font-bold text-forest"
                >
                  {event.title}
                </h2>
                <div className="mt-3 space-y-1.5">
                  <Meta
                    icon={
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="16"
                          rx="2"
                          strokeWidth={2}
                        />
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          d="M3 10h18M8 3v4M16 3v4"
                        />
                      </svg>
                    }
                  >
                    {event.longDate}
                  </Meta>
                  <Meta
                    icon={
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <circle cx="12" cy="12" r="9" strokeWidth={2} />
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          d="M12 7v5l3 2"
                        />
                      </svg>
                    }
                  >
                    {event.time}
                  </Meta>
                  {event.location && (
                    <Meta
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden
                        >
                          <path
                            strokeWidth={2}
                            strokeLinejoin="round"
                            d="M12 21s-7-6.2-7-12a7 7 0 1114 0c0 5.8-7 12-7 12z"
                          />
                          <circle cx="12" cy="9" r="2.5" strokeWidth={2} />
                        </svg>
                      }
                    >
                      {event.location}
                    </Meta>
                  )}
                </div>
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="text-charcoal/50">Add to calendar:</span>
                  <a
                    href={event.googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-forest underline-offset-2 hover:underline"
                  >
                    Google
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadIcs(event)}
                    className="font-semibold text-forest underline-offset-2 hover:underline"
                  >
                    Apple / Outlook
                  </button>
                </p>
              </div>
            </div>

            {event.description && (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-charcoal/80">
                {event.description}
              </p>
            )}
          </div>

          {/* CTA pinned below the scroll area so it's always visible on phones. */}
          {event.link && (
            <div className="flex justify-end border-t border-cream-dark px-6 py-4 sm:px-8">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 font-semibold text-forest transition-all hover:-translate-y-px hover:bg-gold-dark hover:shadow-card-hover"
              >
                {ctaLabel(event)}
                <ExternalIcon />
              </a>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

export default function EventList({ events }: { events: EventCard[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = events.find((e) => e.id === openId) ?? null;

  // Deep links: /events#event-<id> opens that event's popup (and back/forward works).
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash;
      setOpenId(
        h.startsWith(HASH_PREFIX)
          ? decodeURIComponent(h.slice(HASH_PREFIX.length))
          : null,
      );
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const show = useCallback((id: string) => {
    history.replaceState(null, "", `${HASH_PREFIX}${id}`);
    setOpenId(id);
  }, []);

  const close = useCallback(() => {
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    setOpenId(null);
  }, []);

  const [featured, ...rest] = events;

  return (
    <>
      <h2 className="font-display text-2xl font-bold text-forest">Up Next</h2>
      <div className="mt-4 overflow-hidden rounded-xl bg-forest text-cream shadow-hero sm:flex">
        {featured.image && (
          <button
            type="button"
            onClick={() => show(featured.id)}
            className="relative block aspect-[16/9] w-full shrink-0 sm:aspect-auto sm:w-72"
            aria-label={`Details for ${featured.title}`}
          >
            <Image
              src={featured.image}
              alt=""
              fill
              sizes="(min-width: 640px) 288px, 100vw"
              className="object-cover"
            />
          </button>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-center p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              {featured.date} · {featured.time}
            </p>
            <span className="rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-forest">
              {featured.kind}
            </span>
          </div>
          <h3 className="mt-2 font-display text-3xl font-bold">
            {featured.title}
          </h3>
          {featured.description && (
            <p className="mt-3 line-clamp-2 max-w-xl whitespace-pre-line text-cream/80">
              {featured.description}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {featured.link && (
              <a
                href={featured.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-2.5 font-semibold text-forest transition-all hover:-translate-y-px hover:bg-gold-dark"
              >
                {ctaLabel(featured)}
                <ExternalIcon />
              </a>
            )}
            <button
              type="button"
              onClick={() => show(featured.id)}
              className="rounded-md border-2 border-cream/40 px-6 py-2 font-semibold text-cream transition-colors hover:border-cream hover:bg-cream hover:text-forest"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {rest.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-2xl font-bold text-forest">
            Coming Up
          </h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Tap any event for details, tickets, and sign-ups.
          </p>
          <ul className="mt-4 divide-y divide-cream-dark overflow-hidden rounded-xl bg-white shadow-card">
            {rest.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => show(e.id)}
                  className="group flex w-full flex-wrap items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-cream/60 focus-visible:bg-cream/60 sm:gap-6"
                >
                  <span className="w-28 shrink-0">
                    <span className="block font-semibold text-charcoal">
                      {e.date}
                    </span>
                    <span className="block text-sm text-charcoal/60">
                      {e.time}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-charcoal group-hover:text-forest">
                      {e.title}
                    </span>
                    {e.location && (
                      <span className="block truncate text-sm text-charcoal/50">
                        {e.location}
                      </span>
                    )}
                  </span>
                  {e.link && (
                    <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-forest">
                      {ctaLabel(e)}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${kindColor[e.kind]}`}
                  >
                    {e.kind}
                  </span>
                  <svg
                    className="hidden h-5 w-5 text-charcoal/30 transition-transform group-hover:translate-x-0.5 group-hover:text-forest sm:block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M7.3 14.7a1 1 0 010-1.4L10.6 10 7.3 6.7a1 1 0 011.4-1.4l4 4a1 1 0 010 1.4l-4 4a1 1 0 01-1.4 0z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <EventDialog event={open} onClose={close} />
    </>
  );
}
