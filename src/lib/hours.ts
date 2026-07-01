import { hours, site } from "./site";

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; opensNext: string };

function fmt(hour24: number): string {
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${h}${hour24 < 12 ? "am" : "pm"}`;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Current day/hour in the brewery's timezone, regardless of viewer locale. */
function nowInBreweryTz(date = new Date()): { day: number; hour: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timezone,
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  return { day, hour: hour === 24 ? 0 : hour };
}

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, hour } = nowInBreweryTz(date);
  const today = hours[day];

  if (today && hour >= today.open && hour < today.close) {
    return { open: true, closesAt: fmt(today.close) };
  }

  // Opens later today?
  if (today && hour < today.open) {
    return { open: false, opensNext: `today at ${fmt(today.open)}` };
  }

  // Find the next open day
  for (let i = 1; i <= 7; i++) {
    const next = hours[(day + i) % 7];
    if (next) {
      const dayName = i === 1 ? "tomorrow" : DAY_NAMES[(day + i) % 7];
      return { open: false, opensNext: `${dayName} at ${fmt(next.open)}` };
    }
  }
  return { open: false, opensNext: "soon" };
}
