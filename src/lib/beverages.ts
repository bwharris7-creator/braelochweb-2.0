import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "@/sanity/env";

/**
 * Beverage list for /beer (wine, cider, seltzer, specialty, non-alcoholic).
 * Same pattern as src/lib/menu.ts: live from Sanity when configured, with a
 * built-in fallback so the section never renders empty. Revalidates every 60s
 * so the taproom manager's published edits appear fast.
 */

export interface BeverageItem {
  name: string;
  detail: string | null;
}

export interface BeverageCategory {
  title: string;
  group: "alcohol" | "non-alcohol";
  items: BeverageItem[];
}

export interface BeverageResult {
  categories: BeverageCategory[];
  /** true = editable content from Sanity; false = built-in fallback */
  live: boolean;
}

const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

const BEVERAGES_QUERY = /* groq */ `
*[_type == "beverageCategory"] | order(order asc) {
  title,
  group,
  "items": *[_type == "beverageItem" && references(^._id) && available != false] | order(order asc) {
    name,
    "detail": detail
  }
}`;

export async function getBeverages(): Promise<BeverageResult> {
  if (client) {
    try {
      const categories = await client.fetch<BeverageCategory[]>(
        BEVERAGES_QUERY,
        {},
        { next: { revalidate: 60 } }
      );
      const nonEmpty = categories.filter((c) => c.items.length > 0);
      if (nonEmpty.length > 0) return { categories: nonEmpty, live: true };
    } catch {
      // fall through to the built-in list
    }
  }
  return { categories: FALLBACK_BEVERAGES, live: false };
}

/** Shown until the Sanity documents are seeded (mirrors the taproom's printed list). */
const FALLBACK_BEVERAGES: BeverageCategory[] = [
  {
    title: "Pennsylvania Wine",
    group: "alcohol",
    items: [
      { name: "Penns Woods Winery", detail: "Cabernet Sauvignon, Pinot Noir, Rose, Chardonnay" },
      { name: "Britain Hill Winery", detail: "Sangria, Pinot Grigio" },
    ],
  },
  {
    title: "Ciders & Seltzers",
    group: "alcohol",
    items: [
      { name: "Wyndridge Crafty Ciders", detail: null },
      { name: "Stateside Vodka Seltzers", detail: null },
      { name: "Surfside Vodka Teas", detail: null },
      { name: "Not Pizza Vodka Beverages", detail: null },
    ],
  },
  {
    title: "Specialty Drinks",
    group: "alcohol",
    items: [
      { name: "Punch Berry Wine Slushee", detail: null },
      { name: "Rose Lemon Breeze", detail: null },
    ],
  },
  {
    title: "Non-Alcohol",
    group: "non-alcohol",
    items: [
      { name: "Athletic Brewing Co. Non-Alcohol Beer", detail: "Guinness '0'" },
      { name: "La Croix Seltzer", detail: null },
      { name: "Coke, Diet Coke, Sprite", detail: null },
      { name: "Brisk Iced Tea", detail: null },
      { name: "Boylan Craft Sodas", detail: "Root Beer, Ginger Ale, Creme, Orange, Shirley Temple" },
      { name: "Honest Juice Pouches", detail: null },
      { name: "Horizon Milk Boxes", detail: null },
    ],
  },
];
