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

            {/* Sleek Editorial Quote Bar (Zero Bulky Box) */}
            <blockquote className="border-l-4 border-[#EA580C] pl-4 sm:pl-5 py-1">
              <p className="font-display text-xl sm:text-2xl font-bold tracking-wide text-[#1C1917] uppercase italic leading-snug">
                &ldquo;No shortcuts. No compromise. Just serious barbecue.&rdquo;
              </p>
              <footer className="mt-1 text-xs sm:text-sm font-bold text-[#EA580C] tracking-wider uppercase">
                — Marion Bolden, Pitmaster &amp; Founder
              </footer>
            </blockquote>

            {/* Compact Single-Row Proof Strip (Replaces 3 Stacked Mobile Boxes) */}
            <div className="pt-2 border-y border-stone-300/80 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-base">🪵</span>
                <span>100% Cured Oak &amp; Hickory</span>
              </span>
              <span className="hidden sm:inline text-stone-300">&bull;</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-base">🚚</span>
                <span>On-Site Mobile Smoker Rig</span>
              </span>
              <span className="hidden sm:inline text-stone-300">&bull;</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-base">📍</span>
                <span>All Chicagoland</span>
              </span>
            </div>

            {/* Action CTAs */}
            <div className="pt-1 flex flex-wrap items-center gap-3.5">
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
          {/* RIGHT COLUMN: Single Hero Card - Marion's Mobile Smoker  */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Shadow Drop */}
              <div 
                className="absolute -inset-1 rounded-[28px] bg-stone-900/10 blur-md pointer-events-none"
                aria-hidden="true" 
              />

              {/* Single Feature Card: Custom Mobile Trailer Smoker Rig */}
              <div className="relative rounded-[24px] overflow-hidden border border-stone-300/90 bg-zinc-950 shadow-2xl shadow-stone-900/25 group">
                <div className="relative aspect-[4/4.2] sm:aspect-[4/3.8] w-full overflow-hidden bg-zinc-900">
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
                    <div className="p-3.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#C8A97E] uppercase tracking-wider flex items-center gap-1.5">
                          <span>★</span> Custom Live-Fire Trailer Smoker
                        </span>
                        <Link
                          href="/gallery"
                          className="shrink-0 text-[11px] text-[#FB923C] hover:text-white uppercase font-bold tracking-wider transition"
                        >
                          See Gallery &rarr;
                        </Link>
                      </div>
                      <p className="text-xs text-zinc-300 leading-snug">
                        Marion&rsquo;s heavy-gauge offset smoker rig rolls directly to your park, wedding, or corporate venue rolling live oak &amp; hickory smoke.
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

export default AboutSection;
