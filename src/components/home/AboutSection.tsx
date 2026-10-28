import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-28 bg-[#0C0B0A] overflow-hidden border-t border-b border-amber-950/40"
      aria-labelledby="about-heading"
    >
      {/* Ambient Ember Background Glows */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#EA580C]/10 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#FF7A00]/10 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: The Story, Philosophy & Credentials        */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Pill Eyebrow Badge */}
            <div>
              <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
                ★ ABOUT ALL THE SMOKE CATERING ★
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h2
                id="about-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide leading-[1.15]"
              >
                Real Hardwood. Low &amp; Slow. Quality Without Compromise.
              </h2>
            </div>

            {/* Core Story Paragraphs */}
            <div className="space-y-4 text-zinc-300 text-base sm:text-lg leading-relaxed font-normal">
              <p>
                At <span className="text-white font-semibold">All The Smoke Catering</span>, real barbecue takes time, patience, and passion. We use real hardwood, custom rubs, and low-and-slow cooking to deliver deep bark, rich smoky flavor, and quality without compromise.
              </p>
              <p>
                Our custom mobile trailer smoker brings the live-fire experience straight to your venue. From weddings and corporate events to private celebrations throughout Chicagoland, we bring the heat, the flavor, and an experience worth remembering.
              </p>
            </div>

            {/* Bold Brand Creed / Callout Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#181410] to-[#121110] border-l-4 border-l-[#FF7A00] border border-amber-500/20 p-5 sm:p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
              <div className="flex items-start gap-3.5">
                <span className="text-2xl text-amber-400 select-none">“</span>
                <div>
                  <p className="font-display text-xl sm:text-2xl font-bold tracking-wide text-white uppercase italic">
                    No shortcuts. No compromise. Just serious barbecue.
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-[#C8A97E] tracking-wider uppercase">
                    — Marion Bolden, Pitmaster & Founder
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Craft Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🪵</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">100% Hardwood</span>
                </div>
                <p className="text-xs text-zinc-400 leading-snug">
                  Cured oak & hickory live smoke, never pellets or shortcuts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🚚</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Mobile Rig</span>
                </div>
                <p className="text-xs text-zinc-400 leading-snug">
                  Custom trailer smoker rolls directly to your venue or event.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📍</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Chicagoland</span>
                </div>
                <p className="text-xs text-zinc-400 leading-snug">
                  Serving city and suburbs with punctual, piping-hot setups.
                </p>
              </div>

            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#packages"
                className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white font-display font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Catering Packages
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-[#C8A97E] hover:text-white font-display font-bold text-sm tracking-wider uppercase transition-colors"
              >
                Request Event Quote
              </a>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: The Pitmaster Craft Hero Photo Card        */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Halo */}
              <div 
                className="absolute -inset-1.5 rounded-[28px] bg-gradient-to-b from-[#FF7A00]/40 via-[#EA580C]/20 to-transparent blur-lg opacity-70 group-hover:opacity-100 transition duration-500"
                aria-hidden="true" 
              />

              {/* Main Card */}
              <div className="relative rounded-[24px] overflow-hidden border border-amber-500/30 bg-zinc-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
                
                {/* Image Container with 4:5 Portrait Aspect Ratio */}
                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src="/images/about/pitmaster-brisket-carve.webp"
                    alt="All The Smoke Catering pitmaster wearing black gloves carving a juicy smoked brisket with deep peppery bark"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
                    priority={false}
                    className="object-cover object-center scale-[1.01] hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Subtle Cinematic Vignette */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" 
                    aria-hidden="true"
                  />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[#C8A97E] text-[11px] uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3 py-1 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
                      ★ LIVE PIT CRAFT ★
                    </span>
                  </div>

                  {/* Bottom Information Glass Overlay */}
                  <div className="absolute bottom-4 inset-x-4 z-10">
                    <div className="p-4 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#C8A97E] uppercase tracking-wider flex items-center gap-1.5">
                          <span>★</span> Hand-Carved Signature Brisket
                        </span>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                          Low & Slow
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-snug">
                        14-hour hardwood smoke, thick black pepper bark, carved live at your private or corporate event.
                      </p>
                    </div>
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
