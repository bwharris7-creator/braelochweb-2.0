/**
 * Seed the Braeloch beverage list into Sanity (transcribed from the taproom's
 * printed Alcohol / Non-Alcohol board).
 * Idempotent: deterministic _ids + createOrReplace.
 * Usage: SANITY_API_WRITE_TOKEN=xxx node seed-beverages.mjs
 */
const PROJECT = "byjohnwx";
const DATASET = "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Set SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const cat = (id, title, group, order) => ({
  _id: `beverageCategory-${id}`,
  _type: "beverageCategory",
  title,
  group,
  order,
});

const item = (id, catId, order, name, detail) => ({
  _id: `beverageItem-${id}`,
  _type: "beverageItem",
  name,
  ...(detail ? { detail } : {}),
  category: { _type: "reference", _ref: `beverageCategory-${catId}` },
  order,
  available: true,
});

const docs = [
  cat("pa-wine", "Pennsylvania Wine", "alcohol", 1),
  cat("ciders-seltzers", "Ciders & Seltzers", "alcohol", 2),
  cat("specialty", "Specialty Drinks", "alcohol", 3),
  cat("non-alcohol", "Non-Alcohol", "non-alcohol", 1),

  item("penns-woods", "pa-wine", 1, "Penns Woods Winery", "Cabernet Sauvignon, Pinot Noir, Rose, Chardonnay"),
  item("britain-hill", "pa-wine", 2, "Britain Hill Winery", "Sangria, Pinot Grigio"),

  item("wyndridge", "ciders-seltzers", 1, "Wyndridge Crafty Ciders", null),
  item("stateside", "ciders-seltzers", 2, "Stateside Vodka Seltzers", null),
  item("surfside", "ciders-seltzers", 3, "Surfside Vodka Teas", null),
  item("not-pizza", "ciders-seltzers", 4, "Not Pizza Vodka Beverages", null),

  item("punch-berry-slushee", "specialty", 1, "Punch Berry Wine Slushee", null),
  item("rose-lemon-breeze", "specialty", 2, "Rose Lemon Breeze", null),

  item("athletic", "non-alcohol", 1, "Athletic Brewing Co. Non-Alcohol Beer", "Guinness '0'"),
  item("la-croix", "non-alcohol", 2, "La Croix Seltzer", null),
  item("fountain-soda", "non-alcohol", 3, "Coke, Diet Coke, Sprite", null),
  item("brisk", "non-alcohol", 4, "Brisk Iced Tea", null),
  item("boylan", "non-alcohol", 5, "Boylan Craft Sodas", "Root Beer, Ginger Ale, Creme, Orange, Shirley Temple"),
  item("honest-juice", "non-alcohol", 6, "Honest Juice Pouches", null),
  item("horizon-milk", "non-alcohol", 7, "Horizon Milk Boxes", null),
];

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v2026-07-01/data/mutate/${DATASET}?returnIds=true`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations: docs.map((doc) => ({ createOrReplace: doc })) }),
  }
);
const body = await res.json();
if (!res.ok) {
  console.error("FAILED", res.status, JSON.stringify(body, null, 2));
  process.exit(1);
}
console.log(`OK — ${body.results?.length ?? 0} docs, transaction ${body.transactionId}`);
