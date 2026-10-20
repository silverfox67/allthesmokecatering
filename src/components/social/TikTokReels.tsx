"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site-config";

interface ReelItem {
  id: string;
  title: string;
  views: string;
  likes: string;
  shares: string;
  poster: string;
  soundTitle: string;
  tagline: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: "reel-1",
    title: "14-Hour Hickory Brisket Bark Reveal",
    views: "48.2K",
    likes: "4.1K",
    shares: "329",
    poster: "/reels/reel-brisket-carve.jpg",
    soundTitle: "Original Sound - All The Smoke Pitmaster",
    tagline: "Watch Marion slice into whole Texas prime brisket with authentic hardwood smoke ring."
  },
  {
    id: "reel-2",
    title: "Live-Fire Carving & On-Site Station",
    views: "34.8K",
    likes: "2.9K",
    shares: "215",
    poster: "/reels/reel-chef-action.jpg",
    soundTitle: "Slow Smoke Heat - Chicago BBQ Mix",
    tagline: "Theatrical culinary banquet service setup for Chicago weddings and private galas."
  },
  {
    id: "reel-3",
    title: "Glazing St. Louis Cut Rib Slabs",
    views: "52.6K",
    likes: "4.8K",
    shares: "419",
    poster: "/reels/reel-glazed-ribs.jpg",
    soundTitle: "Sizzle & Flame - Hardwood Fire Session",
    tagline: "Live pit basting with house sweet bourbon glaze over cherry and hickory coals."
  },
  {
    id: "reel-4",
    title: "4-Cheese Baked Mac & Scratch Sides",
    views: "29.1K",
    likes: "2.3K",
    shares: "168",
    poster: "/reels/reel-buffet-pan.jpg",
    soundTitle: "Soul Kitchen Grooves - Marion Bolden",
    tagline: "Scratch southern sides pulled fresh from our 3401 N Orange Ave commercial hub."
  }
];

export function TikTokReels() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section
      id="reels"
      className="py-20 sm:py-28 px-4 sm:px-8 bg-obsidian border-b border-white/10 relative"
      aria-labelledby="reels-heading"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-ember text-xs uppercase font-bold tracking-widest bg-charcoal px-3 py-1 rounded-full border border-ember/30 inline-block">
              🔥 Live Smokehouse Content
            </span>
            <h2
              id="reels-heading"
              className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase leading-none"
            >
              TikTok Pitmaster Showcase
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Real documentary footage of our hardwood pit sessions, whole brisket carving,
              and live catering operations. Follow Marion on TikTok at{" "}
              <a
                href={SITE_CONFIG.socials.tiktok}
                target="_blank"
                rel="noreferrer"
                className="text-ember font-bold hover:underline"
              >
                @allthesmokebbq_catering
              </a>
              .
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left through reels"
              className="w-12 h-12 rounded-full bg-charcoal border border-white/20 hover:border-ember text-white hover:text-ember flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-ember"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll right through reels"
              className="w-12 h-12 rounded-full bg-charcoal border border-white/20 hover:border-ember text-white hover:text-ember flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-ember"
            >
              →
            </button>
          </div>
        </div>

        {/* Responsive Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="TikTok Smoked Meat Reels Carousel"
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory focus:outline-none focus:ring-1 focus:ring-ember rounded-2xl scrollbar-thin scrollbar-thumb-ember/30"
        >
          {REELS_DATA.map((reel) => (
            <div
              key={reel.id}
              className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] rounded-3xl overflow-hidden bg-charcoal border border-white/15 hover:border-ember shadow-2xl relative group transition-all duration-300"
            >
              {/* Vertical 9:16 Video Poster */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-obsidian">
                <Image
                  src={reel.poster}
                  alt={reel.title}
                  fill
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                />

                {/* Top Overlay: TikTok Badge & Views */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                  <span className="bg-obsidian/80 backdrop-blur-md text-[11px] font-bold text-white px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
                    {reel.views} views
                  </span>
                  <div className="w-8 h-8 rounded-full bg-obsidian/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs font-bold">
                    ♪
                  </div>
                </div>

                {/* Center Hover Play Indicator */}
                <a
                  href={SITE_CONFIG.socials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Watch ${reel.title} on TikTok`}
                  className="absolute inset-0 flex items-center justify-center z-10 bg-obsidian/20 group-hover:bg-obsidian/40 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-ember/90 text-obsidian flex items-center justify-center text-2xl pl-1 shadow-2xl group-hover:scale-110 group-hover:bg-ember transition-all">
                    ▶
                  </div>
                </a>

                {/* Right Floating Actions (TikTok style) */}
                <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-3 text-white text-center">
                  <div className="w-10 h-10 rounded-full bg-obsidian/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-ember text-base">
                    ❤️
                  </div>
                  <span className="text-[10px] font-bold">{reel.likes}</span>

                  <div className="w-10 h-10 rounded-full bg-obsidian/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-base">
                    💬
                  </div>
                  <span className="text-[10px] font-bold">{reel.shares}</span>
                </div>

                {/* Bottom Overlay: Metadata & Link */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-obsidian via-obsidian/90 to-transparent p-5 pt-10 z-10 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-ember relative flex-shrink-0">
                      <Image
                        src="/brand/ats-monogram.png"
                        alt="All The Smoke Monogram"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-bold text-white hover:text-ember">
                      @allthesmokebbq_catering
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-white line-clamp-1">
                    {reel.title}
                  </h3>

                  <p className="text-[11px] text-neutral-300 line-clamp-2 leading-tight">
                    {reel.tagline}
                  </p>

                  <a
                    href={SITE_CONFIG.socials.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-ember hover:text-obsidian text-white font-bold text-xs py-2.5 rounded-xl transition-all border border-white/20 min-h-[44px] uppercase tracking-wider"
                  >
                    <span>Watch on TikTok</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Channel Banner */}
        <div className="p-6 rounded-2xl bg-charcoal border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-obsidian border border-ember flex items-center justify-center p-2 flex-shrink-0">
              <Image
                src="/brand/ats-monogram.png"
                alt="ATS Avatar"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display text-2xl text-white block">
                FOLLOW THE LIVE HARDWOOD SMOKE
              </span>
              <span className="text-xs text-neutral-400">
                New pitmaster carvings, event recaps, and weekly drop announcements posted weekly.
              </span>
            </div>
          </div>

          <a
            href={SITE_CONFIG.socials.tiktok}
            target="_blank"
            rel="noreferrer"
            className="bg-ember hover:bg-ember-dark text-obsidian font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all min-h-[48px] flex items-center justify-center flex-shrink-0 shadow-lg"
          >
            VIEW OFFICIAL TIKTOK CHANNEL ↗
          </a>
        </div>
      </div>
    </section>
  );
}
