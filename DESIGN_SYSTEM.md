# ALL THE SMOKE BBQ & CATERING — DESIGN SYSTEM & AGENT GUIDELINES

## 1. Brand Core & Scroll Rhythm
- **Aesthetic Philosophy**: "Cast-Iron on Butcher Paper" (Dark culinary theater alternating with warm artisan utility breaks).
- **Dark Sections** (Hero, Spotlight Packages, TikTok Pitmaster Reels, Footer): Deep charcoal and obsidian (`#0A0A0A`, `#121214`, `#161619`, `#18181B`).
- **Light Utility Sections** (Delivery Radius, Booking/Quote Forms): Warm butcher paper and parchment (`#F5F0EB`, `#FAF7F2`).

## 2. Master Color Tokens
- **Background Obsidian**: `#0A0A0A` / `#121214`
- **Background Butcher Paper**: `#F5F0EB` (Borders: `border-stone-300/70`)
- **Background Soft Parchment**: `#FAF7F2`
- **Card Obsidian / Cast Iron**: `#141210` / `#161619` (Borders: `border-zinc-800/80` or `border-[#C8A97E]/30`)
- **Primary Headline (Dark Sections)**: Warm Bone Cream `#F4EFEA`
- **Primary Headline (Light Sections)**: Deep Espresso `#1C1917`
- **Eyebrows & Accents**: Antique Gold `#C8A97E`
- **Subheadings & Light Eyebrows**: Burnt Ember `#B45309`
- **Body Text (Dark)**: `#D8D2C6` / `text-stone-300` / `text-zinc-400`
- **Body Text (Light)**: `text-stone-600` / `text-stone-700`
- **Pricing & Tier Highlights**:
  - Standard Tiers: Antique Gold `#C8A97E`
  - Featured / Center Flagship Tiers: Ember Amber `#FF8C38`
- **FORBIDDEN COLORS**: Strictly forbid fluorescent construction yellow (`#FACC15`, `text-amber-400`, `bg-amber-500`) and stark optical white (`#FFFFFF`) backgrounds for inputs/forms.

## 3. Typography & Casing Rules
- **Headlines (`<h1>`, `<h2>`, `<h3>`)**: Must ALWAYS use Title Case (e.g., *"Elevated BBQ & Smokehouse Catering"*, *"Spotlight Catering Packages"*, *"TikTok Pitmaster Showcase"*). STRICTLY FORBID all-caps screaming text.
- **Eyebrow Badges**: Centered, uppercase tracking-widest `text-xs` in antique gold (`#C8A97E`) with star framing: `★ LABEL TEXT ★` on dark obsidian pills (`bg-zinc-900/90 border border-[#C8A97E]/30`).
- **CTAs & Action Buttons**: High-impact condensed display font (`font-display font-bold tracking-wider uppercase`).

## 4. Master CTA System (Live-Fire & Smoked Gold Pair)
Every prominent call-to-action is part of a harmonized pair:
- **Primary Live-Fire CTA Button** (Hero primary, center card CTAs, channel banner):
  - *Background*: Centered radial fire glow behind the text:
    `bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)]`
  - *Border*: Double neon hot-wire border: `border-2 border-[#FF7A00]`
  - *Shadow*: Outer ember bloom + inner incandescent heat:
    `shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)]`
  - *Typography*: High-contrast white with centered text shadow:
    `text-white font-display font-bold uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)]`
  - *Interaction*: `transition-all hover:scale-[1.02] active:scale-[0.98]`
- **Secondary Smoked Black & Antique Gold CTA Button** (Hero secondary, standard package cards):
  - *Background*: Smoked obsidian glass: `bg-black/60 backdrop-blur-md`
  - *Border*: Antique gold hotwire ring: `border border-[#C8A97E]`
  - *Shadow*: Subtle gold ambient aura: `shadow-[0_0_12px_rgba(200,169,126,0.15)]`
  - *Typography*: Antique gold `text-[#C8A97E]` with `[text-shadow:_0_1px_2px_rgba(0,0,0,0.95)]`
  - *Hover State*: Flares into flame on hover:
    `hover:border-[#FF7A00] hover:text-white hover:bg-black/80 hover:shadow-[0_0_18px_rgba(255,122,0,0.4)]`

