/**
 * Back up all editable Sanity content (menu, beverages, event inquiries) to a
 * timestamped JSON file in content-backups/.
 *
 * Why: the food menu and beverage list live only in Sanity. Everyone with the
 * Administrator role can delete them, and the Free plan has no Editor role, so
 * every staff member with edit rights is necessarily an Administrator. This is
 * the safety net.
 *
 * Usage:  node scripts/backup-content.mjs [--include-inquiries]
 * Restore: node scripts/restore-content.mjs content-backups/<file>.json
 *
 * Event inquiries are EXCLUDED by default: they contain customer names, emails
 * and phone numbers, and these backups are committed to git. Pass
 * --include-inquiries for a local-only full export (do not commit that file).
 *
 * Reading is public, so no token is required to back up.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "byjohnwx";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const API = "2026-07-01";

const CONTENT_TYPES = ["menuCategory", "menuItem", "beverageCategory", "beverageItem"];
const TYPES = process.argv.includes("--include-inquiries")
  ? [...CONTENT_TYPES, "eventInquiry"]
  : CONTENT_TYPES;

const query = `*[_type in ${JSON.stringify(TYPES)} && !(_id in path("drafts.**"))]`;
const url = `https://${PROJECT}.api.sanity.io/v${API}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

const res = await fetch(url);
if (!res.ok) {
  console.error("Query failed:", res.status, await res.text());
  process.exit(1);
}
const { result } = await res.json();

const counts = {};
for (const doc of result) counts[doc._type] = (counts[doc._type] ?? 0) + 1;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "content-backups");
await mkdir(dir, { recursive: true });

const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
// Exports containing inquiries (customer PII) get a "local-only-" prefix, which
// .gitignore excludes — they must never be committed.
const prefix = TYPES.includes("eventInquiry") ? "local-only-" : "sanity-";
const file = join(dir, `${prefix}${stamp}.json`);
await writeFile(file, JSON.stringify({ project: PROJECT, dataset: DATASET, exportedAt: new Date().toISOString(), documents: result }, null, 2));

console.log(`Backed up ${result.length} documents → ${file}`);
for (const [type, n] of Object.entries(counts).sort()) console.log(`  ${type}: ${n}`);
