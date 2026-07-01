# Braeloch Brewing — Website 2.0 Architecture & Build Plan

_Moonshot custom build. Goal: a fast, on-brand, mostly-automated site where the dynamic
content (taps, events, social) updates itself instead of going stale._

---

## 1. Vision & Design Direction

**The problem we're solving:** the current Squarespace site is a static brochure while the
brewery is a living, rotating thing (taps change, live music weekly, seasonal slushees, monthly
features). Every fresh thing lives on Untappd/Instagram/Arryved and the site can't keep up.

**Design language — "Modern Craft / Scottish Heritage":**
Braeloch = Scottish for _brae_ (hillside) + _loch_ (lake). Lean into that heritage without
being kitschy. Reviewers love the "massive rustic space" and beer garden — the site should feel
warm, tactile, and generous, but with modern typography, motion, and speed.

Blends two of the skill's style categories:
- **Creative Portfolio** — bold type, image-forward, scroll-triggered motion (for atmosphere).
- **E-commerce Optimized** — trust signals, always-visible CTAs, conversion-first flows (for
  takeout, events, merch).

### How this maps to the `modern-web-design` skill

We take the skill's **E-commerce Optimized** category as the structural base (trust signals,
conversion CTAs, product-card patterns for taps/menu) and borrow **Creative Portfolio**'s
display-type + motion for atmosphere — but we **override its default palettes** with Braeloch's
own brand colors (keeping the existing logo/identity, per the locked decision). We inherit the
skill's spacing scale, elevation, motion timing, breakpoints, a11y standards, and reuse its
component templates as scaffolds (see §5).

### Design tokens
> Color values below are **placeholders** — Phase 0 samples the real hex from the existing logo &
> photos and replaces them (brand identity is being kept, not redesigned). Everything else
> (spacing, elevation, motion, breakpoints) is adopted from the skill's `design-systems.md`.
```css
/* Brand color — PLACEHOLDER, resample from logo in Phase 0 */
--ale-amber: #C8781E;   /* primary accent (beer copper) — maps to skill's --cta/--brand-primary */
--forest:    #1F3D2B;   /* deep Scottish green — dark sections/headers */
--cream:     #F5EFE2;   /* warm paper background */
--charcoal:  #211E1B;   /* body text */
--heath:     #8A5A3B;   /* secondary warm brown */
--sky:       #7FA6A0;   /* muted loch teal — links/small accents */

/* Typography — Creative Portfolio pattern, brewery-tuned */
--font-display: 'Fraunces', serif;        /* heritage display (skill uses Playfair) */
--font-body:    'Inter', system-ui, sans; /* legibility on phones (skill default) */

/* Adopted verbatim from skill's design-systems.md */
--space-2:.5rem; --space-4:1rem; --space-6:1.5rem; --space-8:2rem; --space-12:3rem; --space-16:4rem;
--shadow-md:0 4px 6px rgba(0,0,0,.07); --shadow-lg:0 10px 15px rgba(0,0,0,.1); --shadow-xl:0 20px 25px rgba(0,0,0,.1);
--duration-fast:150ms; --duration-normal:250ms; --duration-slow:350ms; --ease:cubic-bezier(.4,0,.2,1);
/* Breakpoints: mobile-first 640/768/1024/1280/1536 */
```

**Motion:** scroll-reveal via the skill's `IntersectionObserver` + `fadeInUp` keyframe; card
`hover-lift`/`hover-scale` and `translateY(-1px)` CTA lifts from its animation library. Always
gated by `prefers-reduced-motion`.

**Accessibility target:** skill's standard — AA 4.5:1 body / 3:1 large text (aim AAA 7:1 where the
warm palette allows), visible `focus-visible` outlines, semantic HTML, ARIA, logical headings.

---

