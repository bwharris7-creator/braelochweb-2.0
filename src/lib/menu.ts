import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "@/sanity/env";

/**
 * Food menu data (PLAN.md §2 CMS requirement).
 * Live from Sanity once the project is connected; until then (and if a fetch
 * ever fails) falls back to sample data so /food never renders empty.
 * Revalidates every 60s so the manager's published edits appear fast.
 */

export interface MenuItem {
  name: string;
  description: string;
  price: number | null;
  dietaryTags: string[];
  photoUrl: string | null;
}

export interface MenuCategory {
  title: string;
  note?: string | null;
  items: MenuItem[];
}

export interface MenuResult {
  categories: MenuCategory[];
  /** true = editable content from Sanity; false = built-in sample data */
  live: boolean;
}

const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

const MENU_QUERY = /* groq */ `
*[_type == "menuCategory"] | order(order asc) {
  title,
  note,
  "items": *[_type == "menuItem" && references(^._id) && available != false] | order(order asc) {
    name,
    "description": coalesce(description, ""),
    price,
    "dietaryTags": coalesce(dietaryTags, []),
    "photoUrl": photo.asset->url
  }
}`;

export async function getMenu(): Promise<MenuResult> {
  if (client) {
    try {
      const categories = await client.fetch<MenuCategory[]>(
        MENU_QUERY,
        {},
        { next: { revalidate: 60 } }
      );
      const nonEmpty = categories.filter((c) => c.items.length > 0);
      if (nonEmpty.length > 0) return { categories: nonEmpty, live: true };
    } catch {
      // fall through to sample data
    }
  }
  return { categories: SAMPLE_MENU, live: false };
}

/** Sample menu (from the current site's offerings) shown until Sanity is connected. */
const SAMPLE_MENU: MenuCategory[] = [
  {
    title: "Shareables",
    items: [
      { name: "Brewhouse Hummus", description: "Basil oil, paprika, crudité, grilled flatbread", price: 12, dietaryTags: ["V"], photoUrl: null },
      { name: "Bavarian Pretzel", description: "House beer cheese, whole-grain mustard", price: 11, dietaryTags: ["V"], photoUrl: null },
      { name: "Loaded Frites", description: "Beer cheese, bacon, scallion, crema", price: 13, dietaryTags: [], photoUrl: null },
    ],
  },
  {
    title: "Flatbreads",
    items: [
      { name: "Margherita", description: "San Marzano tomato, fresh mozzarella, basil", price: 14, dietaryTags: ["V"], photoUrl: null },
      { name: "Mushroom & Ale", description: "Kennett Square mushrooms, caramelized onion, fontina, ale glaze", price: 16, dietaryTags: ["V"], photoUrl: null },
    ],
  },
  {
    title: "Tacos",
    items: [
      { name: "Baja Fish Tacos", description: "Crispy cod, cabbage slaw, chipotle crema, lime", price: 15, dietaryTags: [], photoUrl: null },
      { name: "Carnitas Tacos", description: "Slow pork, salsa verde, pickled onion, cotija", price: 14, dietaryTags: ["GF"], photoUrl: null },
    ],
  },
  {
    title: "Kids & Sweets",
    items: [
      { name: "Chicken Fingers & Frites", description: "The undisputed kids' favorite", price: 9, dietaryTags: [], photoUrl: null },
      { name: "Seasonal Dessert", description: "Ask what the kitchen's spinning this week", price: 8, dietaryTags: ["V"], photoUrl: null },
    ],
  },
];

export function fmtPrice(price: number): string {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

export const TAG_LABELS: Record<string, string> = {
  V: "Vegetarian",
  VG: "Vegan",
  GF: "Gluten-Free",
  S: "Spicy",
};
