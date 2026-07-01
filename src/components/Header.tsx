"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/lib/site";
import OpenNowPill from "./OpenNowPill";

/**
 * Sticky global header (PLAN.md §4): logo · nav · Order CTA · open-now pill.
 * Structure adapted from the modern-web-design skill's Professional Header,
 * restyled with Braeloch tokens. Mobile: hamburger → full-screen menu with
 * the three phone-critical actions (Order, Directions, What's on tap).
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 shadow-card backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo.webp"
            alt="Braeloch Brewing — Kennett Square, PA"
            width={978}
            height={613}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-charcoal/80 transition-colors hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
          <OpenNowPill className="hidden lg:inline-flex" />
          <a
            href={site.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-forest transition-all hover:-translate-y-px hover:bg-gold-dark hover:shadow-card-hover"
          >
            Order
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="text-charcoal md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-cream-dark bg-cream px-4 pb-6 pt-4 md:hidden">
          <OpenNowPill className="mb-4" />
          <div className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-3 text-lg font-medium text-charcoal transition-colors hover:bg-cream-dark"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Phone-critical actions */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={site.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-gold px-4 py-3 text-center font-semibold text-forest"
            >
              Order
            </a>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border-2 border-forest px-4 py-3 text-center font-semibold text-forest"
            >
              Directions
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
