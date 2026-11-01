"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WEEKLY_CHALKBOARD, WeeklyChalkboardItem } from "@/data/pitmaster-menu";
import { OrderTrayProvider, useOrderTray } from "@/context/OrderTrayContext";
import { SmokehouseOrderTray } from "@/components/tray/SmokehouseOrderTray";
import { SmokehouseTrayButton } from "@/components/tray/SmokehouseTrayButton";
import { QuoteModal } from "@/components/forms/QuoteModal";
import { Footer } from "@/components/layout/Footer";

function ChalkboardContent() {
  const { addItem } = useOrderTray();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddSpecial = (special: WeeklyChalkboardItem) => {
    addItem({
      id: special.id,
      baseId: special.menuTargetId,
      name: special.name,
      selectedOption: special.price,
      price: special.parsedPrice,
      category: "Weekly Chalkboard Special",
    });

    setAddedId(special.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* AUTHENTIC SMOKEHOUSE TIMBER CHALKBOARD FRAME */}
      <div className="chalkboard-timber-frame shadow-2xl">
        {/* Deep Slate Chalkboard Surface */}
        <div className="chalkboard-slate rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
          {/* Hand-Drawn Dashed Chalk Perimeter */}
          <div className="border border-dashed border-white/20 rounded-lg sm:rounded-xl p-3.5 sm:p-6 md:p-7">
            
            {/* Chalkboard Header */}
            <div className="text-center pb-6 border-b border-dashed border-white/20">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-chalk chalk-yellow text-xs sm:text-sm tracking-widest font-bold">
                  ★ {WEEKLY_CHALKBOARD.badge} ★
                </span>
              </div>
              <h1 className="font-chalk chalk-orange text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide">
                {WEEKLY_CHALKBOARD.headline}
              </h1>
              <p className="font-chalk chalk-white text-xs sm:text-sm opacity-85 mt-1">
                {WEEKLY_CHALKBOARD.season} • Complete Smoker Lineup
              </p>
            </div>

            {/* All 8 Pure Chalk Handwritten Specials - Resilient 2-Row Micro-Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3.5 mt-7">
              {WEEKLY_CHALKBOARD.items.map((special, idx) => {
                const isJustAdded = addedId === special.id;

                return (
                  <div
                    key={special.id}
                    className="group border-b border-dashed border-white/15 py-2.5 px-2 rounded-lg hover:bg-white/[0.03] transition-all flex flex-col gap-1.5"
                  >
                    {/* Row 1: Dish # Badge + Full Title + Dotted Leader Line + Chalk Price */}
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 w-full">
                      <span className="font-chalk chalk-yellow text-xs sm:text-sm font-bold shrink-0">
                        #{idx + 1}
                      </span>
                      <h2 className="font-chalk chalk-white text-base sm:text-lg font-bold group-hover:text-[#FB923C] transition-colors leading-snug flex-1 min-w-[10rem]">
                        {special.name}
                      </h2>
                      
                      <span className="font-chalk chalk-yellow text-xs sm:text-sm font-bold whitespace-nowrap shrink-0">
                        {special.price}
                      </span>
                    </div>

                    {/* Row 2: 1-line Tagline / Ingredients + Action CTAs */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <p className="font-chalk text-[11px] sm:text-xs text-neutral-300/85 italic leading-tight basis-full sm:basis-0 sm:flex-1 min-w-0 sm:truncate">
                        {special.tagline}
                      </p>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* 1. View in Menu Link */}
                        <Link
                          href={`/#menu`}
                          className="font-chalk text-[11px] sm:text-xs text-neutral-300 hover:text-white bg-white/5 hover:bg-white/15 px-3 py-1 min-h-12 sm:min-h-0 flex-1 sm:flex-none justify-center rounded border border-white/15 transition flex items-center gap-1"
                          title="View photo and full description in menu"
                        >
                          <span>Menu</span>
                          <span>→</span>
                        </Link>

                        {/* 2. Direct Add to Tray CTA */}
                        <button
                          type="button"
                          onClick={() => handleAddSpecial(special)}
                          className={`font-chalk text-xs font-bold px-3 py-1 min-h-12 sm:min-h-0 flex-1 sm:flex-none justify-center rounded border transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                            isJustAdded
                              ? "bg-emerald-600/90 text-white border-emerald-500"
                              : "chalk-orange bg-[#FB923C]/10 hover:bg-[#FB923C]/25 border-[#FB923C]/40"
                          }`}
                        >
                          <span>{isJustAdded ? "✓ Added" : "+ Add"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Chalk Notice */}
            <div className="mt-8 pt-5 border-t border-dashed border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="font-chalk chalk-white text-xs opacity-90">
                  ★ Smoked fresh on Marion Bolden&rsquo;s live-fire trailer rig in Chicago.
                </p>
                <p className="font-chalk chalk-yellow text-[11px] opacity-80 mt-0.5">
                  Weekend commissary pickup or heated drop-off delivery across Cook, Will, DuPage &amp; Lake counties.
                </p>
              </div>

              <a
                href="tel:7085154676"
                className="font-chalk text-xs chalk-orange hover:underline shrink-0"
              >
                Questions? Call/Text (708) 515-4676
              </a>
            </div>

          </div>
        </div>

        {/* Rustic Chalk Tray Ledge with Chalk Sticks & Felt Eraser */}
        <div className="chalk-tray-ledge" aria-hidden="true">
          <div className="w-5 h-1.5 bg-[#F5F5F0] rounded-xs shadow-sm rotate-[-2deg] opacity-90" title="White Chalk" />
          <div className="w-4 h-1.5 bg-[#FCD34D] rounded-xs shadow-sm rotate-[1deg] opacity-90" title="Yellow Chalk" />
          <div className="w-4 h-1.5 bg-[#FB923C] rounded-xs shadow-sm opacity-90" title="Orange Chalk" />
          <div className="w-8 h-2.5 bg-[#3A3127] rounded-xs border border-black/60 shadow-sm flex flex-col justify-end overflow-hidden" title="Felt Eraser">
            <div className="w-full h-1 bg-[#191613]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpecialsClient() {
  return (
    <OrderTrayProvider>
      <main className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col relative">
        {/* Top Sticky Navigation */}
        <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/#menu"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-300 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Back to Menu</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#C8A97E]/50">
                <Image
                  src="/brand/allthesmoke-logo.png"
                  alt="All The Smoke Official Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-[#FF7A00] transition-colors">
                ALL THE SMOKE
              </span>
            </Link>

            <a
              href="/#contact"
              className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white font-display text-xs font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(234,88,12,0.35)] transition-all hover:scale-105 active:scale-95"
            >
              Get Quote
            </a>
          </div>
        </header>

        {/* Ambient Amber Glow Background */}
        <div className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#141210] via-[#0A0A0A] to-[#121214] flex-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-[450px] w-[650px] rounded-full bg-[#EA580C]/10 blur-[160px]"
          />

          {/* Section Heading */}
          <div className="max-w-3xl mx-auto text-center mb-10 relative z-10">
            <div className="mb-3">
              <span className="text-[#C8A97E] text-xs uppercase font-extrabold tracking-widest bg-zinc-900/90 px-4 py-1.5 rounded-full border border-[#C8A97E]/30 inline-flex items-center gap-2 shadow-sm">
                <span>★</span>
                <span>CHICAGOLAND LIVE-FIRE SMOKER SPECIALS</span>
                <span>★</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Pitmaster Weekly Chalkboard
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
              All 8 rotating hardwood cuts and pit specials currently rolling on Marion Bolden&rsquo;s trailer smoker.
            </p>
          </div>

          {/* The Handcrafted Full Chalkboard */}
          <div className="relative z-10">
            <ChalkboardContent />
          </div>

          {/* Bottom Back Link */}
          <div className="text-center mt-12 relative z-10">
            <Link
              href="/#menu"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors border border-white/10 px-5 py-2.5 rounded-full bg-zinc-900/60"
            >
              <span>←</span>
              <span>Back to Full Catering Menu &amp; Party Pans</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Modals & Trays */}
        <QuoteModal />
        <SmokehouseOrderTray />
        <SmokehouseTrayButton />
      </main>
    </OrderTrayProvider>
  );
}

