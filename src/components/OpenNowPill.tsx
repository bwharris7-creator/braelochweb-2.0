"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";

/**
 * Live open/closed indicator (PLAN.md §5).
 * Computed client-side after mount so server-rendered HTML never
 * disagrees with the viewer's clock (avoids hydration mismatch).
 */
export default function OpenNowPill({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    setStatus(getOpenStatus());
    const timer = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!status) {
    return <span className={`inline-block h-6 w-28 rounded-full bg-cream-dark ${className}`} aria-hidden />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        status.open ? "bg-forest text-cream" : "bg-cream-dark text-charcoal/70"
      } ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${status.open ? "bg-amber-ale" : "bg-charcoal/40"}`}
        aria-hidden
      />
      {status.open ? `Open now · closes ${status.closesAt}` : `Closed · opens ${status.opensNext}`}
    </span>
  );
}
