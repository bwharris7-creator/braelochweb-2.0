/**
 * Live tap list via the Untappd for Business API (PLAN.md §3).
 *
 * Auth: Basic auth with the UTFB account email + API access token
 * (business.untappd.com → account settings → API Access Tokens).
 * Env: UNTAPPD_EMAIL + UNTAPPD_API_TOKEN (server-only, never NEXT_PUBLIC).
 *
 * Flow: locations → menus for the first location → sections + items of the
 * first published menu. Cached hourly via ISR. Returns null when
 * unconfigured or on failure so pages fall back gracefully.
 */

const API = "https://business.untappd.com/api/v1";
const REVALIDATE_SECONDS = 3600;

export interface Tap {
  name: string;
  style: string;
  abv: string | null;
  description: string;
  section: string;
  labelUrl: string | null;
}

const email = process.env.UNTAPPD_EMAIL ?? "";
const token = process.env.UNTAPPD_API_TOKEN ?? "";
export const untappdConfigured = email.length > 0 && token.length > 0;

async function utfb<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`,
        Accept: "application/json",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* UTFB response shapes (fields we use) */
interface UtfbLocation {
  id: number;
  name: string;
}
interface UtfbMenu {
  id: number;
  name: string;
  published: boolean;
}
interface UtfbItem {
  name: string;
  style: string | null;
  abv: string | number | null;
  description: string | null;
  label_image: string | null;
  in_production?: boolean;
}
interface UtfbSection {
  name: string;
  items: UtfbItem[];
}

export async function getTaps(): Promise<Tap[] | null> {
  if (!untappdConfigured) return null;

  const locations = await utfb<{ locations: UtfbLocation[] }>("/locations");
  const locationId = locations?.locations?.[0]?.id;
  if (!locationId) return null;

  const menus = await utfb<{ menus: UtfbMenu[] }>(`/locations/${locationId}/menus`);
  const menu = menus?.menus?.find((m) => m.published) ?? menus?.menus?.[0];
  if (!menu) return null;

  const full = await utfb<{ menu: { sections: UtfbSection[] } }>(`/menus/${menu.id}?full=true`);
  const sections = full?.menu?.sections;
  if (!sections) return null;

  const taps: Tap[] = [];
  for (const section of sections) {
    for (const item of section.items ?? []) {
      taps.push({
        name: item.name,
        style: item.style ?? "",
        abv: item.abv != null && `${item.abv}`.length > 0 ? `${item.abv}%`.replace("%%", "%") : null,
        description: item.description ?? "",
        section: section.name,
        labelUrl: item.label_image || null,
      });
    }
  }
  return taps;
}
