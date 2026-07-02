/**
 * Single source of truth for business facts (PLAN.md §9C).
 * Consumed by the header, footer, OpenNowPill, and JSON-LD.
 */

export const site = {
  name: "Braeloch Brewing",
  tagline: "Craft beer, local food, and good company in Kennett Square",
  url: "https://braelochbrewing.beer",
  phone: "(610) 612-9242",
  phoneHref: "tel:+16106129242",
  email: "info@braelochbrewing.beer",
  address: {
    street: "225 Birch St",
    city: "Kennett Square",
    state: "PA",
    zip: "19348",
  },
  mapsUrl: "https://maps.google.com/?q=Braeloch+Brewing+225+Birch+St+Kennett+Square+PA+19348",
  // Real Arryved pickup link (verified from the current site, 2026-07-02)
  orderUrl: "https://commerce.arryved.com/location/BOJuuMkO/modality/pickup/",
  social: {
    instagram: "https://www.instagram.com/braelochbrewing/",
    facebook: "https://www.facebook.com/BraelochBrewing/",
    untappd: "https://untappd.com/BraelochBrewing",
  },
  timezone: "America/New_York",
} as const;

/** Weekly hours; day 0 = Sunday. `null` = closed. Times are 24h local. */
export const hours: Record<number, { open: number; close: number } | null> = {
  0: { open: 12, close: 20 }, // Sun 12–8
  1: null, // Mon closed
  2: null, // Tue closed
  3: { open: 16, close: 21 }, // Wed 4–9
  4: { open: 16, close: 21 }, // Thu 4–9
  5: { open: 12, close: 23 }, // Fri 12–11
  6: { open: 12, close: 23 }, // Sat 12–11
};

export const hoursDisplay = [
  { days: "Mon–Tue", hours: "Closed" },
  { days: "Wed–Thu", hours: "4pm–9pm" },
  { days: "Fri–Sat", hours: "12pm–11pm" },
  { days: "Sun", hours: "12pm–8pm" },
];

export const nav = [
  { label: "Beer", href: "/beer" },
  { label: "Food", href: "/food" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Visit", href: "/visit" },
] as const;