## 2. Recommended Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Server components + ISR let us auto-refresh taps/events on a schedule with zero manual edits. Room to grow into e-commerce/reservations. |
| Styling | **Tailwind CSS** + CSS variables for tokens | Per skill guidance; fast, consistent, small footprint. |
| CMS | **Sanity** (headless) | For the *human-authored* content (menu, story, private-events copy, gallery). Non-technical staff get a clean editor; content is versioned. |
| Hosting | **Vercel** | Native Next.js, edge CDN, cron jobs for the automation, preview deploys. |
| Media | Sanity CDN / Vercel image optimization | Responsive images, lazy loading, AVIF/WebP. |
| Analytics | Vercel Analytics + GA4 | Core Web Vitals + conversion tracking. |

_Alternative considered: Astro. Lighter for a mostly-static site, but Next.js wins because your
"shoot for the moon" list (automation jobs, future reservations/merch, interactivity) benefits
from a real server runtime._

---

## 3. The Automation Architecture (the crown jewel)

Your priority was **"mostly automated."** This is the heart of the build. Instead of renting 3
mismatched Squarespace widgets, one codebase pulls each source into our own styled components.

```
  SOURCE                    MECHANISM                        RENDERED AS
  ───────────────────────   ──────────────────────────────   ─────────────────────────
  Untappd (taps)      ─┐    Cron (hourly) → cache/ISR    →   Custom tap-list section
  Instagram (posts)   ─┤    Cron (hourly) → cache        →   "Right now" social strip
  Google Calendar     ─┼──▶ Cron (daily)  → cache        →   Live events / music calendar
   (events/music)      │
  Arryved (takeout)   ─┤    Deep-link / API if available →   Inline "Order" CTA
  Sanity (menu, copy) ─┘    Webhook → on-publish rebuild →   Menu, story, gallery
```

**Integration realities to validate in Phase 0 (before committing):**
- **Untappd:** ✅ **DECIDED — Untappd for Business confirmed.** We pull the live tap list via
  their Menu API / digital-menu source and render it in our own styled `TapList` component
  (full brand control). Menu stays managed in one place the staff already use.
- **Instagram:** Instagram Basic Display API (or a maintained aggregator) with a long-lived
  token + refresh job.
- **Events:** ✅ **DECIDED & FULLY VALIDATED — keep Common Ninja, read its public data.**
  Brandon's wife keeps her existing Common Ninja calendar dashboard — zero workflow change. We
  found the events are **server-embedded in the public widget page**, so we can read them with a
  plain `GET` and **no auth token / no paid tier at all**:
  - **Source:** `https://commoninja.site/{widget_id}` → parse the `__NEXT_DATA__` script tag →
    `props.pageProps.pluginData.data.content.items` (an array of events).
  - **Widget id:** `8486c21f-ed86-4f36-8340-55ee24aea676`.
  - **Per-event schema:** `id, title, description, start, end, allDay, media` (image URL),
    `location, link, linkText, recurringEvent` (`"daily"`/`"weekly"`), `totalRecurrings`,
    `backgroundColor/borderColor/textColor/changeColors`.
  - **Verified live:** 87 events (2024-11-29 → 2026-11-21), 16 upcoming as of 2026-07-01
    (e.g. _Live Music: Steve Liberace_ Jul 3, _Open Mic Night_, _Braeloch Blood Drive_).
  - ⚠️ **Recurrence is rule-based, NOT pre-expanded:** recurring items carry
    `recurringEvent: "weekly"` + `totalRecurrings: N`. Our `EventCalendar` must **expand** them
    into individual dated instances when rendering (and for `Event` JSON-LD).
  - **Robustness:** reading `__NEXT_DATA__` is zero-friction but depends on Common Ninja's page
    structure. If they ever change it, upgrade to the authenticated **Widget Data API**
    (`GET api.commoninja.com/platform/api/v1/widgets/{id}`, Bearer token) — same data, stable
    contract. Cache our nightly pull either way so a Common Ninja outage never blanks the page.
- **Arryved:** confirm whether they expose an order API or we deep-link. Deep-link is fine for v1.

Each source has a **graceful fallback** (last-cached data + a friendly message) so a third-party
outage never blanks the page — unlike today's empty tap embed.

---

## 4. Site Architecture

