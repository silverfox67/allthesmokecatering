# Autonomous PageSpeed & Core Web Vitals Optimization Protocol

## Objective & Stop Thresholds
Optimize this application to achieve a 95+ PageSpeed Insights score on both Mobile and Desktop.
- LCP (Largest Contentful Paint): < 1.8s
- CLS (Cumulative Layout Shift): < 0.05 (Target: 0.00)
- TBT / INP (Total Blocking Time / Interaction to Next Paint): < 150ms
- TTFB (Time to First Byte): < 200ms

> STOP CONDITION: Execute optimizations in ONE single pass across Sections 1 through 5. Once the build compiles and target metrics are met, stop immediately. Do NOT run repetitive speculative micro-optimization loops chasing the remaining 1–3 points.

---

## 1. Images & Hero Assets (LCP & CLS Fixes)
- LCP Hero Image: Apply priority={true} (or fetchpriority="high") to the primary above-the-fold hero image. Set explicit width/height attributes or standard aspect-ratio wrappers. Compress to .webp under 120KB.
- Below-the-Fold Media: Set loading="lazy" and decoding="async" on all non-hero images and icons. Wrap in fixed-dimension containers (w-X h-X flex-shrink-0).

## 2. Fonts & Typography (FOUC & Render-Blocking Fixes)
- No Remote CSS Imports: Never use @import url(...) in global CSS or inline styles.
- Next.js Font Subsetting: Load fonts strictly using next/font/google or next/font/local with { subsets: ['latin'], display: 'swap', preload: true }.

## 3. Hydration & JavaScript Execution (TBT & INP Fixes)
- Server Component First: Default all pages and layout wrappers to React Server Components. Confine 'use client' strictly to interactive leaf components.
- Dynamic Lazy Loading: Lazy-load below-the-fold interactive components (accordions, carousels, map embeds) using next/dynamic with { ssr: false }.
- Third-Party Scripts: Load analytics and widgets using next/script with strategy="lazyOnload". Never place synchronous <script> tags in <head>.

## 4. CSS & DOM Cleanliness
- Ensure Tailwind CSS production purge is active.
- Keep DOM depth under 32 levels and total DOM nodes under 800 per page.

## 5. Cloudflare & Edge Delivery Rules
- Static Asset Caching: Verify or create public/_headers with immutable static caching.
- Verify HTML pages serve Cache-Control: public, max-age=0, must-revalidate.

---

## 6. Sub-90 Remediation & Diagnostic Triage (Pass 2 Only)
- LCP > 2.5s: Compress hero image to .webp under 100KB, set priority={true}, verify hero is in raw initial HTML.
- TBT > 150ms / INP > 200ms: Replace raw iframes (Google Maps, YouTube) with static preview facades loaded on click. Move trackers to strategy="lazyOnload".
- CLS > 0.05: Set explicit aspect-ratio or fixed min-h-[...] on dynamic containers and headers. Ensure icon containers have flex-shrink-0.
- Render-Blocking Resources: Remove all @import in CSS. Migrate lingering fonts to next/font/google.
