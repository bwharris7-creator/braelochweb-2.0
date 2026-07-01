import type { Metadata } from "next";
import Studio from "./Studio";
import { sanityConfigured } from "@/sanity/env";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false }, // hidden URL: unlinked AND unindexed
};

export const dynamic = "force-static";

/**
 * Hidden admin entry (PLAN.md §2): unlinked from the public site, protected by
 * Sanity's real authentication. Until the Sanity project is created, shows a
 * setup notice instead of crashing.
 */
export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-forest">Studio isn&rsquo;t connected yet</h1>
        <p className="mt-4 text-charcoal/70">
          Create the free Sanity project, then set{" "}
          <code className="rounded bg-cream-dark px-1.5 py-0.5 text-sm">
            NEXT_PUBLIC_SANITY_PROJECT_ID
          </code>{" "}
          in <code className="rounded bg-cream-dark px-1.5 py-0.5 text-sm">.env.local</code> and
          restart. The menu editor will appear here.
        </p>
      </div>
    );
  }
  return <Studio />;
}
