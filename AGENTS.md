# AGENTS.md — All The Smoke BBQ & Catering Operating Blueprint

## 0. Mandatory Pre-Flight & Execution Gate (READ FIRST)
- **Global Law**: Read & obey **Rule 0** in `~/AntigravityArmory/skills/continuous-learning/PLAYBOOK.md` before writing any code.
- **GBP Maps & Reviews (NEVER Guess or Use ZIP Embeds)**:
  - Maps CID: `14408245977024191985` (`0x2678ec651ad7958d:0xc7f45f60c0fa5df1`) — real GBP `<iframe>` only, **never** fake SVG maps.
  - Reviews: `https://search.google.com/local/writereview?placeid=ChIJjZXXGmXseCYR8V36wGBf9Mc` (`https://g.page/r/CfFd-sBgX_THECE/review`)
- **Design Tokens (NEVER Improvise)**:
  - Light Surface / Secondary Buttons & Cards on Dark: Warm **Butcher Paper (`#FAF8F5`)** with dark high-contrast text (NEVER `#181512` dark buttons on dark sections, NEVER dim low-contrast gray text).
  - Primary CTA: **Burnt-Orange Ember** styling matching `DeliveryChecker` & `ButcherBlockMenu`.
  - Section Eyebrows: `★ ... ★` pill badge style.
- **Apply-to-ALL & Playwright Gate**: Fix **ALL** matching elements in a section/file (never stop after the first one), then verify **Desktop (`1280x900`) + Mobile (`390x844`)** in Playwright before replying Done.

## 1. Project Overview & Identity
- **Client Legal Name:** Marion Bolden
- **Brand Entity:** All The Smoke BBQ & Catering[cite: 2]
- **Primary Live Domain:** `allthesmokecatering.com`
- **Secondary 301 Redirect:** `allthesmokebbqcatering.com`
- **Primary Executive Inbox:** `marion@allthesmokecatering.com` (Forwarded to `boldenmarion83@gmail.com`)
- **Secondary Alert Route:** `bbqcateringking83@gmail.com`[cite: 2]
- **Direct Phone:** `(773) 707-9988`[cite: 2, 3]
- **Commercial Base Hub:** 3401 N Orange Ave, Chicago, IL 60634
- **Social Channel:** TikTok `@allthesmokebbq_catering`[cite: 4]

## 2. Technical Stack & Architecture
- **Framework:** Next.js (App Router, TypeScript strict mode)
- **Styling:** Tailwind CSS with custom design tokens (Obsidian `#0A0A0A`, Charcoal `#121212`, Ember Gold `#F59E0B`, USMC Crimson `#990000`)
- **Hosting & Edge Delivery:** Cloudflare Pages & Cloudflare Edge Network
- **Transactional Dispatch:** Brevo API via Next.js Route Handlers (`src/app/api/lead/route.ts`)[cite: 1]
- **State & Database:** Supabase (`orders`, `leads`, `catering_inquiries`)
- **Payments:** Stripe Checkout & Payment Links (when Stripe is connected, wire `checkout.session.completed` webhook to update `allthesmoke.leads` / `allthesmoke.orders` status to `booked` / `paid` so Revenue Analytics updates automatically)

## 3. Strict Development Guardrails
1. **Zero AI-Slop Visuals:** Only use authentic documentary photography and verified real smokehouse assets processed through `sharp`. Never render cartoony 3D meats, plastic sheen, or anatomically flawed AI hands.
2. **Strict Typings:** Every data structure (catering packages, delivery tiers, media manifest, form schemas) must have an explicit TypeScript interface. Zero use of `any`.
3. **No-Storefront Framing:** Position the business strictly as an exclusive, booked-to-order live-fire smokehouse and commissary operation. Never display a retail pickup counter address without explicit client approval.
4. **Mobile-First Touch Targets:** All CTA buttons (`REQUEST A QUOTE`, `ORDER FOR PICKUP`) must exceed 48px touch targets for mobile pit and field use.
5. **No Broken Links:** All navigation anchors must resolve to valid DOM IDs (`#packages`, `#experience`, `#delivery`, `#quote`).

## 4. Subagent Roles & Task Division
- **Architect Agent:** Enforces TypeScript contracts, directory structures, and environment variable validation.
- **UI/UX Agent:** Builds responsive Tailwind components, cursor spotlight gradients, magnetic buttons, and border beams.
- **Backend/API Agent:** Implements Brevo dispatchers, Zod schema validation, Stripe webhooks, and Supabase client bindings.
- **QA/Review Agent:** Audits accessibility (WCAG AA), Lighthouse performance (>95 across all metrics), and link integrity.