## 5. Center Flagship Card Elevation & Ribbon Rule
In any 3-card tier grid (Per-Person Catering, Turnkey Party Pans, Weekly Meal Prep):
- **Desktop Elevation**: The center card lifts above neighboring cards: `lg:-translate-y-2 z-20`.
- **Illuminated Border Beam**: Outer container carries the animated ember conic beam:
  `bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_60deg,#EA580C_120deg,#FF8C38_180deg,transparent_240deg)]`
- **Inner Card Boundary**: Illuminated amber edge with ember bloom:
  `border-2 border-[#EA580C]/80 shadow-[0_0_30px_rgba(234,88,12,0.25)]`
- **Ribbon**: Distinctive pill badge reading:
  `★ MOST POPULAR ★` (`bg-gradient-to-r from-[#EA580C] to-[#9A3412] border border-[#FF7A00]/80 text-white font-display font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_14px_rgba(234,88,12,0.5)]`).
- **Pricing Token**: Rendered in ember amber (`#FF8C38`), while outer standard cards use antique gold (`#C8A97E`).
- **CTA**: Uses the Primary Live-Fire button, while outer cards use the Secondary Smoked Gold button.

## 6. Card Hover & Interactive Elements
- **Cards at Rest**: Use subtle antique gold border (`border border-[#C8A97E]/30`) on dark obsidian (`bg-[#0D0B0A]` or `bg-[#161619]`).
- **Cards on Hover**: Ignite with illuminated live-fire amber border and warm ember bloom:
  `hover:border-[#EA580C]/90 hover:bg-[#161311] hover:shadow-[0_8px_25px_rgba(234,88,12,0.3)] hover:-translate-y-1.5`
- **Play Buttons**: Centered radial fire glow disc with vector play glyph and glowing shadow:
  `bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] text-white shadow-[0_0_20px_rgba(255,122,0,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,122,0,0.8)]` (Never use flat yellow circles).
- **Quick Test Chips**: `border border-[#C8A97E]/30 hover:border-[#FF7A00] hover:bg-gradient-to-r hover:from-[#EA580C]/20 hover:to-[#C84A0A]/20 text-stone-200 hover:text-white`.

## 7. Horizontal Carousels & Scrollbars
- Never display native browser horizontal scrollbars.
- Always apply cross-browser scrollbar hiding utilities:
  `overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`

## 8. Asset & Imagery Standards
- **Culinary Photography**: Pure, uncompromised barbecue food photography (deep smoke rings, mahogany bark, juicy brisket slices, cast-iron mac and sides).
- **STRICTLY FORBIDDEN**: Never use images with baked-in website mockup text, headers, navigation bars, watermarks, or stock text overlays.
- **Brand Master Crest**: Official circular crest (`/brand/allthesmoke-logo.png`) enclosed in an antique gold circular ring (`border border-[#C8A97E]/40`).

## 9. Form Input Fields & Controls
- **Background**: Warm eggshell / soft parchment `bg-[#FAF8F5]` (strictly forbid stark optical white `#FFF`).
- **Typography**: `text-stone-900 placeholder:text-stone-400`.
- **Border & Focus**: `border border-stone-300 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] rounded-xl h-12 px-4`.

## 10. Strict Privacy, Contacts & Agency Attribution
- **OPERATOR LOCATION**: Strictly use *"Chicago’s Northwest Side (Dunning Hub / 60634)"*. NEVER output *"3401 N Orange Ave"*.
- **PHONE**: `(773) 707-9988` (linking to `tel:7737079988` in `#C8A97E` with `hover:text-[#EA580C]`).
- **INQUIRIES EMAIL**: `marion@allthesmokecatering.com`.
- **SOCIAL HANDLE**: `@allthesmokebbq_catering` (linking to `https://www.tiktok.com/@allthesmokebbq_catering` in `#C8A97E` with `hover:text-[#EA580C]`).
- **AGENCY ATTRIBUTION**: Footer must always contain:
  *"Designed By: Trident Website Design"* linking to `https://tridentwebsitedesign.com` in antique gold (`#C8A97E` with `hover:text-[#EA580C]`).