```
/                     Home — live hub: open-now status, this weekend, current taps, feature, CTAs
/beer                 Live tap list + cans/to-go (auto from Untappd) + "where to find our beer"
/food                 Menu w/ prices, photos, dietary tags (Sanity) + Order CTA
/events               Live calendar (music + events) + "this weekend" + book private events
/private-events       Venue pitch (weddings/corporate/birthdays) + real inquiry form
/about                Story, building history, brewhouse, 3D tour, gallery
/visit                Hours (open-now), map/directions, parking, dog-friendly, FAQ
/order                Takeout entry (Arryved) — kept on-brand
/shop (Phase 3)       Merch / beer-to-go reservations
/contact              Form → inbox, socials
```

**Global chrome:**
- Sticky header: logo · Beer · Food · Events · Visit · **Order** (accent button) · open-now pill.
- Mobile-first: hamburger → full-screen menu; the three phone-critical actions (Order,
  Directions, What's on tap) always one tap away.
- Footer: hours, address, socials, newsletter signup, structured-data source of truth.

---

## 5. Component Inventory

**Scaffolds from the skill** (`assets/component-templates.html`) — restyled with our tokens, not
used as-is: the sticky **Professional Header** (+ mobile-menu toggle JS), a **Hero** section, the
**Feature Grid** (repurposed for "3 reasons to visit" / feature callouts), the **Contact Form**
pattern (→ private-events + contact forms), the **Footer**, and the page's `IntersectionObserver`
scroll-animation script. These give us a tested, accessible starting structure; we swap the blue
SaaS palette for Braeloch's warm brand tokens and Fraunces/Inter type.

**Braeloch-specific components (built new):**
- `OpenNowPill` — computes open/closed from hours, live everywhere.
- `TapList` / `TapCard` — name, style, ABV, description, availability; filter by style; low-keg flag.
- `EventCalendar` / `EventCard` + `ThisWeekend` homepage module.
- `MenuSection` (tabbed categories) with price, photo, dietary tags.
- `SocialStrip` — recent Instagram, auto-pulled.
- `Hero` — full-bleed with the rustic space + seasonal feature callout (slushees, Hive Mind).
- `PrivateEventForm` — date/headcount/type → email/CRM, with validation.
- `NewsletterSignup`, `Gallery`/lightbox, `MapDirections`, `Footer`.

---

## 6. SEO, Performance, Accessibility (non-negotiable, per skill)

- **JSON-LD structured data:** `Brewery`/`LocalBusiness` (hours, address, phone), `Menu`,
  `Event` for each live-music date → Google surfaces them directly.
- **Core Web Vitals:** server components, image optimization, minimal JS, ISR caching.
- **A11y:** semantic HTML, ARIA, keyboard nav, alt text, `prefers-reduced-motion`, contrast-checked tokens.
- **Local SEO:** consistent NAP, Open Graph/social cards, sitemap, and reclaim the freshness
  currently siloed on Instagram/Untappd.

---

## 7. Phased Roadmap

**Phase 0 — Discovery & de-risk (before building)**
Confirm API access: Untappd for Business, Instagram token, Arryved, decide Google Calendar vs
Sanity for events. Get brand assets (logo vectors, photos). Lock design tokens against the logo.

**Phase 1 — Foundation**
Next.js + Tailwind + Sanity + Vercel scaffold. Design system + global chrome (header/footer/
open-now). Deploy pipeline + preview URLs.

**Phase 2 — Fix the broken flows (highest ROI)**
Live `TapList` (Untappd). Live `EventCalendar`. `/food` menu with prices/photos/dietary tags.
These three alone eclipse the current site.

**Phase 3 — Experience & conversion**
Home live-hub, social strip, gallery + 3D tour, private-events form, newsletter, full SEO/JSON-LD.

**Phase 4 — Growth (optional)**
Merch / beer-to-go shop, tighter Arryved integration, loyalty/email automation.

**Phase 5 — Launch**
Content migration, redirects from old URLs, QA on real devices, analytics, DNS cutover.

---

## 8. Decisions — Locked & Open

**Locked:**
- ✅ **Untappd for Business** confirmed → live tap list via their menu source, our styling.
- ✅ **Brand:** keep current logo & colors. Phase 0 samples exact hex values from the logo/photos
  and replaces the placeholder tokens in §1 (those were an educated guess, not the final palette).
- ✅ **E-commerce:** out of scope for now → Phase 4, revisit later.
- ✅ **Events must support heavy recurrence** (weekly live music, repeating events).
- ✅ **Events = keep Common Ninja (her current tool), pull via its API** into our branded
  component. No workflow change for her. Verify API returns event data in Phase 0; fallback =
  restyled iframe embed.

**Open:**
1. **Domain/host:** stay on current DNS provider; point to Vercel for the app. (Confirm registrar.)

---

## 9. Phase 0 — Detailed Punch-List (do before writing app code)

Goal: de-risk every integration and gather every asset so Phase 1+ is pure building, no waiting.

### A. Integration verification & credentials (highest-risk first)
- [x] **Common Ninja events — FULLY VALIDATED, no blockers.** Events read from the public widget
      page (`__NEXT_DATA__ → …content.items`), **no token/paid tier needed**. Widget id, schema,
      and 87 live events confirmed (see §3). Only remaining build task: **expand recurring events**
      (`recurringEvent`/`totalRecurrings`) into instances in the `EventCalendar` component. The
      authed Widget Data API stays on file as the robustness upgrade if their page ever changes.
- [ ] **Untappd for Business** — confirm login; locate the menu/section for the taproom; get the
      **venue/menu ID** + API token or the digital-menu data source. Verify we can read beers
      (name, style, ABV, description, on/off status) programmatically.
- [ ] **Instagram** — create/confirm a Meta app, connect the @braelochbrewing account, generate a
      **long-lived access token**, and note the ~60-day refresh requirement (cron job in Phase 2).
- [ ] **Arryved** — confirm the **takeout URL** and whether any order API exists. Default plan:
      on-brand deep-link button (no API needed for v1).

### B. Brand assets (needed to finalize tokens)
- [ ] **Logo in vector** (SVG/AI/EPS) — sample exact hex values → replace the placeholder colors
      in §1. This is what makes "keep current brand" real.
- [ ] **High-res photography** — the rustic space, beer garden, food plating, taps, live music,
      dog-friendly moments. Group by page (hero / gallery / food / events).
- [ ] Fonts: Fraunces + Inter are open-license (Google Fonts) — no procurement needed. Confirm
      they pair well with the logo's lettering, else pick alternates.

### C. Content source-of-truth (for Sanity seeding)
- [ ] **Food menu WITH prices + dietary tags** — the current site has neither. Get the real menu
      (categories, items, descriptions, prices, veg/GF flags) — from POS or a fresh doc.
- [ ] **Beer descriptions** — reuse Untappd copy (auto), plus any house favorites to feature.
- [ ] **Brand story / building history / brewhouse / 3D tour** — migrate existing copy + the 3D
      tour embed URL from the current site.
- [ ] **Hours / address / phone / email** — single source of truth for `OpenNowPill` + JSON-LD.
- [ ] **Private-events copy** + which fields the inquiry form should capture (date, headcount,
      event type, budget?) and **where submissions go** (which inbox / CRM).

### D. Decisions to close
- [ ] **Domain registrar / DNS provider** — where the domain lives, so we can point it at Vercel.
- [ ] **Form backend** — email inbox for contact + private-events (e.g. Resend/Formspree → which
      address). Confirm who monitors it.
- [ ] **Analytics** — GA4 property + Vercel Analytics; confirm ownership.

### E. Environment setup (quick, once the above is unblocked)
- [ ] `git init` the project + repo host (GitHub).
- [ ] Scaffold Next.js 15 + TypeScript + Tailwind; drop in the design tokens from §1.
- [ ] Create Sanity project + Vercel project; wire env vars (Untappd, Instagram, Common Ninja,
      form backend) as secrets.

**Exit criteria for Phase 0:** every integration is proven or has a chosen fallback, all brand
assets + menu-with-prices are in hand, and the empty scaffold deploys to a Vercel preview URL.
