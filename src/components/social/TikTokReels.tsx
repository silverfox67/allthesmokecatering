"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site-config";

interface GallerySpotlightItem {
  id: string;
  tag: string;
  tagIcon: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

const SPOTLIGHT_ITEMS: GallerySpotlightItem[] = [
  {
    id: "spare-ribs",
    tag: "Pit-Smoked Slabs",
    tagIcon: "★",
    title: "St. Louis Cut Spare Ribs",
    subtitle: "Slow-rendered over cherry & hickory hardwood, sliced fresh with deep peppery mahogany bark and smoke ring.",
    image: "/reels/reel-glazed-ribs.webp",
    alt: "Foil pan of sliced St. Louis spare ribs with deep mahogany bark and pink smoke ring",
  },
  {
    id: "mobile-rig",
    tag: "On-Site Live Fire",
    tagIcon: "🚚",
    title: "Custom Mobile Trailer Smoker",
    subtitle: "Our heavy-gauge single-axle offset rig rolling hardwood smoke live at private estates, weddings, and corporate lots.",
    image: "/reels/reel-mobile-trailer.webp",
    alt: "Custom black single-axle mobile trailer smoker rolling smoke outside at night at an event",
  },
  {
    id: "pit-wings-links",
    tag: "Hardwood Coals",
    tagIcon: "🪵",
    title: "Pit Wings & Sizzling Links",
    subtitle: "Crispy seasoned whole smoked wings and beef hot links sizzling directly over open steel firebox grates.",
    image: "/reels/reel-pit-wings.webp",
    alt: "Seasoned smoked chicken wings and sausages sizzling on smoker iron grates",
  },
];

export function TikTokReels() {
  return (
    <section
      id="gallery"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#0A0A0A] via-[#141210] to-[#0A0A0A] border-y border-amber-950/40 overflow-hidden"
      aria-labelledby="gallery-heading"
    >
      {/* Hidden Anchor for backwards compatibility */}
      <span id="reels" className="sr-only">Smokehouse Gallery</span>

      {/* Ambient Hickory Ember Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-0 h-[450px] w-[450px] rounded-full bg-orange-700/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 left-0 h-[400px] w-[400px] rounded-full bg-amber-600/10 blur-[130px]"
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div>
            <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
              ★ THE PITMASTER&apos;S CRAFT IN ACTION ★
            </span>
          </div>
          
          <h2
            id="gallery-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide leading-tight"
          >
            All The Smoke Catering Gallery
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            A visual taste of our hardwood pit sessions, whole-slab carving, and on-site mobile trailer smoker setups across Greater Chicagoland.
          </p>
        </div>

        {/* 3 Clean Spotlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SPOTLIGHT_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 border border-amber-500/25 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] hover:border-[#FF7A00]/70 hover:shadow-[0_0_35px_rgba(234,88,12,0.25)] transition-all duration-500 flex flex-col justify-end"
            >
              {/* Photo Container with 4:5 Portrait Ratio */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle Cinematic Vignette */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" 
                  aria-hidden="true" 
                />

                {/* Top Pill Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[#C8A97E] text-[11px] uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3 py-1 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
                    ★ {item.tag.toUpperCase()} ★
                  </span>
                </div>

                {/* Bottom Text Content Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 space-y-2">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action & Social Bar */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <span>📸</span> Want to See More Live Smoker Action?
            </span>
            <p className="text-xs sm:text-sm text-zinc-400">
              Browse our full documentary photo archive, private party setups, and live pit video clips.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/gallery"
              className="inline-flex h-11 px-5 items-center justify-center rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white font-display text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_18px_rgba(234,88,12,0.35)] transition-all hover:scale-105 active:scale-95"
            >
              View Full Gallery &amp; Videos →
            </Link>
            
            <a
              href={SITE_CONFIG.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 px-4 items-center justify-center rounded-xl bg-black/70 hover:bg-black border border-[#C8A97E]/40 text-[#C8A97E] hover:text-white font-display text-xs font-bold tracking-wider uppercase transition-colors"
            >
              TikTok @allthesmokebbq_catering ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
