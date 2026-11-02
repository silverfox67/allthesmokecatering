import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-28 bg-[#F5F0EB] text-[#1C1917] overflow-hidden border-t border-b border-stone-300/70"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: The Story, Philosophy & Credentials        */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Pill Eyebrow Badge (Matching Light Sections) */}
            <div>
              <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-950 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
                ★ ABOUT ALL THE SMOKE CATERING ★
              </span>
            </div>

            {/* Main Headline (Clean solid dark typography for light section) */}
            <div className="space-y-3">
              <h2
                id="about-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] tracking-wide leading-[1.15]"
              >
                Real Hardwood. Low &amp; Slow. Quality Without Compromise.
              </h2>
            </div>

            {/* Core Story Paragraphs */}
            <div className="space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
              <p>
                At <strong className="text-stone-900 font-bold">All The Smoke Catering</strong>, real barbecue takes time, patience, and passion. We use real hardwood, custom rubs, and low-and-slow cooking to deliver deep bark, rich smoky flavor, and quality without compromise.
              </p>
              <p>
                Our custom mobile trailer smoker brings the live-fire experience straight to your venue. From weddings and corporate events to private celebrations throughout Chicagoland, we bring the heat, the flavor, and an experience worth remembering.
              </p>
            </div>

            {/* Bold Brand Creed / Callout Banner (Butcher Paper Styling) */}
            <div className="relative overflow-hidden rounded-2xl bg-[#FAF8F5] border-l-4 border-l-[#EA580C] border border-stone-300/80 p-5 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <span className="text-3xl text-[#EA580C] select-none leading-none">“</span>
                <div>
                  <p className="font-display text-xl sm:text-2xl font-bold tracking-wide text-[#1C1917] uppercase italic">
                    No shortcuts. No compromise. Just serious barbecue.
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-[#EA580C] tracking-wider uppercase">
                    — Marion Bolden, Pitmaster &amp; Founder
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Craft Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-300/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">🪵</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">100% Hardwood</span>
                </div>
                <p className="text-xs text-stone-600 leading-snug">
                  Cured oak &amp; hickory live smoke, never pellets or shortcuts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-300/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">🚚</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Mobile Rig</span>
                </div>
                <p className="text-xs text-stone-600 leading-snug">
                  Custom trailer smoker rolls directly to your venue or event.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-300/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">📍</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">Chicagoland</span>
                </div>
                <p className="text-xs text-stone-600 leading-snug">
                  Serving city and suburbs with punctual, piping-hot setups.
                </p>
              </div>

            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#packages"
                className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white font-display font-bold text-sm tracking-wider uppercase shadow-[0_0_18px_rgba(234,88,12,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Catering Packages
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-zinc-950 hover:bg-black text-[#C8A97E] hover:text-white border border-stone-800 font-display font-bold text-sm tracking-wider uppercase transition-colors shadow-sm"
              >
                Request Event Quote
              </a>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Dual Pitmaster Craft & Mobile Smoker Cards */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none space-y-5">
              
              {/* 1. Primary Feature Card: Custom Mobile Trailer Smoker Rig */}
              <div className="relative rounded-[24px] overflow-hidden border border-stone-300/90 bg-zinc-950 shadow-2xl shadow-stone-900/25 group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src="/images/about/marion-mobile-smoker-rig.jpg"
                    alt="Marion Bolden's custom single-axle offset trailer smoker rolling live hardwood smoke on-site at a Chicagoland park venue"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                    priority={false}
                    className="object-cover object-center scale-[1.01] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Subtle Cinematic Vignette */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/25 pointer-events-none" 
                    aria-hidden="true" 
                  />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="text-[#C8A97E] text-[11px] uppercase font-extrabold tracking-widest bg-zinc-950/95 px-3 py-1 rounded-full border border-[#C8A97E]/40 inline-flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
                      <span>ON-SITE MOBILE SMOKER RIG</span>
                    </span>
                  </div>

                  {/* Bottom Information Glass Overlay */}
                  <div className="absolute bottom-3.5 inset-x-3.5 z-10">
                    <div className="p-3.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C8A97E] uppercase tracking-wider flex items-center gap-1.5">
                          <span>★</span> Custom Live-Fire Trailer Smoker
                        </span>
                        <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                          Venue Ready
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-snug">
                        Marion&rsquo;s heavy-gauge offset smoker rig rolls directly to your park, wedding, or corporate venue rolling live oak &amp; hickory smoke.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Secondary Craft Card: Hand-Carved Signature Brisket */}
              <div className="relative rounded-[20px] overflow-hidden border border-stone-300/90 bg-zinc-950 shadow-xl shadow-stone-900/20 group">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src="/images/about/pitmaster-brisket-carve.webp"
                    alt="All The Smoke Catering pitmaster wearing black gloves carving a juicy smoked brisket with deep peppery bark"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                    priority={false}
                    className="object-cover object-center scale-[1.01] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" 
                    aria-hidden="true" 
                  />
                  <div className="absolute bottom-3 inset-x-3.5 z-10 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-wider block">
                        ★ Hand-Carved Signature Brisket
                      </span>
                      <p className="text-[11px] text-zinc-300">
                        14-hour hardwood smoke &bull; Carved fresh to order
                      </p>
                    </div>
                    <Link
                      href="/gallery"
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#EA580C] text-white text-[11px] font-bold uppercase tracking-wider border border-white/20 transition"
                    >
                      View Gallery &rarr;
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;
