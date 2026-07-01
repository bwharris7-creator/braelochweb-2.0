/**
 * Sanity project coordinates. Empty until the free Sanity account/project is
 * created (Phase 0 §9E) — every consumer must degrade gracefully when unset
 * so the site builds and runs pre-signup.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-07-01";

export const sanityConfigured = projectId.length > 0;
