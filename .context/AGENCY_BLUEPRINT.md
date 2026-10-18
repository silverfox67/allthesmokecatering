# Trident Agency Architecture & Delivery Blueprint
Stack: Next.js (App Router) | Cloudflare Pages | Supabase | Brevo REST API | Zoho Mail

---

## 1. Problem-Resolution Copy Architecture (E-E-A-T)
Replace generic promotional fluff and standard FAQs with this 4-step diagnostic structure on all service and case-study pages:
1. The Operational Bottleneck (Symptom): Detail the exact client problem, system failure, or stalled metric under real-world conditions.
2. The Forensic Diagnosis: Explain why standard approaches failed and identify the root cause (e.g., DNS misconfiguration, unindexed schema, worn mechanical tolerances).
3. The Tactical Resolution: Provide the exact technical, mechanical, or operational fix using numbered procedural steps (1., 2., 3.) to establish clear hierarchy for Google AI Overviews.
4. The Measurable Outcome: State measurable outcome metrics (e.g., load time cut from 4.2s to 1.1s, bounce rate dropped 35%, zero callbacks in 180 days).

---

## 2. Google AI Search, Schema & Semantic Indexing
- Direct-Answer Semantic Law: Every <h2> or <h3> posing an informational query must be followed immediately by a direct, declarative 40–60 word answer paragraph. Follow with bulleted summaries or comparison tables (≥3 rows × ≥2 columns).
- JSON-LD Schema Automation: Inject structured data into page heads:
  - Root Layout: LocalBusiness / ProfessionalService with legal name, address, coordinates, telephone, hours, and founder attribution.
  - Service Pages: Service with hasOfferCatalog.
  - Diagnostic Teardowns: HowTo with HowToStep arrays matching the resolution steps.
- Physical Verification Signals: Footer must include registered legal business name, copyright, physical municipality, contact phone/email, and statutory liability notices (e.g., FL § 773.04).

---

## 3. Infrastructure, DNS Cutover & Headers
- Zero-Downtime DNS Cutover:
  1. Audit existing MX/TXT records (dig MX clientdomain.com) before changing nameservers.
  2. Pre-populate all MX, SPF, DKIM, and DMARC records in Cloudflare DNS before pointing nameservers.
  3. Set mail records (MX, mail CNAMEs) to "DNS Only" (Grey Cloud). Never proxy mail routing.
  4. Point @ and www to Cloudflare Pages (your-project.pages.dev) with "Proxied" (Orange Cloud) enabled.
  5. Set Cloudflare SSL/TLS to "Full (Strict)".
- Zoho Mail DNS Baseline:
  - MX: mx.zoho.com (10), mx2.zoho.com (20), mx3.zoho.com (50)
  - SPF: v=spf1 include:zoho.com include:spf.brevo.com ~all
  - DMARC: v=DMARC1; p=quarantine; rua=mailto:admin@DOMAIN.com

---

## 4. Dual PWA Setup
- Public Marketing Site: Root / linked to public/manifest.json. Standard browser rendering with subtle install prompt.
- Authenticated Client/ERP Portal: Route group /(portal) or /admin linked to public/portal-manifest.json with display: "standalone", orientation: "portrait-primary", and offline fallback caching via public/sw.js.

---

## 5. Pre-Flight Launch Checklist (Core Web Vitals Guardrails)
Before releasing to production or handing off client builds, verify compliance with these 4 non-negotiable performance guardrails:
1. Font Policy: Strictly self-host 1–2 `.woff2` files in `/public/fonts/` via `@font-face` with `font-display: swap` (or Next.js `next/font/local`). Explicitly forbid external `fonts.googleapis.com` or `fonts.gstatic.com` links in `<head>`.
2. Hydration Rule: Keep the root application container (`<div id="root">` or Next.js body shell) clean of injected static HTML to prevent React Hydration Error #418.
3. Preload Guardrails: Any above-the-fold desktop hero image preload must include `fetchpriority="high"` and `media="(min-width: 641px)"` so mobile bandwidth is never split on 4G throttling.
4. Audit Protocol: Performance optimization iterations must be capped at 3 passes and run strictly against local production builds (`npm run build && local Lighthouse`). Never trigger remote deployments for incremental performance checks.

---

## 6. 2026–2027 Bespoke Design System & Niche Benchmarking Standard

### A. Pre-Scaffold Niche Discovery (Top 5 Benchmark)
Before writing UI markup, analyze the design conventions, color schemes, and visual hierarchy of the top 5 ranking sites in the target niche:
1. Identify the industry's visual vernacular (e.g., heavy industrial/rugged for contracting, refined muted luxury for equine/equestrian, bold editorial high-contrast for modern food & beverage).
2. Extract high-performing conversion anchors (sticky estimate builders, direct dispatch badges, credential chips).
3. Identify what makes competitors look dated (cluttered sliders, generic stock photography, low-contrast text) and explicitly design the antithesis.

### B. Anti-Generic AI Aesthetic Directives
Reject default AI web-design templates by enforcing these rules:
- Zero Centered AI Feature Rows: Never default to the generic "3 identical rounded cards with an icon on top." Use asymmetrical bento grids, staggered split layouts, or interactive proof panels.
- Sophisticated Color Palettes: Strictly avoid generic Tailwind `indigo-600` or `blue-600` hero gradients. Use custom CSS variables with rich, grounded brand tones (e.g., deep charcoal `#0f172a`, warm bone `#fcfbf9`, forest spruce `#1b382b`, or oxidized bronze) accented by sharp, deliberate contrast pops.
- Modern Editorial Typography: Enforce strict font pairing via `next/font`. Pair a high-character display headline font (tight tracking: `tracking-tight` or `tracking-tighter`, high optical weight) with an ultra-legible neutral body sans. Avoid default browser system fonts.
- Tactile Depth & Micro-Surfaces: Replace plain flat cards with modern subtle borders (`border-neutral-200/80` or `border-white/10` in dark themes), subtle mesh backdrops, micro-divider rules, and muted noise/grain overlays.
- High-Credibility Proof Strips: Include live status badges (e.g., pulsing green "Dispatch Active", verified contractor badge ribbons, licensing statutory chips) instead of generic floating checkmark icons.
