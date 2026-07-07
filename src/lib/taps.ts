/**
 * Live tap list from Untappd for Business (PLAN.md §3).
 *
 * The full UTFB REST API is Premium-gated (verified 2026-07-07:
 * PremiumRequiredError), but the public *embed menu* is included in the
 * current plan and needs no auth: a JS file at
 *   https://business.untappd.com/locations/{LOCATION}/themes/{THEME}/js
 * contains the entire rendered menu HTML (names, styles, ABV, descriptions,
 * label art, Untappd links). That's the same embed Kent's account generates
 * for the brewery's own website — we fetch it server-side, parse it, and
 * render our own styled components. Cached hourly via ISR; null on failure
 * so pages fall back gracefully.
 *
 * IDs come from UTFB → Embed Menus (PreloadEmbedMenu("…", 21932, 83553)).
 */

const LOCATION_ID = process.env.UNTAPPD_LOCATION_ID ?? "21932";
const THEME_ID = process.env.UNTAPPD_THEME_ID ?? "83553";
const EMBED_URL = `https://business.untappd.com/locations/${LOCATION_ID}/themes/${THEME_ID}/js`;
const REVALIDATE_SECONDS = 3600;

export interface Tap {
  name: string;
  style: string;
  abv: string | null;
  description: string;
  /** e.g. "On Tap · Hazy IPA" or "On Tap · Cans" contexts joined */
  tag: string;
  labelUrl: string | null;
  untappdUrl: string | null;
  rating: number | null;
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function decode(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/g, (e) => ENTITIES[e] ?? e)
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(s: string): string {
  return decode(s.replace(/<[^>]+>/g, " "));
}

/** Shorten UTFB menu names to compact display tags. */
function menuTag(menuName: string): string {
  const n = menuName.toLowerCase();
  if (n.includes("tap")) return "On Tap";
  if (n.includes("can") || n.includes("bottle")) return "Cans";
  return menuName;
}

export async function getTaps(): Promise<Tap[] | null> {
  let html: string;
  try {
    const res = await fetch(EMBED_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const js = await res.text();
    const m = js.match(/container\.innerHTML = "([\s\S]*)";\s*$/m);
    if (!m) return null;
    html = m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\//g, "/").replace(/\\t/g, "\t");
  } catch {
    return null;
  }

  // Positions of menu headings ("Beers On Tap", "Cans & Bottles") and
  // section headings ("Hazy IPA", …) so each item inherits its context.
  const markers: { index: number; kind: "menu" | "section"; text: string }[] = [];
  for (const m of html.matchAll(/<h\d[^>]*class="[^"]*menu[^"]*"[^>]*>\s*([^<]+?)\s*</g)) {
    markers.push({ index: m.index!, kind: "menu", text: decode(m[1]) });
  }
  for (const m of html.matchAll(/class="section-name[^"]*"[^>]*>([^<]+)/g)) {
    markers.push({ index: m.index!, kind: "section", text: decode(m[1]) });
  }
  markers.sort((a, b) => a.index - b.index);

  const context = (pos: number) => {
    let menu = "", section = "";
    for (const mk of markers) {
      if (mk.index > pos) break;
      if (mk.kind === "menu") menu = mk.text;
      else section = mk.text;
    }
    return { menu, section };
  };

  // Item blocks — dedupe beers that appear on both menus (taps + cans),
  // collecting each menu context; section comes from the first appearance.
  type Acc = Omit<Tap, "tag"> & { menus: Set<string>; section: string };
  const byName = new Map<string, Acc>();
  const itemRe = /<div class="item-bg-color menu-item clearfix">([\s\S]*?)(?=<div class="item-bg-color menu-item clearfix">|$)/g;
  for (const m of html.matchAll(itemRe)) {
    const block = m[1];
    const name = block.match(/class="item-name"[\s\S]*?<span[^>]*>([^<]+)</)?.[1];
    if (!name) continue;
    const { menu, section } = context(m.index!);

    const key = decode(name);
    const existing = byName.get(key);
    if (existing) {
      existing.menus.add(menuTag(menu));
      continue;
    }

    const ratingRaw = block.match(/class="rating small r(\d+)"/)?.[1];
    byName.set(key, {
      name: key,
      style: decode(block.match(/class="item-category">([^<]+)</)?.[1] ?? ""),
      abv: block.match(/class="item-abv">([^<]+)</)?.[1]?.replace(/\s*ABV\s*/i, "").trim() || null,
      description: stripTags(block.match(/class="[^"]*show-less[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? ""),
      labelUrl: block.match(/<img src="(https:\/\/labels\.untappd\.com\/[^"]+)"/)?.[1] ?? null,
      untappdUrl: block.match(/href="(https:\/\/untappd\.com\/b\/[^"]+)"/)?.[1] ?? null,
      rating: ratingRaw ? Number(ratingRaw) / 100 : null,
      menus: new Set([menuTag(menu)]),
      section,
    });
  }

  const taps: Tap[] = [...byName.values()].map(({ menus, section, ...t }) => ({
    ...t,
    tag: [...menus, section].filter(Boolean).join(" · "),
  }));

  return taps.length > 0 ? taps : null;
}
