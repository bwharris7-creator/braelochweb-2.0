/**
 * Restore Sanity content from a backup produced by scripts/backup-content.mjs.
 * Uses createOrReplace, so it is safe to re-run: documents are restored to the
 * backed-up state without duplicating.
 *
 * Usage: SANITY_API_WRITE_TOKEN=xxx node scripts/restore-content.mjs content-backups/<file>.json
 *
 * By default event inquiries are skipped (they are an append-only paper trail —
 * restoring them could resurrect deleted ones). Pass --include-inquiries to
 * restore those too.
 */
import { readFile } from "node:fs/promises";

const token = process.env.SANITY_API_WRITE_TOKEN;
const file = process.argv[2];
const includeInquiries = process.argv.includes("--include-inquiries");

if (!token || !file) {
  console.error(
    "Usage: SANITY_API_WRITE_TOKEN=xxx node scripts/restore-content.mjs <backup.json> [--include-inquiries]"
  );
  process.exit(1);
}

const backup = JSON.parse(await readFile(file, "utf8"));
const { project, dataset, documents } = backup;

const docs = documents.filter((d) => includeInquiries || d._type !== "eventInquiry");
if (docs.length === 0) {
  console.error("Nothing to restore.");
  process.exit(1);
}

// Strip system fields Sanity manages itself; _id/_type are kept.
const clean = docs.map(({ _rev, _createdAt, _updatedAt, ...doc }) => doc);

const res = await fetch(
  `https://${project}.api.sanity.io/v2026-07-01/data/mutate/${dataset}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations: clean.map((doc) => ({ createOrReplace: doc })) }),
  }
);

const body = await res.json();
if (!res.ok) {
  console.error("FAILED", res.status, JSON.stringify(body, null, 2));
  process.exit(1);
}
console.log(`Restored ${clean.length} documents from ${file} (transaction ${body.transactionId})`);
