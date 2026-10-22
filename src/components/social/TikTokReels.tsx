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
      className="py-20 sm:py-28 px-4 sm:px-8 relative bg-gradient-to-b from-[#0A0A0A] via-[#161311] to-[#0A0A0A] border-y border-amber-950/40 overflow-hidden"
      aria-labelledby="reels-heading"
    >
      {/* Warm Ambient Hickory Smoke Backlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-10 h-[500px] w-[500px] rounded-full bg-orange-700/5 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-10 h-[400px] w-[400px] rounded-full bg-amber-600/5 blur-[130px]"
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-1.5 shadow-sm">
              <svg className="h-3.5 w-3.5 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343a7.975 7.975 0 012.344 5.657 7.974 7.974 0 01-2.343 5.657z" />
              </svg>
              <span>Live Smokehouse Content</span>
            </span>
            <h2
              id="reels-heading"
              className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#F4EFEA] leading-tight"
            >
              TikTok Pitmaster Showcase
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Real documentary footage of our hardwood pit sessions, whole brisket carving,
              and live catering operations. Follow Marion on TikTok at{" "}
              <a
                href={SITE_CONFIG.socials.tiktok}
                target="_blank"
                rel="noreferrer"
                className="text-[#C8A97E] font-bold hover:underline hover:text-white transition-colors"
              >
                @allthesmokecatering
              </a>
              .
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left through reels"
              className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 hover:border-[#C8A97E] text-zinc-300 hover:text-[#C8A97E] flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A97E] shadow-lg"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll right through reels"
              className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 hover:border-[#C8A97E] text-zinc-300 hover:text-[#C8A97E] flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#C8A97E] shadow-lg"
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
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory focus:outline-none focus:ring-1 focus:ring-[#C8A97E] rounded-2xl"
        >
          {REELS_DATA.map((reel) => (
            <div
              key={reel.id}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] rounded-3xl overflow-hidden bg-[#161619] border border-zinc-800 hover:border-[#EA580C]/80 hover:shadow-[0_0_30px_rgba(234,88,12,0.3)] shadow-2xl relative group transition-all duration-300"
            >
              {/* Vertical 9:16 Video Poster */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                <Image
                  src={reel.poster}
                  alt={reel.title}
                  fill
                  sizes="(max-width: 640px) 280px, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                />

                {/* Top Overlay: TikTok Badge & Views */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                  <span className="bg-black/80 backdrop-blur-md text-[11px] font-bold text-white px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    {reel.views} views
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#C8A97E] text-xs font-bold">
                    ♪
                  </div>
                </div>

                {/* Center Hover Play Indicator */}
                <a
                  href={SITE_CONFIG.socials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Watch ${reel.title} on TikTok`}
                  className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 group-hover:bg-black/40 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,122,0,0.8),_inset_0_0_12px_rgba(255,122,0,0.5)] group-hover:border-[#FFA040] transition-all duration-300 font-bold [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.9))]">
                    <svg className="w-7 h-7 fill-white translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </a>

                {/* Right Floating Actions with Clean Vector SVGs */}
                <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-3 text-white text-center">
                  <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FF8C38]">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold">{reel.likes}</span>

                  <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold">{reel.shares}</span>
                </div>

                {/* Bottom Overlay: Metadata & Link */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent p-5 pt-10 z-10 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[#C8A97E]/50 relative shrink-0">
                      <Image
                        src="/brand/allthesmoke-logo.png"
                        alt="All The Smoke Master Crest"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-white hover:text-[#C8A97E] transition-colors">
                      @allthesmokecatering
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-white line-clamp-1">
                    {reel.title}
                  </h3>

                  <p className="text-[11px] text-zinc-300 line-clamp-2 leading-tight">
                    {reel.tagline}
                  </p>

                  <a
                    href={SITE_CONFIG.socials.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 px-4 rounded-[12px] bg-black/60 border border-[#C8A97E]/70 backdrop-blur-md shadow-[0_0_10px_rgba(200,169,126,0.1)] text-[#C8A97E] font-display font-bold text-sm tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-[#FF7A00] hover:text-white hover:bg-black/80 hover:shadow-[0_0_14px_rgba(255,122,0,0.35)] cursor-pointer [text-shadow:_0_1px_2px_rgba(0,0,0,0.95)]"
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
        <div className="p-6 rounded-2xl bg-[#161619] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-950 border border-[#C8A97E]/50 shadow-[0_0_12px_rgba(200,169,126,0.15)] flex items-center justify-center p-1 shrink-0 overflow-hidden">
              <Image
                src="/brand/allthesmoke-logo.png"
                alt="All The Smoke Master Crest"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display text-2xl text-[#F4EFEA] font-bold block">
                Follow the Live Hardwood Smoke
              </span>
              <span className="text-xs text-zinc-400">
                New pitmaster carvings, event recaps, and weekly drop announcements posted weekly.
              </span>
            </div>
          </div>

          <a
            href={SITE_CONFIG.socials.tiktok}
            target="_blank"
            rel="noreferrer"
            className="min-h-[48px] px-7 py-3 rounded-[14px] bg-[radial-gradient(ellipse_at_center,_#C84A0A_0%,_#7E2605_60%,_#2A0D02_100%)] border-2 border-[#FF7A00] shadow-[0_0_18px_rgba(255,122,0,0.5),_inset_0_0_8px_rgba(255,122,0,0.25)] font-display text-sm sm:text-base font-bold tracking-wider text-white uppercase [text-shadow:_0_1px_2px_rgba(0,0,0,0.9)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shrink-0 cursor-pointer"
          >
            VIEW OFFICIAL TIKTOK CHANNEL ↗
          </a>
        </div>
      </div>
    </section>
  );
}
