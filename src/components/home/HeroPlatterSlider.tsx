"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface PlatterItem {
  id: string;
  tabLabel: string;
  tag: string;
  title: string;
  description: string;
  badge: string;
  image: string;
  alt: string;
  packageKey: string;
}

const PLATTERS: PlatterItem[] = [
  {
    id: "brisket-feast",
    tabLabel: "Prime Brisket Feast",
    tag: "14-Hour Low & Slow",
    title: "The Grand Smokehouse Platter",
    description:
      "Tender hand-sliced prime Texas brisket with deep peppery bark, smoked beef sausage links, pickled red onions, jalapeños, and house BBQ sauce.",
    badge: "Feeds 15–25",
    image: "/images/hero/hero-platter-brisket-feast.jpg",
    alt: "Top-down flat-lay shot of prime smoked brisket platter on butcher paper with sausage links, pickles, and cornbread",
    packageKey: "The Pitmaster Classic",
  },
  {
    id: "ribs-wings",
    tabLabel: "Glazed Ribs & Wings",
    tag: "Crowd Favorite",
    title: "St. Louis Rib & Wing Board",
    description:
      "Stack of tender St. Louis cut spare ribs lacquered in sweet mahogany cherry glaze, crispy pit-smoked wings, skillet mac & cheese, and slaw.",
    badge: "Feeds 20–35",
    image: "/images/hero/hero-platter-ribs-wings.jpg",
    alt: "Overhead view of glazed St. Louis ribs, crispy seasoned pit wings, and golden baked mac and cheese",
    packageKey: "The Smokehouse Combo",
  },
  {
    id: "banquet-spread",
    tabLabel: "Banquet Feast",
    tag: "Executive Spread",
    title: "Smokehouse Banquet Platter",
    description:
      "Golden hardwood-smoked chicken halves, cedar-plank wild salmon fillet with glaze, southern brown sugar baked beans, and skillet cornbread.",
    badge: "Feeds 30–60+",
    image: "/images/hero/hero-platter-banquet-spread.jpg",
    alt: "Overhead flat-lay of smoked chicken halves, cedar plank salmon, and gourmet southern catering sides",
    packageKey: "The Whole Hog & Rib Experience",
  },
];

const AUTOPLAY_INTERVAL = 5500; // 5.5 seconds per slide

export function HeroPlatterSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PLATTERS.length);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % PLATTERS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + PLATTERS.length) % PLATTERS.length);
  };

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
  };

  const handleQuoteClick = (packageKey: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-quote-modal", { detail: { packageKey } })
      );
    }
  };

  const currentPlatter = PLATTERS[activeIndex];

  return (
    <div
      className="relative w-full max-w-xl lg:max-w-2xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#181512] via-[#12100E] to-[#0A0A0A] border border-amber-500/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] transition-all duration-300 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Featured Smokehouse Catering Platters Carousel"
    >
      {/* Top Header Card Bar */}
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00] animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C8A97E]">
            ★ FEATURED SMOKEHOUSE PLATTER ★
          </span>
        </div>
        <span className="text-xs font-bold text-amber-400/90 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
          {currentPlatter.badge}
        </span>
      </div>

      {/* Main Image Display (4:3 ratio for food presentation) */}
      <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        {PLATTERS.map((platter, idx) => (
          <div
            key={platter.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === activeIndex
                ? "opacity-100 pointer-events-auto z-10"
                : "opacity-0 pointer-events-none z-0"
            }`}
          >
            <Image
              src={platter.image}
              alt={platter.alt}
              fill
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Cinematic Gradient Vignette */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none"
              aria-hidden="true"
            />
            {/* Subtle Amber Glow at Bottom */}
            <div
              className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>
        ))}

        {/* Floating Tag Overlay */}
        <div className="absolute top-4 left-4 z-20">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-white bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 shadow-lg">
            {currentPlatter.tag}
          </span>
        </div>

        {/* Left / Right Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Platter"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-[#C8A97E] hover:text-[#FF7A00] flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm opacity-80 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Platter"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-[#C8A97E] hover:text-[#FF7A00] flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm opacity-80 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Overlay Content on Photo Bottom */}
        <div className="absolute bottom-3 inset-x-4 sm:inset-x-6 z-20 space-y-1 text-left pointer-events-none">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-md">
            {currentPlatter.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-snug line-clamp-2 drop-shadow">
            {currentPlatter.description}
          </p>
        </div>
      </div>

      {/* Bottom Interactive 3-Tab Bar with Timed Progress */}
      <div className="p-3 sm:p-4 bg-black/70 backdrop-blur-md border-t border-white/10 space-y-3">
        {/* 3 Clickable Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {PLATTERS.map((platter, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={platter.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`relative px-2.5 py-2.5 rounded-xl text-left transition-all overflow-hidden border ${
                  isActive
                    ? "bg-amber-950/40 border-amber-500/80 shadow-[0_0_15px_rgba(234,88,12,0.25)]"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
                }`}
              >
                {/* Active Tab Progress Indicator Bar */}
                {isActive && (
                  <div
                    key={`progress-${idx}-${isPaused}`}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#FF7A00] to-[#E5A967]"
                    style={{
                      width: "100%",
                      animation: isPaused
                        ? "none"
                        : `progressAnim ${AUTOPLAY_INTERVAL}ms linear`,
                    }}
                  />
                )}

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isActive ? "text-[#FF7A00]" : "text-zinc-500"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className={`text-xs font-bold truncate block ${
                      isActive ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {platter.tabLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Action Bar under tabs */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-zinc-400 text-[11px] hidden sm:inline">
            💡 Click any tab or use arrows to view signature platters
          </span>
          <button
            type="button"
            onClick={() => handleQuoteClick(currentPlatter.packageKey)}
            className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#FF7A00] hover:to-[#EA580C] text-white font-display text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(234,88,12,0.3)] hover:scale-105 active:scale-95"
          >
            <span>Request Quote for This Platter</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressAnim {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default HeroPlatterSlider;
